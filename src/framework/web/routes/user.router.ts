import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency';
import userControllerCreate from '@presentation/controllers/user.controller';
const router = Router();

export const userRouter = (dependencies: IDependency) => {
  const userController = userControllerCreate(dependencies);

  router.use(appInit);
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Возвращает данные пользователя на основании JWT токера, содержащегося в заголовке запроса.
   *     tags:
   *       - users
   *     responses:
   *       '200':    
   *          description: Возвращает объект с информацией пользователя.
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
   *                      user:
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
  router.get('/', userController.getController);
  /**
   * @swagger
   * /users/signup:
   *   post:
   *     summary: Создание нового пользователя
   *     tags:
   *       - users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username: 
   *                 type: string
   *               password: 
   *                 type: string
   *     responses:
   *       '200':    
   *          description: Возвращает объект с информацией пользователя и токены доступа.
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
   *                      user:
   *                        type: object   
   *                      accessToken:
   *                        type: string  
   *                      refreshToken:
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
  router.post('/signup', userController.createController);
  /**
   * @swagger
   * /users/signip:
   *   post:
   *     summary: Возвращает пользователя на основании имени пользователя и пароля
   *     tags:
   *       - users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username: 
   *                 type: string
   *               password: 
   *                 type: string
   *     responses:
   *       '200':    
   *          description: Возвращает объект с информацией пользователя и токены доступа.
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
   *                      user:
   *                        type: object   
   *                      accessToken:
   *                        type: string  
   *                      refreshToken:
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
  router.post('/signin', userController.signinController);
  /**
   * @swagger
   * /users/token:
   *   post:
   *     summary: Обновляет токены пользователя.
   *     tags:
   *       - users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken: 
   *                 type: string
   *     responses:
   *       '200':    
   *          description: Возвращает новые токены доступа.
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
   *                      accessToken:
   *                        type: string  
   *                      refreshToken:
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
  router.post('/token', userController.refreshTokenController);
  return router;
}
