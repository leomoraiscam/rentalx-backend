export interface IDetailRentalResponseDTO {
  id: string;
  status: string;
  vehicle: {
    brand: string;
    model: string;
    image?: string;
    licensePlate: string;
  };
  period: {
    startDate: Date;
    endDate: Date;
  };
  finance: {
    total: number;
  };
}
