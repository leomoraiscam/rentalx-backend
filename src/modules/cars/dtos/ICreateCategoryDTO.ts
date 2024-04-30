export enum CategoryType {
  HATCH = 'hatch',
  SEDAN = 'sedan',
  SUV = 'suv',
  SPORT = 'sport',
}

export interface ICreateCategoryDTO {
  name: string;
  description: string;
  type: CategoryType;
}
