import Debug from "debug";

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
    this.code = Math.floor(Math.random() * 10000).toString();
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
  values: Array<IEmailVerificationData> = [];

  addItem(email: string) {
    const emailVerificationData = new EmailVerificationData(email);
    this.values.push(emailVerificationData);
    this.#clearCache();
    return emailVerificationData;
  }

  getItemIdx(email: string, code: string): number {
    this.#clearCache();
    return this.values.findIndex((i) => i.isEqual(email, code));
  }

  verifyEmail(email: string, code: string): boolean {
    const verifiedEmailIdx = this.getItemIdx(email, code);
    debug(`verified Email Idx => ${verifiedEmailIdx}`);
    if (verifiedEmailIdx === -1) return false;
    this.values[verifiedEmailIdx].verified = true;
    this.#clearCache();
    return true;
  }

  isVerified(email: string): undefined | IEmailVerificationData {
    return this.values.find((i) => i.verified && i.email === email);
  }

  removeItem(email: string, code: string): void {
    this.values = this.values.filter((i) => i.isEqual(email, code));
    this.#clearCache();
  }

  #clearCache() {
    this.values = this.values.filter((i) => !i.hasExpired());
  }
}
