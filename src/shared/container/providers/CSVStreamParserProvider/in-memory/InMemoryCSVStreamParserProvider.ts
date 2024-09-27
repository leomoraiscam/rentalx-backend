import { ICSVStreamParserProvider } from '../models/ICSVStreamParserProvider';

export class InMemoryCSVStreamParserProvider
  implements ICSVStreamParserProvider {
  public async parse<T>(filePath: string, keys: string[]): Promise<T[]> {
    const isCategoryData = keys.includes('type');
    const isSpecificationData =
      !keys.includes('type') && keys.includes('description');

    if (isCategoryData) {
      const categoriesLine: T[] = [
        ({
          name: 'Category 1',
          description: 'Description 1',
          type: 'Type 1',
        } as unknown) as T,
        ({
          name: 'Category 2',
          description: 'Description 2',
          type: 'Type 2',
        } as unknown) as T,
      ];

      return categoriesLine;
    }

    if (isSpecificationData) {
      const specificationsLine: T[] = [
        ({
          name: 'Specification 1',
          description: 'Description 1',
        } as unknown) as T,
        ({
          name: 'Specification 2',
          description: 'Description 2',
        } as unknown) as T,
      ];

      return specificationsLine;
    }

    return [];
  }
}
