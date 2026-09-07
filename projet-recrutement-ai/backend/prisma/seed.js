import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import prisma from "../src/config/db.js";

const email = "admin2@test.com";
const password = "AdminPass123!";

// 1. Create or update user with role: "ADMIN", isOnboarded: true
// 2. Create/update Account with providerId: "credential" and hashed password