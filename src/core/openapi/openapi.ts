import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const openapiRegistry = new OpenAPIRegistry();

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV31(openapiRegistry.definitions);
  const document = generator.generateDocument({
    openapi: "3.1.0",
    info: { version: "1.0.0", title: "Chatbot API" },
    tags: [
      { name: "Authentication", description: "API thực hiện đăng nhập, đăng ký và xác thực người dùng." },
      { name: "User", description: "API thực hiện lấy, sửa đổi,... thông tin người dùng." },
      { name: "Chat", description: "API thực hiện lấy group chat, chat,..." },
    ],
  });
  return {
    ...document,
    components: {
      ...document.components,
      securitySchemes: {
        bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };
}
