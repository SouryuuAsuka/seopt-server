import { ICryptoService, IOpenaiService } from "@application/ports";
import { IChatRepository, IUserRepository } from "@application/ports/repository";
import { Session } from "better-sse";

const chatUseCase = (userRepository: IUserRepository, chatRepository: IChatRepository, openaiService: IOpenaiService, cryptoService: ICryptoService) => {
  const create = async (userId: number, text: string, properties: any, chatId: number | null = null) => {
    let foundChatId: number | null = null;
    if (chatId) {
      const foundChats = await chatRepository.getChat(chatId);
      if (foundChats.length > 0) {
        foundChatId = chatId;
      }
    }
    if (!foundChatId) {
      const createdChat = await chatRepository.createChat(userId, 'Новый чат');
      foundChatId = createdChat[0].chat_id;
    }
    const question = await chatRepository.createMessage(text, 'question', foundChatId, properties);
    const aiAnswer = await openaiService.sendPromt(properties.type, properties.limit, text);
    await userRepository.reduceGenerations(userId);
    console.log(JSON.stringify(aiAnswer[0]));
    const answer = await chatRepository.createMessage(aiAnswer[0].message.content, 'answer', foundChatId, { reply_id: question[0].message_id });
    return { answer, question }
  }

  const createAsync = async (userId: number, text: string, properties: any, chatId: number | null = null) => {
    let foundChatId: number | null = null;
    if (chatId) {
      const foundChats = await chatRepository.getChat(chatId);
      if (foundChats.length > 0) {
        foundChatId = chatId;
      }
    }
    if (!foundChatId) {
      const createdChat = await chatRepository.createChat(userId, 'Новый чат');
      foundChatId = createdChat[0].chat_id;
    }
    const key = await cryptoService.generateHash(8);
    const question = await chatRepository.createMessage(text, 'question', foundChatId, properties);
    await userRepository.reduceGenerations(userId);
    const answer = await chatRepository.createMessage(null, 'answer', foundChatId, { reply_id: question[0].message_id, key });
    const chats = await chatRepository.getChatsByUserId(userId);
    return { chats, foundChatId, key, answerId: answer[0].message_id }
  }

  const createStream = async (session: Session, answerId: number, key: string) => {
    const answer = await chatRepository.getMessage(answerId);
    if (answer.length === 0) throw new Error("Ответ не найден в базе данных");
    if (answer[0].properties.key !== key) throw new Error("Отправленный ключ неверен");
    const question = await chatRepository.getMessage(answer[0].properties.reply_id);
    const aiStream = await openaiService.sendPromtStream(question[0].properties.type, question[0].properties.limit, question[0].text);
    let textArray = [];
    for await (const part of aiStream) {
      if (part.choices[0]?.delta?.content === '[DONE]') {
        session.push('DONE', 'error');
        console.log('break');
        break;
      }
      session.push({ text: part.choices[0]?.delta?.content || '' });
      textArray.push(part.choices[0]?.delta?.content || '');
      console.log(JSON.stringify(part.choices[0]?.delta?.content));
    }
    await chatRepository.setMessageText(answerId, textArray.join(''));
    return;
  }

  return {
    create,
    createAsync,
    createStream
  }
}

export default chatUseCase;