export interface ILimitMulterConfig {
  limits: {
    fileSize: number;
  };
}

export interface IMulterConfig<TStorage> {
  tmpFolder: string;
  storage: TStorage;
}
