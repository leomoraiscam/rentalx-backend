export const convertQueryStringToFilterArray = (
  parameter: string | string[]
): string[] | undefined => {
  return typeof parameter === 'string'
    ? (parameter as string).split(',').map((data) => data.trim())
    : undefined;
};
