import { Chat, Message, Properties } from "@domain/types";
export interface IChatRepository {
  /**
   * Получает массив чатов по chatId из базы данных.
   * @param {number} chatId - id чата
   * @returns {Chat[]} - список чатов
   */
  getChat(chatId: number): Promise<Chat[]>;
  /**
   * Добавляет новый чат в базу данных.
   * @param {number} userId - id чата
   * @param {string} title - название чата
   * @returns {Promise<Chat[]>} - список чатов
   */
  createChat(userId: number, title: string): Promise<Chat[]>;
  /**
   * Добавляет новое сообщение в базу данных.
   * @param {number} text - текст сообщения
   * @param {string} type - тип сообщения
   * @param {number} chatId - id чата
   * @param {Properties} properties - объект, содержащий список свойств сообщения
   * @returns {Promise<Message[]>} - список сообщений
   */
  createMessage(text: string, type: string, chatId: number, properties: Properties): Promise<Message[]>;  
  /**
   * Получает массив сообщений по messageId из базы данных.
   * @param {number} messageId - id сообщения
   * @returns {Promise<Message[]>} - список сообщений
   */
  getMessage(messageId: number): Promise<Message[]>;
  /**
   * Заменяет текст сообщения в базе данных.
   * @param {number} messageId - id сообщения
   * @param {string} text - новый текст сообщения
   */
  setMessageText(messageId: number, text: string): Promise<boolean>;
  /**
   * Получает массив чатов пользователя по userId из базы данных.
   * @param {number} userId - id пользователя
   * @returns {Promise<Chat[]>} - список чатов
   */
  getChatsByUserId(userId: number): Promise<any[]>;
  /**
   * Заменяет название чата в базе данных.
   * @param {number} chatId - id чата
   * @param {string} title - новое название чата
   */
  setTitle(chatId: number, title: string): Promise<boolean>;
}