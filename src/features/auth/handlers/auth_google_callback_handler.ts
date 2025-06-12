import { Request, Response } from "express";
import { JwtCommon } from "../../../core/common/jwt";

export async function authGoogleCallbackHandler(req: Request, res: Response) {
  if (req.user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (req.user as any).id;
    res.redirect(`${process.env.FRONTEND_URL}?token=${JwtCommon.generateToken({ id })}`);
  } else {
    res.redirect("/v1/auth/google/failure");
  }
}
