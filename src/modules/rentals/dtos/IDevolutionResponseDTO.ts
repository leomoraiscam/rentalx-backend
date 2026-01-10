export interface IDevolutionResponseDTO {
  rentalId: string;
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
    category: string;
  };
  period: {
    startDate: Date;
    endDate: Date;
    durationInDays: number;
    delayInDays: number;
  };
  finance: {
    dailyRate: number;
    daysCharged: number;
    subtotalDaily: number;
    fineAmount: number;
    total: number;
  };
  status: string;
}
