/* eslint-disable no-useless-return */
/* eslint-disable no-restricted-syntax */
import csvParse from 'csv-parse';
import fs from 'fs';

import { AppError } from '@shared/errors/AppError';

import { ICSVStreamParserProvider } from '../models/ICSVStreamParserProvider';

export class CSVStreamParserProvider implements ICSVStreamParserProvider {
  public async parse<T>(filePath: string, keys: string[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      const results: T[] = [];

      const parseFile = csvParse({
        columns: true,
        trim: true,
        skip_empty_lines: true,
        bom: true,
        delimiter: [',', ';'],
      });

      stream.pipe(parseFile);

      stream.pipe(parseFile);
      parseFile
        .on('data', (line) => {
          const fileKeys = Object.keys(line);

          if (fileKeys.length !== keys.length) {
            stream.destroy();
            reject(new AppError('Invalid CSV format', 422));
            return;
          }

          const hasAllKeys = keys.every((expectedKey) =>
            fileKeys.includes(expectedKey)
          );

          if (!hasAllKeys) {
            stream.destroy();

            reject(new AppError('Invalid CSV format', 422));
            return;
          }

          const isHeaderRow = keys.every((key) => line[key] === key);
          if (isHeaderRow) {
            return;
          }

          const entrySanitized = {} as T;

          for (const key of keys) {
            let value = line[key];
            if (typeof value === 'string' && this.isFormula(value)) {
              value = `'${value}`;
            }
            entrySanitized[key] = value;
          }

          results.push(entrySanitized);
        })
        .on('end', () => {
          this.cleanup(filePath);

          resolve(results);
        })
        .on('error', (error) => {
          this.cleanup(filePath);

          reject(error);
        });
    });
  }

  private isFormula(value: string): boolean {
    const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
    return dangerousPrefixes.some((prefix) => value.startsWith(prefix));
  }

  private async cleanup(path: string): Promise<unknown> {
    try {
      if (fs.promises.stat(path)) {
        await fs.promises.unlink(path);
      }

      return;
    } catch {}
  }
}
