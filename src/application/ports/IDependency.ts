import { ICryptoService, IDatabaseServive, IJwtService } from "./";

export interface IDependency {
  DatabaseService: IDatabaseServive;
  JwtService: IJwtService;
  CryptoService: ICryptoService;
}