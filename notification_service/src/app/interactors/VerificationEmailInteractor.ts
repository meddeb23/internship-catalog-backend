import ejs from "ejs";

import { Message } from "../../core/Message";
import EmailSenderInterface from "./EmailSenderInterface";
import path from "path";
import { readFileSync } from "fs";

export default class VerificationEmailInteractor {
  private emailSender: EmailSenderInterface;

  constructor(emailSender: EmailSenderInterface) {
    this.emailSender = emailSender;
  }

  private getTemplate(code: string, email: string, expiration: string) {
    const template = readFileSync(
      path.join(__dirname, "..", "..", "templates", "verifyEmail.ejs"),
      "utf-8"
    );
    return ejs.render(template, { code, email, expiration });
  }

  execute(message: Message) {
    this.emailSender.send(
      message,
      `Email verification code: ${message.code}`,
      `your verification code is ${message.code}, it will expires in ${message.expiration}`,
      this.getTemplate(message.code, message.email, message.expiration)
    );
  }
}
