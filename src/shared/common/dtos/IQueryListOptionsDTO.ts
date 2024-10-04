export enum OrdenationProps {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IQueryListOptionsDTO {
  page?: number;
  perPage?: number;
  order?: OrdenationProps;
}
