import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../types';
import { DatabasePrimaryKey, EmptyObject } from '../../shared';
import { PlatformUserModel } from '../../user/domain';

const jwtRefreshExpiration = 86400;

export const isRefreshTokenValid = (refreTokens: RefreshToken[], refreshTokenId: string): boolean =>
  refreTokens.some((t) => t.refreshTokenId === refreshTokenId);

export const JWTSessionAdapter = {
  createAccessToken(business: string, email: string, userId: string): string {
    const accessToken = jwt.sign({ business, email, userId }, 'dupa', {
      expiresIn: 60, // 24 hours
    });
    console.log('accessToken', accessToken);
    return accessToken;
  },

  createRefreshToken(userId: string): RefreshToken {
    const expiredAt = new Date();
    return {
      refreshTokenId: uuidv4(),
      userId,
      expiryDate: expiredAt.setSeconds(expiredAt.getSeconds() + jwtRefreshExpiration).toString(),
    };
  },

  checkPassword(password: string, hashedPassword: string): boolean {
    const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
    return isPasswordValid;
  },

  async addRefreshToken(userId: string, refreshToken: RefreshToken): Promise<EmptyObject | null> {
    const params = {
      id: DatabasePrimaryKey.PLATFORM_USER,
      sk: userId,
      refreshTokens: { $append: [{ refreshToken }] },
    };
    try {
      const result = await PlatformUserModel.update(params);
      return result;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },

  checkRefreshToken(refreshToken: string, refreshTokens: RefreshToken[]): boolean {
    const boolean = isRefreshTokenValid(refreshTokens, refreshToken);

    return boolean;
  },
};
