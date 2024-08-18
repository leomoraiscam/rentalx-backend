import csvParse from 'csv-parse';
import fs from 'fs';

import { ICSVStreamParserProvider } from '../models/ICSVStreamParserProvider';

export class CSVStreamParserProvider implements ICSVStreamParserProvider {
  public async parse<T>(filePath: string, keys: string[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      const parseFile = csvParse();
      const results: T[] = [];

      stream.pipe(parseFile);
      parseFile
        .on('data', (line) => {
          const entry = {} as T;

          keys.forEach((key, index) => {
            entry[key] = line[index];
          });

          results.push(entry);
        })
        .on('end', () => {
          fs.promises.unlink(filePath);
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
