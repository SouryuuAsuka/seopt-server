import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency'; 
import messageControllerCreate from '@presentation/controllers/message.controller';

const router = Router();

export const messageRouter = (dependencies:IDependency) => {
  const messageController = messageControllerCreate(dependencies);

  router.use(appInit);

  router.post('/', messageController.createController);
  return router;
}
