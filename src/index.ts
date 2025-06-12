import express, { json, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { ErrorCommon } from "./core/common/error";
import { generateOpenAPIDocument } from "./core/openapi/openapi";
import { router as authRouter } from "./features/auth/router";
import { router as chatsRouter } from "./features/chats/router";
import { router as usersRouter } from "./features/users/router";

async function main() {
  const app = express();
  app.use(json());
  app.use(authRouter);
  app.use(usersRouter);
  app.use(chatsRouter);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(generateOpenAPIDocument()));
  app.use((_, res) => {
    if (!res.headersSent) ErrorCommon.notFound(res, "Không tìm thấy đường dẫn được yêu cầu.");
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    ErrorCommon.internalServerError(res, "Có lỗi xảy ra. Hãy thử lại sau.");
  });
  app.listen(process.env.PORT, () => {
    console.log(`Đang khởi chạy server tại cổng ${process.env.PORT}`);
  });
}

main();
