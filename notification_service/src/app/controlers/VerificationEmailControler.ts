import { Message } from "../../core/Message";
import { EmailSender } from "../../infrastructure";
import { VerificationEmailInteractor } from "../interactors";

export default class VerificationEmailControler {
  execute(message: Message) {
    const emailSender = new EmailSender();
    const interactor = new VerificationEmailInteractor(emailSender);
    interactor.execute(message);
  }
}
