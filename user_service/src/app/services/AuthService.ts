import Debug from "debug";
import { httpRequest, makeHttpError, makeHttpResponse } from "../../helper";
import { IUserRepository } from "../../core/repositeries";
import sanitizedConfig from "../../config";
import jwt from "jsonwebtoken";
const debug = Debug("user_login");

export interface IAuthHandler {
  login: (req: httpRequest) => any;
  verifyToken(req: httpRequest): any;
}

class AuthHandler implements IAuthHandler {
  UserRepository: IUserRepository;
  constructor(UserRepository: IUserRepository) {
    this.UserRepository = UserRepository;
  }

  async login(req: httpRequest) {
    const { email, password } = req.body;

    const user = await this.UserRepository.getUserByEmail(email);
    if (!user) return makeHttpError(400, "Unvalid email");
    if (!(await this.UserRepository.verifyPassword(password, user.password)))
      return makeHttpError(400, "Wrong password");

    const token = await this.UserRepository.generateUserToken(user);

    return makeHttpResponse(
      200,
      {},
      { token, user: this.UserRepository.formatUser(user) }
    );
  }
  async verifyToken(req: httpRequest) {
    const authHeader = req.headers.authorization;
    debug(authHeader);
    if (!authHeader) return makeHttpError(401, "Missing authorization header");
    const token = authHeader.split(" ")[1];
    try {
      const decode = jwt.verify(token, sanitizedConfig.secret);
      return makeHttpResponse(200, { decode });
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError")
        return makeHttpError(401, "invalid Token");

      return makeHttpError(400, error);
    }

    // const user = await this.UserRepository.getUserByEmail(email);
    // if (!user) return makeHttpError(400, "Unvalid email");
    // if (!(await this.UserRepository.verifyPassword(password, user.password)))
    //   return makeHttpError(400, "Wrong password");
  }
}

export default AuthHandler;
