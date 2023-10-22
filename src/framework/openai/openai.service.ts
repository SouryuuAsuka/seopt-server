import OpenAI from 'openai';

export class OpenAIService{
  openai: OpenAI;
  constructor(){
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } 
  async sendPromt(content: string){
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'gpt-3.5-turbo',
    });
  
    return chatCompletion.choices;
  }
}