import { IProfileUserDTO } from './IProfileUserDTO';

export interface IAuthenticatedUserDTO {
  user: IProfileUserDTO;
  token: string;
  refreshToken: string;
}
