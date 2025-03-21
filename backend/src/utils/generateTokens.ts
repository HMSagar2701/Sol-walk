import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    jwtConfig.accessSecret as jwt.Secret,
    {
      expiresIn: jwtConfig.accessExpiry as SignOptions['expiresIn'],
    }
  );

  const refreshToken = jwt.sign(
    { userId },
    jwtConfig.refreshSecret as jwt.Secret,
    {
      expiresIn: jwtConfig.refreshExpiry as SignOptions['expiresIn'],
    }
  );

  return { accessToken, refreshToken };
};
