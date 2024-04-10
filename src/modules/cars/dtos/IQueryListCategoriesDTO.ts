export enum OrdenationProps {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IQueryListCategoriesDTO {
  page?: number;
  perPage?: number;
  order?: OrdenationProps;
}
