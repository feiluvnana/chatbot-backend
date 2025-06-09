import { NextFunction, Request, Response } from "express";
import { Selectable } from "kysely";
import z from "zod";
import { ErrorCommon } from "../../../core/common/error";
import { QueryCommon } from "../../../core/common/query";
import { Database } from "../../../core/database/database";
import { Users } from "../../../core/database/schema";

export const chatsGetMessagesQuerySchema = z
  .object({ limit: z.coerce.number().default(10), page: z.coerce.number().optional() })
  .openapi("ChatGetMessages");

export const chatsGetMessagesPathSchema = z.object({ chat_id: z.coerce.number() });

export async function chatsGetMessagesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Selectable<Users>;

    const inputQuery = chatsGetMessagesQuerySchema.safeParse(req.query);
    if (!inputQuery.success) {
      ErrorCommon.badRequest(res, `Xác thực dữ liệu đầu vào thất bại: ${inputQuery.error.message}`);
      return;
    }

    const inputPath = chatsGetMessagesPathSchema.safeParse(req.params);
    if (!inputPath.success) {
      return ErrorCommon.badRequest(res, `Xác thực dữ liệu đầu vào thất bại: ${inputPath.error.message}`);
    }

    await Database.transaction().execute(async (trx) => {
      const chat = await QueryCommon.getChatById(trx, { id: inputPath.data.chat_id });
      if (chat?.user_id !== user.id) {
        return ErrorCommon.forbidden(res, "Bạn không có quyền truy cập vào đoạn chat này.");
      }

      const messages = await QueryCommon.getMessages(trx, {
        chatId: chat.id,
        limit: inputQuery.data.limit + 1,
        page: inputQuery.data.page,
      });
      res.status(200).json({
        next_page: messages.length < inputQuery.data.limit + 1 ? null : messages[inputQuery.data.limit - 1].id,
        data: messages.length < inputQuery.data.limit + 1 ? messages : messages.slice(0, -1),
      });
    });
  } catch (err) {
    next(err);
  }
}
