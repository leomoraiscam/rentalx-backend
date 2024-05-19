import { ISeederHandler } from './ports/ISeederHandler';

export const adaptSeederHandler = (handler: ISeederHandler) => {
  return async (data: any) => {
    await handler.handle(data);
  };
};
