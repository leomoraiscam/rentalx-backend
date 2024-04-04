import { User } from '../infra/typeorm/entities/User';

export interface IAuthenticatedUserDTO {
  user: User;
  token: string;
  refreshToken: string;
}
