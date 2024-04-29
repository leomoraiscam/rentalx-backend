export enum CategoryType {
  HATCH = 'hatch',
  SEDAN = 'sedan',
  SUV = 'suv',
}

export interface ICreateCategoryDTO {
  name: string;
  description: string;
  type: CategoryType;
}
