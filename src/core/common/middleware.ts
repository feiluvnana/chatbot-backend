import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Database } from "../database/database";
import { ErrorCommon } from "./error";
import { JwtCommon } from "./jwt";
import { QueryCommon } from "./query";

export class MiddlewareCommon {
  static async jwtToUser(req: Request, res: Response, next: NextFunction) {
    const parts = req.headers.authorization?.split(" ");
    if (parts?.length !== 2 || parts[0] !== "Bearer") return ErrorCommon.unauthorized(res, "Token không hợp lệ.");
    try {
      await Database.transaction().execute(async (trx) => {
        const user = await QueryCommon.getUserById(trx, { id: (JwtCommon.verifyToken(parts[1]) as JwtPayload).id });
        if (user === undefined) return ErrorCommon.notFound(res, "Không tìm thấy người dùng này.");
        req.user = user;
        next();
      });
    } catch {
      return ErrorCommon.unauthorized(res, "Token không hợp lệ.");
    }
  }

  static async mustActivated(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((req.user as any).state === "unactivated") {
      ErrorCommon.forbidden(res, "Tài khoản chưa được kích hoạt.");
    } else {
      next();
    }
  }
}
