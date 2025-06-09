import { FileMigrationProvider, Kysely, Migrator, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { promises as fs } from "node:fs";
import path from "node:path";

const migrator = new Migrator({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: new Kysely<any>({
    dialect: new MysqlDialect({
      pool: async () => {
        return createPool({ uri: process.env.DATABASE_URL!, timezone: "local" });
      },
    }),
  }),
  provider: new FileMigrationProvider({ fs, path, migrationFolder: path.join(__dirname, "all") }),
});

async function migrate() {
  // For resetting
  // await migrator.migrateTo(NO_MIGRATIONS);
  console.log(await migrator.migrateToLatest());
  process.exit(0);
}

migrate();
