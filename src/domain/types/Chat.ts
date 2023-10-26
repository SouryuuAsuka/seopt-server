import { Message } from "./Message";

export type Chat = {
  chat_id: number | null;
  user_id?: number | null;
  title: string;
  messages?: Message[]
}