import bcrypt from "bcrypt";

export class PasswordService {
  static hash = 10;

  static async hashPassword(pw: string) {
    return bcrypt.hash(pw, PasswordService.hash);
  }
  static verifyPassword(pw: string, hash: string) {
    return bcrypt.compare(pw, hash);
  }
}
