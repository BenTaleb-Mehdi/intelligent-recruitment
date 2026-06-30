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
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        // 👈 هاهي تفركسات هنا رجعات ساطة ونقية
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        },
    },
    // 💡 تفادى مشاكل account_not_linked مستقبلاً
    account: {
        accountLinking: {
            enabled: true,
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "candidat",
                input: true,
            },
        },
    },
    basePath: "/api/auth",
    trustedOrigins: ["http://localhost:3000"],
});