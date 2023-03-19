import nodemailer from "nodemailer";
import sanitizedConfig from "../config";
import { Message } from "../core/Message";
import { EmailSenderInterface } from "../app/interactors";

export default class EmailSender implements EmailSenderInterface {
  send(message: Message, subject: string, text: string, template?: any) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sanitizedConfig.EMAIL,
        pass: sanitizedConfig.PASSWORD,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "noreply@example.com",
      to: message.email,
      subject: subject,
      text: text,
      html: template,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
