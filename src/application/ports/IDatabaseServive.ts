import { IMessageRepository, IUserRepository } from './repository';

export interface IDatabaseServive {
  userRepository: IUserRepository;
  messageRepository: IMessageRepository;
}