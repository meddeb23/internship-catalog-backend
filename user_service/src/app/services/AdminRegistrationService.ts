import Debug from "debug";

import { httpRequest, makeHttpError, makeHttpResponse } from "../../helper";
import { EmailVerificationList, Roles } from "../../core/entities";
import { IUserRepoFacad } from "../../core/repositeries";
import RepoError from "../../helper/RepoError";

const debug = Debug("user:router");

export interface IAdminRegistrationHandler {
  createAdminAccount: (req: httpRequest) => any;
  submitPersonalInfo: (req: httpRequest) => any;
}

class AdminRegistrationHandler implements IAdminRegistrationHandler {
  userRepoFacad: IUserRepoFacad;
  cache: EmailVerificationList;
  constructor(userRepoFacad: IUserRepoFacad, cache: EmailVerificationList) {
    this.userRepoFacad = userRepoFacad;
    this.cache = cache;
  }

  async createAdminAccount(req: httpRequest) {
    const { email, password } = req.body;
    const user = await this.userRepoFacad.UserRepo.getUserByEmail(email);
    if (user) return makeHttpError(400, "Account already exsits");
    if (!this.cache.isVerified(email))
      return makeHttpError(400, "Email not verified");
    try {
      const user = await this.userRepoFacad.UserRepo.createUser(
        email,
        password,
        Roles.Student
      );
      if (!user) return makeHttpError(500, "something went wrong");
      this.cache.removeItem(email);
      const token = this.userRepoFacad.UserRepo.generateUserToken(user);
      return makeHttpResponse(200, {}, { user, token });
    } catch (err) {
      const e: RepoError = err as RepoError;
      console.log(e);
      return makeHttpError(400, e.response[0].message);
    }
  }

  async submitPersonalInfo(req: httpRequest) {
    const { email, first_name, last_name } = req.body;
    let user = await this.userRepoFacad.UserRepo.getUserByEmail(email);
    if (!user) return makeHttpError(400, "you don't have an account");
    user = await this.userRepoFacad.UserRepo.completeAccount(
      email,
      first_name,
      last_name
    );
    return makeHttpResponse(
      200,
      {},
      { message: "account registration completed" }
    );
  }
}

export default AdminRegistrationHandler;
