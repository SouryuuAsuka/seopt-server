export interface ICryptoService {
  getPasswordHash(password: string):Promise<string>;
  generateHash(length: number):Promise<string>;
}
