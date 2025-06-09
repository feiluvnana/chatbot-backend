import { NextFunction, Request, Response } from "express";
import { InsertResult, Selectable } from "kysely";
import z from "zod";
import { ErrorCommon } from "../../../core/common/error";
import { QueryCommon } from "../../../core/common/query";
import { Database } from "../../../core/database/database";
import { Users } from "../../../core/database/schema";

export const chatsSendBodySchema = z.object({ text: z.string() }).openapi("ChatSend");

export const chatsSendPathSchema = z.object({ chat_id: z.coerce.number() });

export async function chatsSendHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as Selectable<Users>;
    let resultUser: InsertResult | undefined;
    let resultModel: InsertResult | undefined;

    const inputBody = chatsSendBodySchema.safeParse(req.body);
    if (!inputBody.success) {
      ErrorCommon.badRequest(res, `Xác thực dữ liệu đầu vào thất bại: ${inputBody.error.message}`);
      return;
    }

    const inputPath = chatsSendPathSchema.safeParse(req.params);
    if (!inputPath.success) {
      return ErrorCommon.badRequest(res, `Xác thực dữ liệu đầu vào thất bại: ${inputPath.error.message}`);
    }

    await Database.transaction().execute(async (trx) => {
      const chat = await QueryCommon.getChatById(trx, { id: inputPath.data.chat_id });
      if (chat?.user_id !== user.id) {
        return ErrorCommon.forbidden(res, "Bạn không có quyền truy cập vào đoạn chat này.");
      }

      resultUser = await trx
        .insertInto("messages")
        .values([{ chat_id: chat.id, role: "user", data: JSON.stringify(inputBody.data) }])
        .executeTakeFirst();
    });

    await Database.transaction().execute(async (trx) => {
      const messages = await QueryCommon.getAllMessagesForChatCore(trx, { id: inputPath.data.chat_id });
      const response = await fetch(process.env.CHATCORE_URL!, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: req.headers.authorization?.split(" ")[1],
          messages: messages.map((m) => ({
            role: m.role,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content: (m.data as any).text || "",
          })),
        }),
      });
      const answer = await response.json();
      resultModel = await trx
        .insertInto("messages")
        .values([{ chat_id: inputPath.data.chat_id, role: "model", data: JSON.stringify({ text: answer.answer }) }])
        .executeTakeFirst();
    });

    if (resultUser !== undefined && resultModel !== undefined) {
      const userMessageId = parseInt(resultUser.insertId!.toString());
      const modelMessageId = parseInt(resultModel.insertId!.toString());
      await Database.transaction().execute(async (trx) =>
        res
          .status(200)
          .json([
            await QueryCommon.getMessageById(trx, { id: userMessageId }),
            await QueryCommon.getMessageById(trx, { id: modelMessageId }),
          ])
      );
    }
  } catch (err) {
    next(err);
  }
}
