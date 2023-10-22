import { IDependency } from '@application/ports/IDependency';
import userUseCase from '@application/use-cases/user.use-case';
import { isStringObject } from 'util/types';
const userControllerCreate = (dependencies: IDependency) => {
  const { userRepository } = dependencies.DatabaseService;
  const cryptoService = dependencies.CryptoService;
  const tokenService = dependencies.JwtService;
  const {
    getUser,
    createUser,
    signin,
    updateRefreshToken
  } = userUseCase(userRepository, cryptoService, tokenService);
  const getController = async (req: any, res: any, next: any) => {
    try {
      if (!res.locals.isAuth) {
        throw new Error('Пользователь не найден')
      }
      const userId = res.locals.userId;
      const user = await getUser(userId);
      return res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const createController = async (req: any, res: any, next: any) => {
    try {
      const { username, password, avatar } = req.body;
      if(typeof username !== 'string' || username.length<3 ) throw new Error('Некорректный username');
      if(typeof password !== 'string' || password.length<5 ) throw new Error('Некорректный password');
      const { accessToken, refreshToken, user } = await createUser(username, password, avatar);
      return res.status(200).json({
        status: 'success',
        data: {
          user,
          accessToken,
          refreshToken,
        }
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const signinController = async (req: any, res: any, next: any) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken, user } = await signin(username, password);
      return res.status(200).json({
        status: 'success',
        data: {
          user,
          accessToken,
          refreshToken,
        }
      })
    } catch (err: any) {
      return res.status(400).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const refreshTokenController = async (req: any, res: any, next: any) => {
    try {
      if (req.body.refreshToken === undefined) throw new Error("Unauthorized access.");
      const { id, hash } = await tokenService.verifyRefreshToken(req.body.refreshToken);
      const { accessToken, refreshToken } = await updateRefreshToken(id, hash);
      return res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        }
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  return {
    getController,
    createController,
    signinController,
    refreshTokenController,
  }
}

export default userControllerCreate;