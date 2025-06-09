import { NextFunction, Request, Response } from "express";
import { Selectable } from "kysely";
import z from "zod";
import { ErrorCommon } from "../../../core/common/error";
import { QueryCommon } from "../../../core/common/query";
import { Database } from "../../../core/database/database";
import { Users } from "../../../core/database/schema";

export const chatsGetSchema = z
  .object({ limit: z.coerce.number().default(10), page: z.coerce.number().optional() })
  .openapi("ChatGet");

export async function chatsGetHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Selectable<Users>;

    const input = chatsGetSchema.safeParse(req.query);
    if (!input.success) {
      ErrorCommon.badRequest(res, `Xác thực dữ liệu đầu vào thất bại: ${input.error.message}`);
      return;
    }

    await Database.transaction().execute(async (trx) => {
      const chats = await QueryCommon.getChats(trx, {
        userId: user.id,
        limit: input.data.limit + 1,
        page: input.data.page,
      });
      res.status(200).json({
        next_page: chats.length < input.data.limit + 1 ? null : chats[input.data.limit - 1].id,
        data: chats.length < input.data.limit + 1 ? chats : chats.slice(0, -1),
      });
    });
  } catch (err) {
    next(err);
  }
}
