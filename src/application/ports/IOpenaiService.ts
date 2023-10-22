export interface IOpenaiService{
  sendPromt(type: number, limit: number, content: string):Promise<any>;
}