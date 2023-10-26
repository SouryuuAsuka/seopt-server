import { Properties } from "./Properties";

export type Message = {
  message_id: number;
  type: string;
  text: string;
  properties: Properties;
  created: string;
}

