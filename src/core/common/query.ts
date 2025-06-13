import { sql, Transaction } from "kysely";
import { DB } from "../database/schema";

export class QueryCommon {
  static getUserByGoogleProviderDataId(trx: Transaction<DB>, params: { id: string }) {
    return trx
      .selectFrom("users")
      .selectAll()
      .where(sql`JSON_EXTRACT(users.provider_data, "$.id")`, "=", params.id)
      .executeTakeFirst();
  }

  static getUserById(trx: Transaction<DB>, params: { id: number }) {
    return trx.selectFrom("users").selectAll().where("id", "=", params.id).executeTakeFirst();
  }

  static getChats(trx: Transaction<DB>, params: { userId: number; limit: number; page?: number }) {
    return trx
      .selectFrom("chats")
      .selectAll()
      .$if(params.page !== undefined, (qb) => qb.where("id", "<", params.page!))
      .where("user_id", "=", params.userId)
      .orderBy("created_at", "desc")
      .orderBy("id", "desc")
      .limit(params.limit)
      .execute();
  }

  static getChatById(trx: Transaction<DB>, params: { id: number }) {
    return trx.selectFrom("chats").selectAll().where("id", "=", params.id).executeTakeFirst();
  }

  static getMessages(trx: Transaction<DB>, params: { chatId: number; limit: number; page?: number }) {
    return trx
      .selectFrom("messages")
      .selectAll()
      .$if(params.page !== undefined, (qb) => qb.where("id", "<", params.page!))
      .where("chat_id", "=", params.chatId)
      .orderBy("created_at", "desc")
      .orderBy("id", "desc")
      .limit(params.limit)
      .execute();
  }

  static getAllMessagesForChatCore(trx: Transaction<DB>, params: { id: number }) {
    return trx
      .selectFrom("messages")
      .selectAll()
      .where("chat_id", "=", params.id)
      .orderBy("created_at", "asc")
      .orderBy("id", "asc")
      .execute();
  }

  static getMessageById(trx: Transaction<DB>, params: { id: number }) {
    return trx.selectFrom("messages").selectAll().where("id", "=", params.id).executeTakeFirst();
  }
}
