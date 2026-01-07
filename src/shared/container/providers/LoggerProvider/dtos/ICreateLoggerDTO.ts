export interface ICreateLoggerDTO {
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
}
