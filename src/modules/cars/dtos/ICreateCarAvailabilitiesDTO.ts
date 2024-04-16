interface IAvailabilitiesPropertiesDTO {
  carId: string;
  quantity: number;
}

export interface ICreateCarAvailabilitiesDTO {
  inventory: IAvailabilitiesPropertiesDTO[];
}
