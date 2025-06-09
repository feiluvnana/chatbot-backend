import { NextFunction, Request, Response } from "express";
import { InsertResult, Selectable } from "kysely";
import { ErrorCommon } from "../../../core/common/error";
import { QueryCommon } from "../../../core/common/query";
import { SchemaCommon } from "../../../core/common/schema";
import { Database } from "../../../core/database/database";
import { Users } from "../../../core/database/schema";

export const chatsCreateSchema = SchemaCommon.chats
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    user_id: true,
  })
  .openapi("ChatCreate");

export async function chatsCreateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    let result: InsertResult | undefined;
    const user = req.user as Selectable<Users>;

    const input = chatsCreateSchema.safeParse(req.body);
    if (!input.success) {
      ErrorCommon.badRequest(res, `Xác thực dữ liệu đầu vào thất bại: ${input.error.message}`);
      return;
    }

    await Database.transaction().execute(async (trx) => {
      result = await trx
        .insertInto("chats")
        .values([{ ...input.data, user_id: user.id }])
        .executeTakeFirst();
    });

    if (result !== undefined) {
      const chatId = parseInt(result.insertId!.toString());
      await Database.transaction().execute(async (trx) => {
        res.status(200).json(await QueryCommon.getChatById(trx, { id: chatId }));
      });
    }
  } catch (err) {
    next(err);
  }
}
