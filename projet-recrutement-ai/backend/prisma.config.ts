import "dotenv/config";
import { defineConfig } from "prisma/config";

declare const process: any;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
});
