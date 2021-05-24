import { v4 as uuidv4 } from 'uuid';

import Email from '@modules/emails/infra/typeorm/entities/Email';

import IEmailRepository from '../IEmailRepository';

class EmailRepositoryInMemory implements IEmailRepository {
  emails: Email[] = [];

  constructor() {
    const params = {
      id: uuidv4(),
      type: 'forgot',
      content: 'forgot content for unit tets',
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.emails.push(params);
  }

  async findMailByType(type: string): Promise<Email> {
    const email = this.emails.find((email) => email.type === type);

    return email;
  }
}

export default EmailRepositoryInMemory;
