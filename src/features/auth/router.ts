import { Router } from "express";
import z from "zod";
import { openapiRegistry } from "../../core/openapi/openapi";
import passport from "../../core/passport/passport";
import { authGoogleCallbackHandler } from "./handlers/auth_google_callback_handler";
import { authGoogleFailureHandler } from "./handlers/auth_google_failure_handler";

export const router = Router();

openapiRegistry.registerPath({
  path: "/v1/auth/google",
  method: "get",
  tags: ["Authentication"],
  summary: "Sử dụng để đăng nhập với Google. (Không gọi bằng Swagger được đâu. Hãy dùng browser.)",
  responses: {
    "302": {
      description: "Đăng nhập Google thành công.",
      content: { "text/plain": { schema: z.string() } },
    },
    "401": {
      description: "Đăng nhập Google thất bại.",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
  },
});
router.get("/v1/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/v1/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/v1/auth/google/failure", session: false }),
  authGoogleCallbackHandler
);

router.get("/v1/auth/google/failure", authGoogleFailureHandler);
