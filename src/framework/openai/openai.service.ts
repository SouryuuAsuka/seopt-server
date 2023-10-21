import OpenAI from 'openai';

export class OpenAIService{
  openai: OpenAI;
  constructor(){
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } 
}