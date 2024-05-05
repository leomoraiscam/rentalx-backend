import { RentalStatus } from './enums/RentatStatus';

export interface IUpdateStatusRentalDTO {
  id: string;
  status: RentalStatus;
}
