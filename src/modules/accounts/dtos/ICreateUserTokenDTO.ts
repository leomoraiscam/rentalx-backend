import { TokenTypeEnum } from '../enums/TokenTypeEnum';

export interface ICreateUserTokenDTO {
  userId: string;
  expiresDate: Date;
  refreshToken: string;
  type: TokenTypeEnum;
}
