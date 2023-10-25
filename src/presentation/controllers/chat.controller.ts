import { IDependency } from '@application/ports/IDependency';
import chatUseCase from '@application/use-cases/chat.use-case';
import { createSession } from "better-sse";

const chatControllerCreate = (dependencies: IDependency) => {
  const { userRepository, chatRepository } = dependencies.DatabaseService;
  const openaiService = dependencies.OpenaiService;
  const cryptoService = dependencies.CryptoService;

  const {
    create,
    createAsync,
    createStream
  } = chatUseCase(userRepository, chatRepository, openaiService, cryptoService);

  const createController = async (req: any, res: any, next: any) => {
    try {
      if (!res.locals.isAuth) throw new Error('Ошибка аутентификации');
      const { text, chatId, properties } = req.body;
      const { answer, question } = await create(res.locals.userId, text, properties, chatId);
      return res.status(200).json({
        status: 'success',
        data: {
          answer,
          question,
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
  const createAsyncController = async (req: any, res: any, next: any) => {
    try {
      if (!res.locals.isAuth) throw new Error('Ошибка аутентификации');
      const { text, chatId, properties } = req.body;
      const { chats, foundChatId, key, answerId } = await createAsync(res.locals.userId, text, properties, chatId);
      return res.status(200).json({
        status: 'success',
        data: {
          chats,
          chatId: foundChatId,
          answerId,
          key
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
  const createStreamController = async (req: any, res: any, next: any) => {
    try {
      const { key, answer_id } = req.query;
      const session = await createSession(req, res);
      if (!session.isConnected) throw new Error('Not connected');
      await createStream(session, answer_id, key);
      return;
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
    createAsyncController,
    createStreamController
  }
}

export default chatControllerCreate;