import { IOpenaiService } from "@application/ports";
import { IMessageRepository, IUserRepository } from "@application/ports/repository";

const messageUseCase = (userRepository: IUserRepository, messageRepository: IMessageRepository, openaiService: IOpenaiService) => {
  const create = async (userId: number, text: string, quetionProperties: any, chatId: number | null = null) => {
    let foundChatId: number | null = null;
    if (chatId) {
      const foundChats = await messageRepository.getChat(chatId);
      if (foundChats.length > 0) {
        foundChatId = chatId;
      }
    }
    if (!foundChatId) {
      const createdChat = await messageRepository.createChat(userId, 'Новый чат');
      foundChatId = createdChat[0].chat_id;
    }
    const question = await messageRepository.createMessage(text, 'question', foundChatId, quetionProperties);
    const answerText = await openaiService.sendPromt(quetionProperties.type, quetionProperties.limit, text);
    await userRepository.reduceGenerations(userId);
    console.log(JSON.stringify(answerText));
    const answer = await messageRepository.createMessage(answerText.content, 'answer', foundChatId, { reply_id: question[0].message_id });
    return { answer, question }
  }
  return {
    create
  }
}

export default messageUseCase;