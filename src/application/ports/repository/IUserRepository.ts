export interface IUserRepository {
  get(user_id: number): Promise<any[]>;
  create(username: string, hash: string, avatar: number, user_role?: number ): Promise<any[]>;
  setAvatar(user_id: number, avatar: number): Promise<boolean>;
  lastUpdate(user_id: number): Promise<boolean>;
  sign(username: string, hash: string):Promise<any[]>;
  createRefreshToken(user_id: number, hash: string): Promise<boolean>;
  getRefreshToken(user_id: number, hash: string): Promise<any[]>;
  updateRefreshTokenById(tokenId: number, hash: string): Promise<boolean>;
  reduceGenerations(userId: number): Promise<boolean>;
}