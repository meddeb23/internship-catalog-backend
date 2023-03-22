import Debug from "debug";
import { httpRequest, makeHttpError, makeHttpResponse } from "../../helper";
import { IUserRepository } from "../../core/repositeries";

const debug = Debug("user_login");

export interface IAuthHandler {
  login: (req: httpRequest) => any;
}

class AuthHandler implements IAuthHandler {
  userAdapter: IUserRepository;
  constructor(userAdapter: IUserRepository) {
    this.userAdapter = userAdapter;
  }

  async login(req: httpRequest) {
    const { email, password } = req.body;

    const user = await this.userAdapter.getUserByEmail(email);
    if (!user) return makeHttpError(400, "Unvalid email");
    if (!(await this.userAdapter.verifyPassword(password, user.password)))
      return makeHttpError(400, "Wrong password");

    const token = await this.userAdapter.generateUserToken(user);

    return makeHttpResponse(
      200,
      {},
      { token, user: this.userAdapter.formatUser(user) }
    );
  }
}

export default AuthHandler;
