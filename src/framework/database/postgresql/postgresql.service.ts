import { Pool } from 'pg';
import UserRepository from './UserRepository';
import MessageRepository from './MessageRepository';
import { IUserRepository, IMessageRepository } from '@application/ports/repository';

export default class PostgresqlDatabaseService {
  pool: Pool;
  userRepository: IUserRepository;
  messageRepository: IMessageRepository;
  
  constructor() {
    this.pool = new Pool({
      user: process.env.POSTGRESQL_USER,
      database: process.env.POSTGRESQL_DATABASE,
      password: process.env.POSTGRESQL_PASSWORD,
      port: 5432,
      host: '172.17.0.1',
    });
    this.userRepository = new UserRepository(this.pool);
    this.messageRepository = new MessageRepository(this.pool);
  }
}
