import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency';
import userControllerCreate from '@presentation/controllers/user.controller';
const router = Router();

export const userRouter = (dependencies: IDependency) => {
  const userController = userControllerCreate(dependencies);

  router.use(appInit);

  router.get('/', userController.getController);
  router.post('/signup', userController.createController);
  router.post('/signin', userController.signinController);
  router.post('/token', userController.refreshTokenController);
  return router;
}
