# Documentação Consolidada: RentalX - Requisitos e Arquitetura

Esta documentação serve como o "Mapa do Arquiteto" para o desenvolvimento e manutenção das funcionalidades core do sistema RentalX.

---

## 🔐 1. Módulo de Autenticação e Perfis (Accounts)

Gerencia a identidade, segurança e personalização dos usuários.

### [RF] Requisitos Funcionais
1.  **Cadastro de Usuário**: Informar Nome, E-mail, Senha e CNH. Retorno com senha omitida.
2.  **Autenticação**: Login via E-mail/Senha com retorno de Access Token e Refresh Token.
3.  **Perfil do Usuário**: Visualização de dados do usuário autenticado (senha omitida).
4.  **Recuperação de Senha**: Solicitação via e-mail com link de token único.
5.  **Redefinição de Senha**: Troca de senha via token válido recebido por e-mail.
6.  **Refresh Token**: Renovação de sessão sem necessidade de novo login.
7.  **Avatar do Usuário**: Upload e atualização de imagem de perfil.

### [RN] Regras de Negócio
-   **[Unicidade]**: E-mail e CNH devem ser únicos no sistema.
-   **[Segurança]**: Senha sempre criptografada (bcrypt). Erro genérico em falha de login.
-   **[Sessão]**: 
    - Token de acesso com expiração (padrão 2h).
    - Refresh Token rotativo (um uso invalida o antigo).
-   **[Recuperação]**: 
    - Token de recuperação expira em 3 horas. 
    - Reset de senha invalida todos os tokens ativos (logout global).
-   **[Avatar]**: Substituição apaga fisicamente o arquivo anterior do storage.

### [RNF] Requisitos Não Funcionais
-   **Bibliotecas**: `bcryptjs`, `jsonwebtoken` (JWT), `multer`, `uuid v4`.
-   **Storage**: Híbrido (Local para Dev / S3 para Prod).
-   **Email**: Envio assíncrono via `nodemailer` (Ethereal/SES).

> [!CAUTION]
> **Visão do Arquiteto (Risco de Segurança)**: O JWT é *stateless*. Para garantir que o logout global (no reset de senha) realmente funcione, é recomendado implementar uma **Blacklist** temporária ou um `token_version` para invalidar Access Tokens que ainda não expiraram.

---

## 🚗 2. Módulo de Frota (Cars)

Gerencia o catálogo, categorias e especificações dos veículos.

### [RF] Requisitos Funcionais
1.  **Cadastro de Categoria**: (Nome, Descrição, Tipo).
2.  **Listagem de Categorias**: Listagem paginada e ordenada.
3.  **Importação (CSV)**: Importação em lote de Categorias e Especificações.
4.  **Cadastro de Especificação**: (Nome, Descrição).
5.  **Cadastro de Carro**: (Nome, Descrição, Diária, Placa, Multa, Marca, Categoria, Especificações).
6.  **Upload de Imagens**: Múltiplas fotos por veículo.
7.  **Listagem de Carros**: Consulta agrupada por categoria com filtros (Marca, Tipo, Categoria).

### [RN] Regras de Negócio
-   **[Permissão]**: Apenas usuários com `isAdmin: true` podem Criar/Importar/Editar dados de frota.
-   **[Integridade]**: 
    - Carro deve estar vinculado a uma Categoria e Especificações existentes.
    - Placa deve ser única.
-   **[Importação]**: Ignorar linhas duplicadas ou já existentes no banco.

### [RNF] Requisitos Não Funcionais
-   **Bibliotecas**: `multer`, `csv-parse`.
-   **Performance**: Processamento de CSV via **Stream** para economia de memória.
-   **Resiliência**: Rollback de arquivos físicos no storage se o salvamento no banco de dados falhar.

---

## 📅 3. Módulo de Locação (Rentals)

O coração financeiro e operacional: gerencia o ciclo de vida do aluguel.

### [RF] Requisitos Funcionais
1.  **Criação de Aluguel**: Reserva agendada (Carro, Data Início, Data Retorno).
2.  **Entrega (Pickup)**: Registro do momento da retirada do veículo.
3.  **Devolução (Devolution)**: Entrega do carro com cálculo automático de diárias e multas.
4.  **Atualização**: Alteração de datas ou veículo antes da retirada.
5.  **Cancelamento**: Cancelamento de reserva confirmada.
6.  **Listagem**: Histórico do usuário e visão geral do administrador (paginada).

### [RN] Regras de Negócio
-   **[Temporal]**: 
    - Duração mínima de 24 horas.
    - Agendamento apenas para datas futuras.
    - Operação apenas em horário comercial (08:00 - 18:00).
-   **[Disponibilidade]**:
    - Carro não pode ter reservas sobrepostas.
    - Usuário não pode ter dois aluguéis ativos simultâneos.
-   **[Estados]**:
    - Pickup muda Carro p/ `RENTED` e Aluguel p/ `PICKED_UP`.
    - Devolução volta Carro p/ `AVAILABLE` e fecha Aluguel.
-   **[Financeiro]**: Multa proporcional ao atraso multiplicada pelo `fineAmount` do carro.

### [RNF] Requisitos Não Funcionais
-   **Abstração**: Uso de `DateProvider` centralizado para evitar bugs de timezone e cálculos manuais de dias/horas.

> [!WARNING]
> **Visão do Arquiteto (Risco de Concorrência)**: Em horários de pico, dois usuários podem tentar alugar o mesmo carro no mesmo segundo. É fundamental o uso de **Pessimistic Locking** (`SELECT FOR UPDATE`) no banco de dados durante a criação da reserva para prevenir o *Double Booking*.

---
