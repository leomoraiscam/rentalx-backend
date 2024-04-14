export interface ICreateRentalDTO {
  userId: string;
  carId: string;
  expectedReturnDate: Date;
  startDate?: Date;
  id?: string;
  endDate?: Date;
  total?: number;
  status?: string;
}
