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
   *     tags:
   *       - chats
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
   *     responses:
   *       '200':    
   *          description: Возвращает JSON-объекты вопроса и ответа
   *          content:
   *            application/json:
   *              schema: 
   *                type: object
   *                properties:
   *                  status:
   *                    type: string
   *                    example: success
   *                  data:
   *                    type: object
   *                    properties:
   *                      answer:
   *                        type: object
   *                      question:
   *                        type: object
   *       '500':    
   *          description: Возвращает описание ошибки
   *          content:
   *            application/json:
   *              schema: 
   *                type: object
   *                properties:
   *                  status:
   *                    type: string
   *                    example: error
   *                  message:
   *                    type: string
   *                    example: Server error
   */
  router.post('/', chatController.createController);
  /**
   * @swagger
   * /chats/{chatId}:
   *   patch:
   *     summary: Изменяет название чата.
   *     tags:
   *       - chats
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title: 
   *                 type: number
   *     parameters:
   *      - name: chatId
   *        in: path
   *        required: true
   *        description: Новое название чата
   *     responses:
   *       '200':    
   *          description: Возвращает JSON-объекты вопроса и ответа
   *          content:
   *            application/json:
   *              schema: 
   *                type: object
   *                properties:
   *                  status:
   *                    type: string
   *                    example: success
   *                  data:
   *                    type: object
   *                    example: {}
   *       '500':    
   *          description: Возвращает описание ошибки
   *          content:
   *            application/json:
   *              schema: 
   *                type: object
   *                properties:
   *                  status:
   *                    type: string
   *                    example: error
   *                  message:
   *                    type: string
   *                    example: Server error
   */
  router.patch('/:chatId', chatController.setTitleController);
  /**
   * @swagger
   * /chats/async:
   *   post:
   *     summary: Сохраняет новое пустое сообщение и возращает обновленный массив чатов.
   *     tags:
   *       - chats
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
   *     responses:
   *       '200':    
   *          description: Возвращает массив чатов пользователя, id выбранного чата, id ответа и уникальный ключ для чтения ответа
   *          content:
   *            application/json:
   *              schema: 
   *                type: object
   *                properties:
   *                  status:
   *                    type: string
   *                    example: success
   *                  data:
   *                    type: object
   *                    properties:
   *                      chats:
   *                        type: array
   *                        items: 
   *                          type: object
   *                      chatId:
   *                        type: integer   
   *                      answerId:
   *                        type: integer
   *                      key:
   *                        type: string
   *       '500':    
   *          description: Возвращает описание ошибки
   *          content:
   *            application/json:
   *              schema: 
   *                type: object
   *                properties:
   *                  status:
   *                    type: string
   *                    example: error
   *                  message:
   *                    type: string
   *                    example: Server error
   */
  router.post('/async', chatController.createAsyncController);
  /**
   * @swagger
   * /chats/{chatId}/stream:
   *   get:
   *     summary: Создает SSE-поток, содержащий текст ответа от ChatGPT.
   *     tags:
   *       - chats
   *     parameters:
   *      - name: chatId
   *        in: path
   *        required: true
   *        description: id чата
   *      - name: answer_id
   *        in: query
   *        required: true
   *        description: id ответа 
   *      - name: key
   *        in: query
   *        required: true
   *        description: ключ, дающий доступ к чтению сообщения из базы 
   */
  router.get('/:chatId/stream', chatController.createStreamController);
  return router;
}
