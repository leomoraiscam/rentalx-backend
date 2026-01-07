export interface IMailTemplateVariablesDTO {
  [key: string]: string | number;
}

export interface IParseMailTemplateDTO {
  file: string;
  variables: IMailTemplateVariablesDTO;
}
