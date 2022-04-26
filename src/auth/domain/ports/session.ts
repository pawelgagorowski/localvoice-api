import { RefreshToken, SessionAdapter } from '../../types';

export const createAccessToken = (
  sessionAdapter: SessionAdapter,
  { business, email, userId }: { business: string; email: string; userId: string }
) => sessionAdapter.createAccessToken(business, email, userId);
export const checkPassword = (sessionAdapter: SessionAdapter, password: string, hashedPassword: string) =>
  sessionAdapter.checkPassword(password, hashedPassword);
export const createRefreshToken = (sessionAdapter: SessionAdapter, userId: string) =>
  sessionAdapter.createRefreshToken(userId);
export const addRefreshToken = async (sessionAdapter: SessionAdapter, userId: string, refreshToken: RefreshToken) =>
  sessionAdapter.addRefreshToken(userId, refreshToken);
export const checkRefreshToken = (
  sessionAdapter: SessionAdapter,
  refreshToken: string,
  refreshTokens: RefreshToken[]
): boolean => sessionAdapter.checkRefreshToken(refreshToken, refreshTokens);
