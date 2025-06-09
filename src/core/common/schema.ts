import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Selectable } from "kysely";
import z from "zod";
import { Chats, Messages, Users } from "../database/schema";

extendZodWithOpenApi(z);

const schemaForType =
  <T>() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

export class SchemaCommon {
  static users = schemaForType<Selectable<Users>>()(
    z.object({
      id: z.number(),
      state: z.enum(["activated", "unactivated"]),
      provider: z.enum(["google"]),
      provider_data: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
      }),
      fullname: z.string().nullable(),
      school: z.string().nullable(),
      school_address: z.string().nullable(),
      occupation: z.string().nullable(),
      phone_number: z.string().nullable(),
      created_at: z.date(),
      updated_at: z.date(),
    })
  ).openapi("User");

  static chats = schemaForType<Selectable<Chats>>()(
    z.object({
      id: z.number(),
      user_id: z.number(),
      name: z.string(),
      created_at: z.date(),
      updated_at: z.date(),
    })
  ).openapi("Chat");

  static messages = schemaForType<Selectable<Messages>>()(
    z.object({
      id: z.number(),
      chat_id: z.number(),
      role: z.enum(["user", "model"]),
      data: z.object({}),
      created_at: z.date(),
      updated_at: z.date(),
    })
  ).openapi("Message");
}
