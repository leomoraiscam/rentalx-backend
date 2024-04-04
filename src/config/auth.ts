export const auth = {
  secretToken: process.env.SECRET_TOKEN || null,
  expiresIn: process.env.EXPIRES_IN || null,
  secretRefreshToken: process.env.SECRET_REFRESH_TOKEN || null,
  expiresInRefreshToken: process.env.EXPIRES_IN_REFRESH_TOKEN || null,
  expiresRefreshTokenDays: process.env.EXPIRES_REFRESH_TOKEN_DAYS || null,
};
