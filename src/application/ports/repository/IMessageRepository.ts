export interface IMessageRepository {
  getChat(chatId: number): Promise<any[]>;
  createChat(userId: number, title: string): Promise<any[]>;
  createMessage(text: string, type: string, chatId: number, properties: any): Promise<any[]>;
}