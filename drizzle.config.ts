import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: [".env", ".env.local"],
});

export default defineConfig({
  driver: "turso",
  dialect: "sqlite",
  schema: "./lib/drizzle/schema.ts",
  out: "./lib/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./sqlite.db",
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
