import Debug from "debug";

import { httpRequest, makeHttpError } from "../../helper";
import UserAdapter from "../../userAdapter";
import { UserModel } from "../../model";
import { EmailVerificationList } from "../../core/entities";
import { IUserAdapter } from "../../core/repositeries";
import QueuePublisherInterface from "./QueuePublisherInterface";
import { QueuePublisher } from "../../infrastructure";
import sanitizedConfig from "../../config";

const debug = Debug("user:router");

const userAdapter: Readonly<IUserAdapter> = new UserAdapter(UserModel);
const emailVerificationList = new EmailVerificationList();

export interface IRegistrationHandler {
  submitEmail: (req: httpRequest) => any;
  verifyEmail: (req: httpRequest) => any;
  createAccount: (req: httpRequest) => any;
  submitPersonalInfo: (req: httpRequest) => any;
}

class RegistrationHandler implements IRegistrationHandler {
  userAdapter: IUserAdapter;
  cache: EmailVerificationList;
  emailSender: QueuePublisherInterface;
  constructor(
    userAdapter: IUserAdapter,
    cache: EmailVerificationList,
    emailSender: QueuePublisherInterface
  ) {
    this.userAdapter = userAdapter;
    this.cache = cache;
    this.emailSender = emailSender;
  }

  #verifyEmailFormat(email: string) {
    const reg = new RegExp(/[a-z]+@issatso\.u-sousse\.tn/);
    debug(`Testing email : ${email} => ${reg.test(email)}`);
    return reg.test(email);
  }

  async submitEmail(req: httpRequest) {
    const { email } = req.body;
    if (!this.#verifyEmailFormat(email))
      return makeHttpError(400, "Please use your institution email");
    const user = await userAdapter.getUserByEmail(email);
    if (user) return makeHttpError(400, "This Email has been used");
    const verificationData = this.cache.addItem(email);
    // send email to the user with the verification email
    this.emailSender.send({
      code: verificationData.code,
      email: verificationData.email,
      expiration: verificationData.expiration,
    });
    debug(this.cache.values);
    return this.#formatResponse(200, {}, { verificationData });
  }

  async verifyEmail(req: httpRequest) {
    const { email, code } = req.body;
    if (!this.#verifyEmailFormat(email))
      return makeHttpError(400, "Please use your institution email");
    if (!this.cache.verifyEmail(email, code))
      return makeHttpError(400, "unvalid credentiel");
    return this.#formatResponse(200, {}, { message: "email verified" });
  }

  async createAccount(req: httpRequest) {
    const { email, password } = req.body;
    if (!this.cache.isVerified(email))
      return makeHttpError(400, "email not verified");
    const user = await userAdapter.createUser(email, password);
    if (!user) return makeHttpError(500, "something went wrong");
    this.cache.removeItem(email);
    const token = this.userAdapter.generateUserToken(user);
    return this.#formatResponse(200, {}, { user, token });
  }

  async submitPersonalInfo(req: httpRequest) {
    const { email, first_name, last_name } = req.body;
    let user = await userAdapter.getUserByEmail(email);
    if (!user) return makeHttpError(400, "you don't have an account");
    user = await userAdapter.completeAccount(email, first_name, last_name);
    return this.#formatResponse(
      200,
      {},
      { message: "account registration completed" }
    );
  }

  #formatResponse(status: number, headers: Object, data: Object) {
    return {
      headers,
      status,
      data: {
        ...data,
        success: true,
      },
    };
  }
}

export const registrationHandler = new RegistrationHandler(
  userAdapter,
  emailVerificationList,
  new QueuePublisher(sanitizedConfig.Q_URL, "verificationEmail")
);
