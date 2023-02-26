import Debug from "debug";

import { httpRequest, makeHttpError } from "../../helper";
import UserAdapter, { IUserAdapter } from "../userAdapter";
import { UserModel } from "../../model";

const debug = Debug("user_login");

const userAdapter: Readonly<IUserAdapter> = new UserAdapter(UserModel);

export interface IAuthHandler {
  login: (req: httpRequest) => any;
}

class AuthHandler implements IAuthHandler {
  userAdapter: IUserAdapter;
  constructor(userAdapter: IUserAdapter) {
    this.userAdapter = userAdapter;
  }

  async login(req: httpRequest) {
    const { email, password } = req.body;

    const user = await userAdapter.getUserByEmail(email);
    if (!user) return makeHttpError(400, "Unvalid Email");
    if (!(await userAdapter.verifyPassword(password, user.password)))
      return makeHttpError(400, "Wrong password");

    const token = await userAdapter.generateUserToken(user);

    return this.#formatResponse(
      200,
      {},
      { token, user: userAdapter.formatUser(user) }
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

export const authHandler = new AuthHandler(userAdapter);
