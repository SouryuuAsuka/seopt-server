import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency';
import chatControllerCreate from '@presentation/controllers/chat.controller';

const router = Router();

export const chatRouter = (dependencies: IDependency) => {
  const chatController = chatControllerCreate(dependencies);

  router.use(appInit);
  /**
   * @swagger
   * /chats:
   *   post:
   *     summary: Отправляет запрос на сервер ChatGPT и возращает ответ.
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                text:
   *                  type: string
   *                chatId: 
   *                  type: number
   *                properties:
   *                  type: object
   */
  router.post('/', chatController.createController);
  /**
   * @swagger
   * /chats/{chatId}:
   *   patch:
   *     summary: Изменяет название чата.
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                title: 
   *                  type: number
   *     parameters:
   *      - name: chatId
   *        in: path
   *        required: true
   *        description: Новое название чата
   */
  router.patch('/:chatId', chatController.setTitleController);
  /**
   * @swagger
   * /chats/async:
   *   post:
   *     summary: Сохраняет новое пустое сообщение и возращает обновленный массив чатов.
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                text:
   *                  type: string
   *                chatId: 
   *                  type: number
   *                properties:
   *                  type: object
   */
  router.post('/async', chatController.createAsyncController);
  /**
   * @swagger
   * /chats/{chatId}/stream:
   *   get:
   *     summary: Изменяет название чата.
   *     parameters:
   *      - name: chatId
   *        in: path
   *        required: true
   *        description: Новое название чата
   *      - name: key
   *        in: query
   *        required: true
   *        description: Ключ, дающий доступ к чтению сообщения из базы данных
   */
  router.get('/:chatId/stream', chatController.createStreamController);
  return router;
}
