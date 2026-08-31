import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const rawUrl = process.env.DATABASE_URL || "";
let dbConfig;

try {
  const parsed = new URL(rawUrl);
  dbConfig = {
    host: parsed.hostname === "localhost" ? "127.0.0.1" : parsed.hostname,
    port: Number(parsed.port) || 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    connectionLimit: 30,
  };
} catch (e) {
  dbConfig = rawUrl.replace(/^mysql:/, "mariadb:");
}

const adapter = new PrismaMariaDb(dbConfig);
const prisma = new PrismaClient({ adapter });

export default prisma;
