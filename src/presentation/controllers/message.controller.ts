import { IDependency } from '@application/ports/IDependency';
import messageUseCase from '@application/use-cases/message.use-cse';

const messageControllerCreate = (dependencies: IDependency) => {
  const { userRepository, messageRepository } = dependencies.DatabaseService;
  const openaiService = dependencies.OpenaiService;

  const {
    create,
  } = messageUseCase(userRepository, messageRepository, openaiService);

  const createController = async (req: any, res: any, next: any) => {
    try {
      if (!res.locals.isAuth) throw new Error('Ошибка аутентификации');
      const { text, chatId, properties } = req.body;
      const { answer, question } = await create(res.locals.userId, text, properties, chatId);
      return res.status(200).json({
        status: 'success',
        data: {
          answer,
          question
        }
      })
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  return {
    createController,
  }
}

export default messageControllerCreate;