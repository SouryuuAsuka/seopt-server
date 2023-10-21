import { IUserRepository } from './repository';

export interface IDatabaseServive {
  userRepository: IUserRepository;
}