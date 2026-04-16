import { TokenTypeEnum } from '../enums/tokenTypeEnum';

export interface ICreateUserTokenDTO {
  userId: string;
  expiresDate: Date;
  refreshToken: string;
  type: TokenTypeEnum;
}
