export interface ICSVStreamParserProvider {
  parse<T>(filePath: string, keys: string[]): Promise<T[]>;
}
