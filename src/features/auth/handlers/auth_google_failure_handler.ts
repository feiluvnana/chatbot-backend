import { Request, Response } from "express";
import { ErrorCommon } from "../../../core/common/error";

export async function authGoogleFailureHandler(req: Request, res: Response) {
  ErrorCommon.unauthorized(res, "Đăng nhập Google thất bại.");
}
