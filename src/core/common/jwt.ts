import jwt from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN!;
const JWT_SECRET = process.env.JWT_SECRET!;

export class JwtCommon {
  static generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, JWT_SECRET);
  }
}
