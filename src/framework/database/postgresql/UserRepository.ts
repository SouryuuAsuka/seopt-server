import { Pool } from 'pg';

export default class UserRepository {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }
  async get(user_id: number): Promise<any[]> {
    const queryString = `
      SELECT
      u.user_id 
      , u.username
      , u.avatar
      , u.user_role 
      , u.created
      , u.generations
      , j.chats
      FROM seopt_users AS u,
      LATERAL (
        SELECT ARRAY(
          SELECT
          c.chat_id
          , c.title
          , c.created
          , json_agg( 
            json_build_object(
              'message_id', m.message_id
              , 'text', m.text
              , 'type', m.type
              , 'properties', m.properties
              , 'created', m.created
            )
          ) AS messages
          FROM seopt_chats AS c
          JOIN seopt_messages AS m
          ON c.chat_id = m.chat_id
          WHERE c.user_id = u.user_id
          GROUP BY c.chat_id
        ) AS chats
      ) j
      WHERE u.user_id = $1`;
    const { rows } = await this.pool.query(queryString, [user_id]);
    return rows;
  }
  async create(username: string, hash: string, avatar: number, user_role: number = 0): Promise<any[]> {
    const queryString = `
      INSERT INTO seopt_users (username, hash, avatar, user_role, created, last_update)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING 
      user_id 
      , username`;
    const { rowCount, rows } = await this.pool.query(queryString, [username, hash, avatar, user_role, "NOW()", "NOW()"]);
    if (rowCount == 0) throw new Error("Ошибка при создании пользователя");
    return rows;
  }

  async sign(username: string, hash: string): Promise<any[]> {
    const queryString = `
      UPDATE 
      seopt_users
      SET last_update = $1
      WHERE username = $2 AND hash = $3
      RETURNING
      user_id
      , username
      , avatar
      , user_role
      , created`;
    const { rowCount, rows } = await this.pool.query(queryString, ["NOW()", username, hash]);
    if (rowCount == 0) throw new Error("Ошибка при обновлении пользователя");
    return rows;
  }

  async setAvatar(user_id: number, avatar: number): Promise<boolean> {
    const queryString = `
    UPDATE 
    seopt_users
    SET 
    last_update = $1
    , avatar = $2
    WHERE user_id = $3`;
    const { rowCount } = await this.pool.query(queryString, ["NOW()", user_id, avatar]);
    if (rowCount == 0) throw new Error("Ошибка при обновлении аватара");
    return true;
  }

  async lastUpdate(user_id: number): Promise<boolean> {
    const queryString = `
      UPDATE 
      seopt_users
      SET last_update = $1
      WHERE user_id = $2`;
    const { rowCount } = await this.pool.query(queryString, ["NOW()", user_id]);
    if (rowCount == 0) throw new Error("Ошибка при обновлении пользователя");
    return true;
  }
  async createRefreshToken(user_id: number, hash: string): Promise<boolean> {
    const queryString = `
      INSERT INTO seopt_refresh_tokens (user_id, hash, created)
      VALUES ($1, $2, $3)`;
    const { rowCount } = await this.pool.query(queryString, [user_id, hash, "NOW()"]);
    if (rowCount == 0) throw new Error("Ошибка при создании пользователя");
    return true;
  }
  async getRefreshToken(user_id: number, hash: string): Promise<any[]> {
    const queryString = `
    SELECT
    token_id AS "tokenId"
    FROM seopt_refresh_tokens
    WHERE user_id = $1 AND hash = $2`
    const { rows } = await this.pool.query(queryString, [user_id, hash]);
    return rows;
  }
  async updateRefreshTokenById(tokenId: number, hash: string): Promise<boolean> {
    const queryString = `
    UPDATE 
    seopt_refresh_tokens
    SET hash = $1
    , created = $2
    WHERE token_id = $3`;
    const { rowCount } = await this.pool.query(queryString, [hash, "NOW()", tokenId]);
    if (rowCount == 0) throw new Error("Ошибка при обновлении пользователя");
    return true;
  }
  async reduceGenerations(userId: number) {
    const queryString = `
    UPDATE 
    seopt_users
    SET generations = generations - 1
    , last_update = $1
    WHERE user_id = $2`;
    const { rowCount } = await this.pool.query(queryString, ["NOW()", userId]);
    if (rowCount == 0) throw new Error("Ошибка при обновлении пользователя");
    return true;
  }
}