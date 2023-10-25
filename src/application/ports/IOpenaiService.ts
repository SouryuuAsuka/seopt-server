import OpenAI from "openai";
import { Stream } from "openai/streaming";

export interface IOpenaiService{
  sendPromt(type: number, limit: number, content: string):Promise<any>;
  sendPromtStream(type: number, limit: number, content: string):Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>>;
}