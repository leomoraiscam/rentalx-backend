import { TokenTypeEnum } from '../enums/tokenTypeEnum';

export interface IFindTokenByUserIdDTO {
  userId: string;
  refreshToken: string;
  type: TokenTypeEnum;
}
