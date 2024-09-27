import { hash, compare } from 'bcryptjs';

import { IHashProvider } from '../models/IHashProvider';

export class BCryptHashProvider implements IHashProvider {
  private SALT_RANDOM_BYTES = 8;

  public async generateHash(payload: string): Promise<string> {
    return hash(payload, this.SALT_RANDOM_BYTES);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
