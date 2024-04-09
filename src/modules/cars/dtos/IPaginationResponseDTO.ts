export interface IPaginationQueryResponseDTO<T> {
  result: T[];
  total: number;
}

export interface IPaginationResponseDTO<T> {
  data: T[];
  total: number;
  totalPages: number;
}
