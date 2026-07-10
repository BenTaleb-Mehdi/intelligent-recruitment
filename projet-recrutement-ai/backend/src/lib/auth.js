import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../config/db.js";
import nodemailer from "nodemailer";

let transporter;

if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {  
        enabled: true,
        autoSignIn: true,
sendResetPassword: async ({ user, url }) => {
    if (transporter) {
        await transporter.sendMail({
            from: `"Recrutement App" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: "Reset your password - Recrutement App",
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; color: #3f3f46;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <h2 style="color: #18181b; margin-top: 0; font-size: 24px; text-align: center;">
                        Password Reset
                    </h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                        Hello,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                        We received a request to reset the password for your account. Click the button below to choose a new password:
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${url}" style="background-color: #006fee; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                            Reset My Password
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 30px 0;">
                    
                    <p style="font-size: 12px; color: #a1a1aa; text-align: center; line-height: 1.5; margin-bottom: 0;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.<br>
                        This link will expire in 1 hour.
                    </p>
                    
                </div>
            </div>
            `,
        });
    } else {
        console.log("📧 [DEV] Password reset URL:", url);
    }
},
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