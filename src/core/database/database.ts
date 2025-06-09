import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "./schema";

export const Database = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: async () => {
      return createPool({ uri: process.env.DATABASE_URL!, timezone: "local" });
    },
  }),
});
