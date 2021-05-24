import IEmailRepository from '../../../repositories/IEmailRepository';
import Email from '../entities/Email';

class EmailRepository implements IEmailRepository {
  async findMailByType(type: string): Promise<Email> {}
}

export default EmailRepository;
