import { Pool } from 'pg';

export default class ChatRepository {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getChat(chatId: number) {
    const queryString = `
      SELECT * 
      FROM seopt_chat 
      WHERE chat_id = $1 `;
    const { rows } = await this.pool.query(queryString, [chatId]);
    return rows;
  }

  async getChatsByUserId(userId: number) {
    const queryString = `
      SELECT
        c.chat_id
      , c.title
      , c.created
      , i.messages
      FROM seopt_chats AS c
      CROSS JOIN LATERAL (
        SELECT ARRAY(
          SELECT
          json_build_object(
            'message_id', m.message_id
            , 'text', m.text
            , 'type', m.type
            , 'properties', m.properties
            , 'created', m.created)
          FROM seopt_messages AS m
          WHERE c.chat_id = m.chat_id
        ) AS messages
      ) i
      WHERE c.user_id = $1 `;
    const { rows } = await this.pool.query(queryString, [userId]);
    return rows;
  }

  async createChat(userId: number, title: string) {
    const queryString = `
      INSERT INTO seopt_chats 
      (user_id, title, created)
      VALUES ($1, $2, $3)
      RETURNING chat_id`;
    const { rowCount, rows } = await this.pool.query(queryString, [userId, title, "NOW()"]);
    if (rowCount == 0) throw new Error("Ошибка при создании чата");
    return rows;
  }
  async createMessage(text: string, type: string, chatId: number, properties: any) {
    const queryString = `
      INSERT INTO seopt_messages 
      (text, type, chat_id, properties, created)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING message_id
      , text
      , type
      , chat_id
      , properties
      , created`;
    const { rowCount, rows } = await this.pool.query(queryString, [text, type, chatId, properties, "NOW()"]);
    if (rowCount == 0) throw new Error("Ошибка при создании чата");
    return rows;
  }
  async getMessage(messageId: number) {
    const queryString = `
      SELECT 
        properties
        , text
        , type
      FROM seopt_messages
      WHERE message_id = $1`;
    const { rows } = await this.pool.query(queryString, [messageId]);
    return rows;
  }
  async setMessageText(messageId: number, text: string) {
    const queryString = `
    UPDATE 
      seopt_messages
    SET text = $1
    WHERE message_id = $2`;
    const { rowCount } = await this.pool.query(queryString, [text, messageId]);
    if (rowCount == 0) throw new Error("Ошибка при создании чата");
    return true;
  }
}