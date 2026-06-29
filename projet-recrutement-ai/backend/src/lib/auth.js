import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../config/db.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {  
        enabled: true,
        autoSignIn: true
    },
    basePath: "/api/auth", // Must match the Express mount path
    trustedOrigins: ["http://localhost:3000"],
});