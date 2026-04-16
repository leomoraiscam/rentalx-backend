export const auth = {
  secretToken: process.env.SECRET_TOKEN!,
  expiresIn: process.env.EXPIRES_IN!,
  secretRefreshToken: process.env.SECRET_REFRESH_TOKEN!,
  expiresInRefreshToken: process.env.EXPIRES_IN_REFRESH_TOKEN!,
  expiresRefreshTokenDays: process.env.EXPIRES_REFRESH_TOKEN_DAYS!,
};
