# 📋 Backlog de Implementação: RentalX

Esta lista detalha as tarefas necessárias para implementar ou validar todas as regras de negócio e requisitos discutidos.

---

## 🔐 Módulo 1: Accounts (Contas e Segurança)

| Tarefa | Descrição | Prioridade | Complexidade | Arquivo Principal |
| :--- | :--- | :---: | :---: | :--- |
| **[AC-01]** Validar unicidade de CNH | Impede que dois usuários usem o mesmo documento de motorista no sistema. | Alta | Baixa | [CreateUserUseCase.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/accounts/useCases/createUser/CreateUserUseCase.ts) |
| **[AC-02]** Configurar Expiração do JWT | Define o `expiresIn` para 2h para reduzir a janela de exposição de tokens interceptados. | Média | Baixa | [auth.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/config/auth.ts) |
| **[AC-03]** Logout Global no Reset | Implementa a invalidação de todos os tokens (Refresh/Access) após a troca de senha por segurança. | Alta | Média | [ResetPasswordUseCase.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/accounts/useCases/resetPassword/ResetPasswordUseCase.ts) |
| **[AC-04]** Bloqueio de Senha Atual | Garante que a nova senha informada no reset seja obrigatoriamente diferente da senha antiga. | Média | Baixa | [ResetPasswordUseCase.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/accounts/useCases/resetPassword/ResetPasswordUseCase.ts) |
| **[AC-05]** AWS S3 Storage Provider | Configura o provider de produção para garantir durabilidade e escalabilidade de imagens. | Alta | Média | [StorageProvider](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/shared/container/providers/StorageProvider/index.ts) |

---

## 🚗 Módulo 2: Cars (Gestão de Frota)

| Tarefa | Descrição | Prioridade | Complexidade | Arquivo Principal |
| :--- | :--- | :---: | :---: | :--- |
| **[CR-01]** Middleware `ensureAdmin` | Protege as rotas de escrita, garantindo que apenas administradores gerenciem a frota. | Crítica | Média | [routes](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/shared/infra/http/routes/index.ts) |
| **[CR-02]** Tipagem da Placa (DB) | Corrige o tipo da coluna `license_plate` de `int` para `string` para suportar placas reais. | Crítica | Baixa | [Car.ts (Entity)](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/cars/infra/typeorm/entities/Car.ts) |
| **[CR-03]** Validação de Arquivo CSV | Verifica o MIME type e a extensão do arquivo no controller antes de iniciar o processamento. | Média | Baixa | [ImportCategoriesController.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/cars/useCases/importCategories/ImportCategoriesController.ts) |
| **[CR-04]** Rollback Físico de Imagens | Garante que arquivos órfãos sejam deletados do storage caso o salvamento no banco falhe. | Alta | Média | [UploadCarImagesUseCase.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/cars/useCases/uploadCarImages/UploadCarImagesUseCase.ts) |

---

## 📅 Módulo 3: Rentals (Operação de Aluguéis)

| Tarefa | Descrição | Prioridade | Complexidade | Arquivo Principal |
| :--- | :--- | :---: | :---: | :--- |
| **[RT-01]** Trava de Concorrência | Implementa `pessimistic_write` lock na consulta do carro para evitar aluguéis duplicados. | Crítica | Alta | [CreateRentalUseCase.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/rentals/useCases/createRental/CreateRentalUseCase.ts) |
| **[RT-02]** Janela de Horário Comercial | Valida se a reserva inicia/termina entre 08h e 18h (regra operacional da agência). | Alta | Baixa | [RentalDateService.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/rentals/services/implementations/RentalDateService.ts) |
| **[RT-03]** Snapshot de Preço Diário | Salva o preço da diária no registro do aluguel para blindar o contrato contra futuras mudanças. | Média | Média | [CreateRentalUseCase.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/rentals/useCases/createRental/CreateRentalUseCase.ts) |
| **[RT-04]** Transação de Agendamento | Envolve a reserva e o status do carro em uma transaction única para garantir atomicidade. | Crítica | Média | [CreateRentalUseCase.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/rentals/useCases/createRental/CreateRentalUseCase.ts) |
| **[RT-05]** Bloqueio de Datas Passadas | Impede que usuários tentem agendar aluguéis com data de início anterior ao momento atual. | Alta | Baixa | [RentalDateService.ts](file:///Users/lmorais/Documents/Estudos/Programacao/Codigos/Backend/Node/rentalx-backend/src/modules/rentals/services/implementations/RentalDateService.ts) |

---

### 💡 Dicas do Arquiteto para Implementação:

- **Para [RT-01] (Locking):** Utilize o `queryRunner` do TypeORM para iniciar uma transação e use `.setLock("pessimistic_write")` na consulta do carro antes de criar o aluguel.
- **Para [RT-04] (Transação):** O uso do `Promise.all` não garante atomicidade de banco de dados. Use o `connection.transaction` ou `queryRunner` para garantir que se um `save` falhar, o outro sofra rollback.
- **Para [AC-03] (Logout Global):** Adicione um campo `token_version` na tabela de `User` e valide-o no `ensureAuthenticated` middleware. Ao resetar a senha, incremente essa versão.
