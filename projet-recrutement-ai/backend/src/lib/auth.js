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
     
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        },
        linkedin: {
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        },
    },
  
    account: {
        accountLinking: {
            enabled: true,
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "candidat",
                input: true,
            },
            isOnboarded: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: true,
            },
        },
    },

    session: {
        customSession: async ({ session, user }) => {
            return {
                ...session,
                user: {
                    ...user,
                    isOnboarded: user.isOnboarded ?? false,
                }
            }
        }
    },

    basePath: "/api/auth",
    trustedOrigins: ["http://localhost:3000"],
});