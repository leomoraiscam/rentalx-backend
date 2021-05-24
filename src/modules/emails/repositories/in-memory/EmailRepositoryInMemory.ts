import Email from '@modules/emails/infra/typeorm/entities/Email';

import IEmailRepository from '../IEmailRepository';

class EmailRepositoryInMemory implements IEmailRepository {
  emails: Email[] = [];

  async findMailByType(type: string): Promise<Email> {
    const email = this.emails.find((email) => email.type === type);

    return email;
  }
}

export default EmailRepositoryInMemory;
