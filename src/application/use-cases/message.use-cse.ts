import { IOpenaiService } from "@application/ports";
import { IMessageRepository } from "@application/ports/repository";

const messageUseCase = (messageRepository: IMessageRepository, openaiService: IOpenaiService) => {
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
    const answer = await openaiService.sendPromt(text);
    console.log(JSON.stringify(answer));
    return { answer, question }
  }
  return {
    create
  }
}

export default messageUseCase;