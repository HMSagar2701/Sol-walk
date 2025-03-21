// src/config/jwt.ts
export const jwtConfig = {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    accessExpiry: '15m',
    refreshExpiry: '7d',
  };
  