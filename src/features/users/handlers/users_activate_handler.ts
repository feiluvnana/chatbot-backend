import { NextFunction, Request, Response } from "express";
import { Selectable } from "kysely";
import { ErrorCommon } from "../../../core/common/error";
import { SchemaCommon } from "../../../core/common/schema";
import { Database } from "../../../core/database/database";
import { Users } from "../../../core/database/schema";

export const usersActivateSchema = SchemaCommon.users
  .pick({
    fullname: true,
    school: true,
    school_address: true,
    occupation: true,
    phone_number: true,
  })
  .openapi("UserActivate");

export async function usersActivateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Selectable<Users>;
    if (user.state === "activated") {
      ErrorCommon.badRequest(res, "Tài khoản đã kích hoạt rồi.");
      return;
    }

    const input = usersActivateSchema.safeParse(req.body);
    if (!input.success) {
      ErrorCommon.badRequest(res, `Xác thực dữ liệu đầu vào thất bại: ${input.error.message}`);
      return;
    }

    await Database.transaction().execute(async (trx) => {
      await trx
        .updateTable("users")
        .set({ state: "activated", ...input.data })
        .where("id", "=", user.id)
        .execute();
    });
    res.status(200).json({ message: "Kích hoạt tài khoản thành công." });
  } catch (err) {
    next(err);
  }
}
