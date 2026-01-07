import { TokenTypeEnum } from '../enums/TokenTypeEnum';

export interface IFindTokenByUserIdDTO {
  userId: string;
  refreshToken: string;
  type: TokenTypeEnum;
}
