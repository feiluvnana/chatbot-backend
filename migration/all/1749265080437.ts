/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("provider", sql`enum("google")`, (col) => col.notNull())
    .addColumn("provider_data", "json", (col) => col.notNull())
    .addColumn("state", sql`enum("unactivated", "activated")`, (col) => col.notNull())
    .addColumn("fullname", "varchar(50)")
    .addColumn("school", "varchar(50)")
    .addColumn("school_address", "varchar(255)")
    .addColumn("occupation", "varchar(50)")
    .addColumn("phone_number", "varchar(20)")
    .addColumn("created_at", "datetime", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updated_at", "datetime", (col) =>
      col
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
        .notNull()
    )
    .execute();

  await db.schema
    .createTable("chats")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").onUpdate("cascade").onDelete("cascade").notNull()
    )
    .addColumn("name", "varchar(255)")
    .addColumn("created_at", "datetime", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updated_at", "datetime", (col) =>
      col
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
        .notNull()
    )
    .execute();

  await db.schema
    .createTable("messages")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("chat_id", "integer", (col) =>
      col.references("chats.id").onUpdate("cascade").onDelete("cascade").notNull()
    )
    .addColumn("role", sql`enum("user", "model")`, (col) => col.notNull())
    .addColumn("data", "json", (col) => col.notNull())
    .addColumn("created_at", "datetime", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updated_at", "datetime", (col) =>
      col
        .defaultTo(sql`CURRENT_TIMESTAMP`)
        .modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
        .notNull()
    )
    .execute();

  await db.schema.createIndex("idx_chats_created_at_user_id").on("chats").columns(["created_at", "user_id"]).execute();

  await db.schema
    .createIndex("idx_messages_created_at_chat_id")
    .on("messages")
    .columns(["chat_id", "created_at"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("messages").ifExists().execute();
  await db.schema.dropTable("chats").ifExists().execute();
  await db.schema.dropTable("users").ifExists().execute();
}
