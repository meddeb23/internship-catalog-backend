import { Message } from "../../core/Message";

export default interface EmailSenderInterface {
  send: (
    message: Message,
    subject: string,
    text: string,
    template?: any
  ) => void;
}
