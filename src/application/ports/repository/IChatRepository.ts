export interface IChatRepository {
  getChat(chatId: number): Promise<any[]>;
  createChat(userId: number, title: string): Promise<any[]>;
  createMessage(text: string, type: string, chatId: number, properties: any): Promise<any[]>;
  getMessage(messageId: number): Promise<any[]>;
  setMessageText(messageId: number, text: string): Promise<boolean>;
  getChatsByUserId(userId: number): Promise<any[]>;
  setTitle(chatId: number, title: string): Promise<boolean>;
}