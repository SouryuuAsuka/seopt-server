import OpenAI from 'openai';
import { encoding_for_model } from "@dqbd/tiktoken";

const proptType = {
  0: 'Тебе будет предоставлено краткое описание статьи. Твоя задача - написать статью, подходящую под это описание.',
  1: 'Тебе будет предоставлен текст. Твоя задача - придумать заголовок для этого текста.',
  2: 'Тебе будет предоставлено краткое описание товара. Твоя задача - написать текст для продуктовой карточки этого товара.',
  3: 'Тебе будет предоставлен текст. Твоя задача - перевести этот текст на русский.',
  4: 'Тебе будет предоставлен текст. Твоя задача - перевести этот текст на английский.',
}
export class OpenAIService {
  openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async sendPromt(type: number, limit: number, promt: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Ты - специалист по маркетингу и SEO. ' + proptType[type] + " Limit on the number of letters - " + limit },
        { role: 'user', content: promt },
      ],
      model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0].message.content;
  }
  async sendPromtStream(type: number, limit: number, promt: string) {
    const enc = encoding_for_model('gpt-3.5-turbo');
    const systemPromt = 'Ты - специалист по маркетингу и SEO. ' + proptType[type]+' Твой ответ не должен превышать '+limit + ' символов.';
    const tokens = enc.encode(systemPromt + ' ' + promt);
    const limitWithPromt = Math.floor(limit/4) + tokens.length;
    const stream = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPromt },
        { role: 'user', content: promt },
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: limitWithPromt,
      stream: true,
    });
    return stream;
  }
}