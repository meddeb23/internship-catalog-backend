import config from "../../config";
import { sign, verify } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcryptjs";
import { IUserRepository } from "../../core/repositeries";
import { UserModel } from "../model";
import { User } from "../../core/entities";

export default class UserAdapter implements IUserRepository {
  readonly user: typeof UserModel;
  private expiresIn: string = '10m'

  constructor(model: typeof UserModel) {
    this.user = model;
  }

  #getUserEntity(user: UserModel): User{
    return new User(
      user.id,
      user.first_name,
      user.last_name,
      user.email,
      user.password,
      user.registration_completed
    )
  }

  async generateUserToken(user: User) : Promise<string> {
    const token = sign(
      { email: user.email },
      config.secret,
      { expiresIn: this.expiresIn, algorithm: 'HS256' }
    );
    return token;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.user.findOne({ where: { email } });
    return this.#getUserEntity(user)
  }

  formatUser(user: User) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      registration_completed: user.registration_completed,
    };
  }
  async createUser(email: string, password: string): Promise<User> {
    const pwdHash = await this.hashUserPwd(password);
    const user = await this.user.create({
      email,
      password: pwdHash,
    });
    return this.#getUserEntity(user)
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
