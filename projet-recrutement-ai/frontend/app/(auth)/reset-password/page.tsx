"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const { error } = await (authClient as any).forgetPassword({ email });

        if (error) {
            setError(error.message || "Failed to send reset link.");
            setLoading(false);
        } else {
            setSuccess("If that email is registered, you will receive a password reset link shortly.");
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-[400px] p-4 shadow-lg">
            <CardHeader className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-small text-default-500">
                    Enter your email to receive a reset link
                </p>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleReset} className="flex flex-col gap-4">
                    {error && (
                        <div className="flex items-start gap-2 bg-danger-50 text-danger border border-danger-200 rounded-lg p-3">
                            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-start gap-2 bg-success-50 text-success border border-success-200 rounded-lg p-3">
                            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm">{success}</p>
                        </div>
                    )}
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        variant="bordered"
                        value={email}
                        onValueChange={setEmail}
                        isRequired
                    />
                    <Button
                        type="submit"
                        color="warning"
                        className="font-medium"
                        isLoading={loading}
                    >
                        Send Reset Link
                    </Button>
                </form>
            </CardBody>
            <CardFooter className="justify-center">
                <Link href="/" size="sm" className="cursor-pointer">
                    Back to sign in
                </Link>
            </CardFooter>
        </Card>
    );
}
