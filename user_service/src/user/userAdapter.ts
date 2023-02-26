import config from "../config";
import { sign, verify } from "jsonwebtoken";
import { UserModel } from "../model";
import { genSalt, hash, compare } from "bcryptjs";
import { randomBytes, createCipheriv } from "crypto";

export interface IUserAdapter {
  user: any;
  getUserByEmail: (email: string) => Promise<UserModel>;
  createUser: (email: String, password: String) => Promise<UserModel>;
  verifyPassword: (password: string, hash: string) => Promise<boolean>;
  verifyToken: (token: string) => Promise<any>;
  generateUserToken: (user: UserModel) => Promise<string>;
  completeAccount: (
    email: string,
    first_name: string,
    last_name: string
  ) => Promise<any>;
}

export default class UserAdapter implements IUserAdapter {
  readonly user: typeof UserModel;

  constructor(model: typeof UserModel) {
    this.user = model;
  }

  async generateUserToken(user: UserModel): Promise<string> {
    console.log(user.id.toString());
    const token = sign({ data: user.id }, config.secret);
    return token;
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    return await this.user.findOne({ where: { email } });
  }

  async createUser(email: string, password: string): Promise<UserModel> {
    const pwdHash = await this.hashUserPwd(password);
    const user = await this.user.create({
      email,
      password: pwdHash,
    });
    return user;
  }

  async hashUserPwd(password: string) {
    const salt = await genSalt();
    return await hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  async verifyToken(token: string): Promise<any> {
    const decode = verify(token, config.secret);
    return decode;
  }

  async completeAccount(
    email: string,
    first_name: string,
    last_name: string
  ): Promise<any> {
    const user = await this.user.update(
      {
        first_name,
        last_name,
        registration_completed: true,
      },
      { where: { email } }
    );
    return user;
  }
}
