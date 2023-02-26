import crypto from "crypto";
import Debug from "debug";
import sanitizedConfig from "../../config";

const debug = Debug("user:router");

interface IEmailVerificationData {
  email: string;
  code: string;
  expiration: number;
  verified: boolean;
  isEqual: (email: string, code: string) => boolean;
  hasExpired: () => boolean;
}

class EmailVerificationData implements IEmailVerificationData {
  email: string;
  code: string;
  expiration: number;
  verified: boolean = false;
  delay: number = 1000 * 60;

  constructor(email: string) {
    this.email = email;
    this.code = sanitizedConfig.isDevMode
      ? "0000"
      : Math.floor(Math.random() * 10000).toString();
    this.expiration = this.#toSeconds(Date.now() + this.delay);
  }
  isEqual(email: string, code: string): boolean {
    return this.code === code && this.email === email && !this.hasExpired();
  }

  hasExpired(): boolean {
    return this.expiration < this.#toSeconds(Date.now());
  }

  #toSeconds(milliseconds: number) {
    return Math.floor(milliseconds / 1000);
  }
}

export default class EmailVerificationList {
  values: any = {};

  addItem(email: string) {
    const emailVerificationData = new EmailVerificationData(email);
    this.values[this.#getKey(email)] = emailVerificationData;
    this.#clearCache();
    return emailVerificationData;
  }

  #clearCache() {
    Object.entries(this.values).forEach(
      ([key, value]: [string, EmailVerificationData]) => {
        if (value.hasExpired()) delete this.values[key];
      }
    );
  }

  getItemIdx(email: string, code: string): number {
    this.#clearCache();
    return this.values[this.#getKey(email)].isEqual(email, code);
  }

  #getKey(email: string) {
    return crypto.createHash("md5").update(email).digest("hex");
  }

  isVerified(email: string): null | IEmailVerificationData {
    const e = this.values[this.#getKey(email)];
    return e.verified && e.email === email ? e : null;
  }

  removeItem(email: string): void {
    delete this.values[this.#getKey(email)];
    this.#clearCache();
  }

  verifyEmail(email: string, code: string): boolean {
    const verifiedEmailIdx = this.getItemIdx(email, code);
    if (verifiedEmailIdx === -1) return false;
    this.values[verifiedEmailIdx].verified = true;
    this.#clearCache();
    return true;
  }
}
