type TokenUrlBuilder = (token: string) => string;

const urlsMapping: Record<string, TokenUrlBuilder> = {
  production: (token) =>
    `${process.env.NODE_ENV}/password/reset?token=${token}`,
  staging: (token) => `${process.env.NODE_ENV}/password/reset?token=${token}`,
  development: (token) => {
    const baseUrl = process.env.APP_URL || 'http://localhost';
    const port = process.env.APP_PORT || 3333;

    return `${baseUrl}:${port}/password/reset?token=${token}`;
  },
  test: (token) => {
    const baseUrl = process.env.APP_URL || 'http://localhost';
    const port = process.env.APP_PORT || 3333;

    return `${baseUrl}:${port}/password/reset?token=${token}`;
  },
};

export const buildResetPasswordUrl = (token: string): string => {
  const currentEnvironment = process.env.NODE_ENV || 'development';
  const resetPasswordUrl = urlsMapping[currentEnvironment];

  return resetPasswordUrl(token);
};
