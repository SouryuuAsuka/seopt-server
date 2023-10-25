import { IChatRepository, IUserRepository } from './repository';

export interface IDatabaseServive {
  userRepository: IUserRepository;
  messageRepository: IChatRepository;
}