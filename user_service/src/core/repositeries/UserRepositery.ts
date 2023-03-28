import { User } from "../entities";

export default interface IUserRepository {
  user: any;
  formatUser: (user: User) => any;
  getUserByEmail: (email: string) => Promise<User>;
  createUser: (email: String, password: String) => Promise<User>;
  verifyPassword: (password: string, hash: string) => Promise<boolean>;
  verifyToken: (token: string) => Promise<any>;
  generateUserToken: (user: User) => Promise<string>;
  completeAccount: (
    email: string,
    first_name: string,
    last_name: string
  ) => Promise<any>;
}
