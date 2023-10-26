import OpenAI from "openai";
import { Stream } from "openai/streaming";

export interface IOpenaiService{
  /**
   * Отправляет ChatGPT промт и возвращает текст ответа.
   * @param {number} type - тип запроса.
   * @param {number} limit - максимальное число символов, содержащихся в ответе ChatGPT.
   * @param {string} promt - текст промта, отправляемоего ChatGPT.
   * @returns {Promise<string>} - текст ответа ChatGPT.
   */
  sendPromt(type: number, limit: number, promt: string):Promise<string>;
  /**
   * Отправляет ChatGPT промт и возвращает stream c текстом ответа.
   * @param {number} type - тип запроса.
   * @param {number} limit - максимальное число символов, содержащихся в ответе ChatGPT.
   * @param {string} promt - текст промта, отправляемоего ChatGPT.
   * @returns {Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>>} - stream ответа ChatGPT.
   */
  sendPromtStream(type: number, limit: number, promt: string):Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>>;
}