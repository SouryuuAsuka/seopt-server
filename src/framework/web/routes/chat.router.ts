import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency'; 
import chatControllerCreate from '@presentation/controllers/chat.controller';

const router = Router();

export const chatRouter = (dependencies:IDependency) => {
  const chatController = chatControllerCreate(dependencies);

  router.use(appInit);

  router.post('/', chatController.createController);
  router.patch('/:chatId', chatController.setTitleController);
  router.post('/async', chatController.createAsyncController);
  router.get('/:chatId/stream', chatController.createStreamController);
  return router;
}
