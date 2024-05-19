export interface ISeederHandler<T = any> {
  handle: (data: T) => Promise<void>;
}
