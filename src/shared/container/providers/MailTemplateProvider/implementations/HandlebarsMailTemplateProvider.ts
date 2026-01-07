import fs from 'fs';
import handlebars from 'handlebars';

import { IParseMailTemplateDTO } from '../dtos/IParseMailTemplateDTO';
import { IMailTemplateProvider } from '../models/IMailTemplateProvider';

export class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  async parse(data: IParseMailTemplateDTO): Promise<string> {
    const { file, variables } = data;

    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
