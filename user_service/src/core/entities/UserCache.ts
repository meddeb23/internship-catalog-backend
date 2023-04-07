import Debug from "debug";
import User from "./User";
import { IUserRepository } from "../repositeries";

const debug = Debug("user:router");

type CacheItem = {
  user: User;
  expiration: number;
};

export default class UserCache {
  private cache: Map<string, CacheItem>;
  private userRepo: IUserRepository;
  private expirationIn: number;

  constructor(repo: IUserRepository, expirationIn: number = 1000 * 60 * 5) {
    this.cache = new Map();
    this.userRepo = repo;
    this.expirationIn = expirationIn;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    debug(email);
    if (this.cache.has(email)) {
      debug(`${email} found in cache`);
      this.cache.set(email, {
        ...this.cache.get(email),
        expiration: this.getExpirationDate(),
      });
      return this.cache.get(email).user!;
    }
    this.clearCache();
    debug(`${email} not found in cache\nFetch User from Database`);
    const user = await this.userRepo.getUserByEmail(email);
    debug(user);
    if (user) {
      this.cache.set(email, { user, expiration: this.getExpirationDate() });
      return user;
    }
    return null;
  }

  private getExpirationDate(): number {
    return Math.floor((Date.now() + this.expirationIn) / 1000);
  }

  private hasExpired(item: CacheItem): boolean {
    return item.expiration < Math.floor(Date.now() / 1000);
  }

  private clearCache() {
    Object.entries(this.cache).forEach(([key, value]: [string, CacheItem]) => {
      if (this.hasExpired(value)) this.cache.delete(key);
    });
  }
}
