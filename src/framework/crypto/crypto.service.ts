import * as crypto from "crypto";
import * as bcrypt from 'bcrypt'

export default class BcryptServise {
  async getPasswordHash(password: string): Promise<string> {
    try {
      const passSalt = process.env.LOCAL_PASSWORD_SALT;
      return await bcrypt.hash(password, passSalt);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateHash(length: number): Promise<string> {
    try {
      return crypto.randomBytes(length).toString('hex');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}