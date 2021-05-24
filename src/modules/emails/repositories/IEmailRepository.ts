import Email from '../infra/typeorm/entities/Email';

interface IEmailRepository {
  findMailByType(type: string): Promise<Email>;
}

export default IEmailRepository;
