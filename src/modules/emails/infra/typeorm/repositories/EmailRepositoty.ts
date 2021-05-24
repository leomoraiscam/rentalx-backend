import { getRepository, Repository } from 'typeorm';

import IEmailRepository from '../../../repositories/IEmailRepository';
import Email from '../entities/Email';

class EmailRepository implements IEmailRepository {
  private repository: Repository<Email>;

  constructor() {
    this.repository = getRepository(Email);
  }

  async findMailByType(type: string): Promise<Email> {
    const email = await this.repository.findOne({
      where: {
        type,
      },
    });

    return email;
  }
}

export default EmailRepository;
