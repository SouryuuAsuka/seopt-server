import { ICryptoService, IDatabaseServive, IJwtService, IOpenaiService } from "./";

export interface IDependency {
  DatabaseService: IDatabaseServive;
  JwtService: IJwtService;
  CryptoService: ICryptoService;
  OpenaiService: IOpenaiService;
}