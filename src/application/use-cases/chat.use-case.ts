import { IOpenaiService } from "@application/ports";
import { IChatRepository, IUserRepository } from "@application/ports/repository";
import { Session } from "better-sse";

const chatUseCase = (userRepository: IUserRepository, chatRepository: IChatRepository, openaiService: IOpenaiService) => {
  const create = async (userId: number, text: string, quetionProperties: any, chatId: number | null = null) => {
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
    const question = await chatRepository.createMessage(text, 'question', foundChatId, quetionProperties);
    const aiAnswer = await openaiService.sendPromt(quetionProperties.type, quetionProperties.limit, text);
    await userRepository.reduceGenerations(userId);
    console.log(JSON.stringify(aiAnswer[0]));
    const answer = await chatRepository.createMessage(aiAnswer[0].message.content, 'answer', foundChatId, { reply_id: question[0].message_id });
    return { answer, question }
  }
  const createStream = async (session: Session, userId: number, text: string, quetionProperties: any, chatId: number | null = null) => {
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
    const question = await chatRepository.createMessage(text, 'question', foundChatId, quetionProperties);
    const aiStream = await openaiService.sendPromtStream(quetionProperties.type, quetionProperties.limit, text);
    await userRepository.reduceGenerations(userId);
    let textArray =[];
    for await (const part of aiStream) {
      session.push({text: part.choices[0]?.delta?.content || ''});
      textArray.push(part.choices[0]?.delta?.content || '');
      console.log(JSON.stringify(part.choices[0]?.delta?.content));
    }
    const answer = await chatRepository.createMessage(textArray.join(''), 'answer', foundChatId, { reply_id: question[0].message_id });
    return { answer, question }
  }
  return {
    create,
    createStream
  }
}

export default chatUseCase;