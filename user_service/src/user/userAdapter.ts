import { UserModel } from "../model";

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
    return await this.user.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(email: String, password: String): Promise<UserModel> {
    const user = await this.user.create({
      email,
      password,
    });
    return user;
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
      {
        where: {
          email,
        },
      }
    );
    return user;
  }
}
