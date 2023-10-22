export interface IOpenaiService{
  sendPromt(content: string):Promise<any>;
}