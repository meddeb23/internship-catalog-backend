import { UserModel } from "../model";
import { genSalt, hash, compare } from "bcryptjs";

export interface IUserAdapter {
  user: any;
  getUserByEmail: (email: string) => Promise<UserModel>;
  createUser: (email: String, password: String) => Promise<UserModel>;
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
