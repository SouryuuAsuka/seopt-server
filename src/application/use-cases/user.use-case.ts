import { ICryptoService, IJwtService } from "@application/ports";
import { IUserRepository } from "@application/ports/repository";

const userUseCase = (userRepository: IUserRepository, cryptoService: ICryptoService, tokenService: IJwtService) => {
  const getUser = async (user_id: number) => {
    const user = await userRepository.get(user_id);
    if (user.length === 0) {
      throw new Error('User not found')
    }
    return user[0];
  }
  const createUser = async (username: string, password: string, avatar: number = 1) => {
    const passHash = await cryptoService.getPasswordHash(password);
    const user = await userRepository.create(username, passHash, avatar);
    const hash = await cryptoService.generateHash(8);
    await userRepository.createRefreshToken(user[0].user_id, hash);
    const accessToken = await tokenService.generateAccessToken(user[0].user_id, user[0].username, user[0].user_role);
    const refreshToken = await tokenService.generateRefreshToken(user[0].user_id, hash);
    return { accessToken, refreshToken, user:user[0] };
  }
  const signin = async (username: string, password: string) => {
    const passHash = await cryptoService.getPasswordHash(password);
    const user = await userRepository.sign(username, passHash);
    const hash = await cryptoService.generateHash(8);
    await userRepository.createRefreshToken(user[0].user_id, hash);
    const accessToken = await tokenService.generateAccessToken(user[0].user_id, user[0].username, user[0].user_role);
    const refreshToken = await tokenService.generateRefreshToken(user[0].user_id, hash);
    return { accessToken, refreshToken, user:user[0] };
  }
  const updateRefreshToken = async (user_id: number, hash: string) => {
    const token = await userRepository.getRefreshToken(user_id, hash);
    if(token.length === 0) throw new Error("Токен не найден");
    const newHash = await cryptoService.generateHash(8);
    const user = await userRepository.get(user_id);
    const accessToken = await tokenService.generateAccessToken(user[0].user_id, user[0].username, user[0].user_role);
    const refreshToken = await tokenService.generateRefreshToken(user[0].user_id, newHash);
    await userRepository.updateRefreshTokenById( token[0].tokenId, newHash);
    return { accessToken: accessToken, refreshToken: refreshToken };

  }
  return {
    getUser,
    createUser,
    signin,
    updateRefreshToken
  }
}
export default userUseCase;
