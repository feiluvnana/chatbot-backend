import { Router } from "express";
import z from "zod";
import { MiddlewareCommon } from "../../core/common/middleware";
import { SchemaCommon } from "../../core/common/schema";
import { openapiRegistry } from "../../core/openapi/openapi";
import { usersActivateHandler, usersActivateSchema } from "./handlers/users_activate_handler";
import { usersProfileHandler } from "./handlers/users_profile_handler";

export const router = Router();

openapiRegistry.registerPath({
  path: "/v1/users/profile",
  method: "get",
  tags: ["User"],
  security: [{ bearer: [] }],
  summary: "Sử dụng để lấy thông tin người dùng.",
  responses: {
    "200": {
      description: "Lấy thông tin người dùng thành công.",
      content: { "application/json": { schema: SchemaCommon.users } },
    },
    "401": {
      description: "Không thể xác thực token.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    "404": {
      description: "Không có thông tin người dùng.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
  },
});
router.get("/v1/users/profile", MiddlewareCommon.jwtToUser, usersProfileHandler);

openapiRegistry.registerPath({
  path: "/v1/users/activate",
  method: "post",
  tags: ["User"],
  security: [{ bearer: [] }],
  summary: "Sử dụng để cập nhật thông tin. Cần cập nhật mới có thể dùng tài khoản.",
  request: {
    body: {
      content: { "application/json": { schema: usersActivateSchema } },
    },
  },
  responses: {
    "200": {
      description: "Cập nhật thành công.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    "400": {
      description: "Không thể kích hoạt tài khoản.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    "401": {
      description: "Không thể xác thực token.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    "404": {
      description: "Cập nhật thất bại.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
  },
});
router.post("/v1/users/activate", MiddlewareCommon.jwtToUser, usersActivateHandler);
