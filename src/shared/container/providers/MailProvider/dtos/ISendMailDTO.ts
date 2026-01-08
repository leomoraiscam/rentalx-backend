export interface ISendMailDTO<T = unknown> {
  to: string;
  subject: string;
  variables: T;
  path: string;
}
