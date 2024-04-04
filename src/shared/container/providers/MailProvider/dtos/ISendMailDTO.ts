export interface ISendMailDTO<T> {
  to: string;
  subject: string;
  variables: T;
  path: string;
}
