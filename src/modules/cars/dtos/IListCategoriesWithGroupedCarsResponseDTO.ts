export interface IListCategoriesWithGroupedCarsResponseDTO {
  id: string;
  name: string;
  type: string;
  models: {
    name: string;
    brand: string;
    description: string;
    specifications: unknown;
    images: unknown;
    dailyRate: number;
    fineAmount: number;
    total: number;
    totalAvailable: number;
  }[];
  available: boolean;
}
