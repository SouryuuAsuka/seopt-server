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
    createStream,
    setTitle
  } = chatUseCase(userRepository, chatRepository, openaiService, cryptoService);

  const createController = async (req: any, res: any, next: any) => {
    try {
      if (!res.locals.isAuth) throw new Error('Ошибка аутентификации');
      const { text, chatId, properties } = req.body;
      if (!text || typeof chatId === 'undefined' || !properties) throw new Error('Ошибка передачи данных');
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
      if (!text || typeof chatId === 'undefined' || !properties) throw new Error('Ошибка передачи данных');
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
      if (!answer_id || !key) throw new Error('Ошибка передачи данных');
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
  const setTitleController = async (req: any, res: any, next: any) => {
    try {
      if (!res.locals.isAuth) throw new Error('Ошибка аутентификации');
      const title = req.body.title;
      const chatId = req.params.chatId;
      if (!title || !chatId) throw new Error('Ошибка передачи данных');
      await setTitle(chatId, title);
      return res.status(200).json({
        status: 'success',
        data: {}
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
    createAsyncController,
    createStreamController,
    setTitleController
  }
}

export default chatControllerCreate;