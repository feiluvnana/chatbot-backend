import { Router } from "express";
import z from "zod";
import { MiddlewareCommon } from "../../core/common/middleware";
import { SchemaCommon } from "../../core/common/schema";
import { openapiRegistry } from "../../core/openapi/openapi";
import { chatsCreateHandler, chatsCreateSchema } from "./handlers/chats_create_handler";
import { chatsGetHandler, chatsGetSchema } from "./handlers/chats_get_handler";
import {
  chatsGetMessagesHandler,
  chatsGetMessagesPathSchema,
  chatsGetMessagesQuerySchema,
} from "./handlers/chats_get_messages_handler";
import { chatsSendBodySchema, chatsSendHandler, chatsSendPathSchema } from "./handlers/chats_send_handler";

export const router = Router();

openapiRegistry.registerPath({
  path: "/v1/chats",
  method: "get",
  tags: ["Chat"],
  security: [{ bearer: [] }],
  summary: "Sử dụng để lấy được danh sách các đoạn chat của người dùng. (Mới hơn sẽ đứng trước)",
  request: { query: chatsGetSchema },
  responses: {
    "200": {
      description: "Lấy đoạn chat thành công.",
      content: {
        "application/json": {
          schema: z.object({ next_page: z.number().nullable(), data: z.array(SchemaCommon.chats) }),
        },
      },
    },
    "401": {
      description: "Không thể xác thực token.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
  },
});
router.get("/v1/chats", MiddlewareCommon.jwtToUser, MiddlewareCommon.mustActivated, chatsGetHandler);

openapiRegistry.registerPath({
  path: "/v1/chats/create",
  method: "post",
  tags: ["Chat"],
  security: [{ bearer: [] }],
  summary: "Sử dụng để tạo đoạn chat mới.",
  request: { body: { content: { "application/json": { schema: chatsCreateSchema } } } },
  responses: {
    "200": {
      description: "Tạo đoạn chat thành công.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    "401": {
      description: "Không thể xác thực token.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
  },
});
router.post("/v1/chats/create", MiddlewareCommon.jwtToUser, MiddlewareCommon.mustActivated, chatsCreateHandler);

openapiRegistry.registerPath({
  path: "/v1/chats/{chat_id}/messages",
  method: "get",
  tags: ["Chat"],
  security: [{ bearer: [] }],
  summary: "Sử dụng để lấy danh sách tin nhắn.",
  request: { query: chatsGetMessagesQuerySchema, params: chatsGetMessagesPathSchema },
  responses: {
    "200": {
      description: "Lấy danh sách tin nhắn thành công.",
      content: {
        "application/json": {
          schema: z.object({ next_page: z.number().nullable(), data: z.array(SchemaCommon.messages) }),
        },
      },
    },
    "401": {
      description: "Không thể xác thực token.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    "403": {
      description: "Không phải đoạn chat của bản thân.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
  },
});
router.get(
  "/v1/chats/:chat_id/messages",
  MiddlewareCommon.jwtToUser,
  MiddlewareCommon.mustActivated,
  chatsGetMessagesHandler
);

openapiRegistry.registerPath({
  path: "/v1/chats/{chat_id}/send",
  method: "post",
  tags: ["Chat"],
  security: [{ bearer: [] }],
  summary: "Sử dụng để gửi tin nhắn tới một đoạn chat của người dùng. (Mới hơn sẽ đứng trước)",
  request: { body: { content: { "application/json": { schema: chatsSendBodySchema } } }, params: chatsSendPathSchema },
  responses: {
    "200": {
      description: "Gửi tin nhắn thành công, trả về tin nhắn của người dùng và tin nhắn của model.",
      content: { "application/json": { schema: z.array(SchemaCommon.messages) } },
    },
    "401": {
      description: "Không thể xác thực token.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
  },
});
router.post("/v1/chats/:chat_id/send", MiddlewareCommon.jwtToUser, MiddlewareCommon.mustActivated, chatsSendHandler);
