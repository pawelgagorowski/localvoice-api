import { z } from 'zod';
import { EmptyObject } from '../shared';
import {
  AuthTokenClaimsvalid,
  RefreshTokenRequestValid,
  SignInUserRequestValid,
  SignUpUserRequestValid,
} from './validation';

export type RefreshToken = {
  refreshTokenId: string;
  userId: string;
  expiryDate: string;
};

export type SessionAdapter = {
  createAccessToken(business: string, email: string, userId: string): string;
  createRefreshToken(userId: string): RefreshToken;
  checkPassword(password: string, hashedPassword: string): boolean;
  addRefreshToken(userId: string, refreshToken: RefreshToken): Promise<EmptyObject | null>;
  checkRefreshToken(refreshToken: string, refreshTokens: RefreshToken[]): boolean;
};

export type SignUpUserRequest = z.infer<typeof SignUpUserRequestValid>;

export type SignInUserRequest = z.infer<typeof SignInUserRequestValid>;

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestValid>;

export type AuthTokenClaims = z.infer<typeof AuthTokenClaimsvalid>;
