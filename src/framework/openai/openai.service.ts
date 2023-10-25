import OpenAI from 'openai';
const proptType = {
  0: 'Write an article.',
  1: 'Write a title.',
  2: 'Write text for the product card.',
  3: 'Translate the text into English.',
  4: 'Translate the text into Russian.',
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
        { role: 'system', content:'You are an experienced marketer. ' + proptType[type] + " Limit on the number of letters - "+limit },
        { role: 'user', content: promt },
      ],
      model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices;
  }
  async sendPromtStream(type: number, limit: number, promt: string) {
    const stream = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content:'You are an experienced marketer. ' + proptType[type] + " Limit on the number of letters - "+limit },
        { role: 'user', content: promt },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
    });
    return stream;
  }
}