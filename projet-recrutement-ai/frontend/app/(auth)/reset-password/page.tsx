"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "@iconify/react";

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
                            <Icon icon="lucide:circle-alert" className="w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-start gap-2 bg-success-50 text-success border border-success-200 rounded-lg p-3">
                            <Icon icon="lucide:circle-check" className="w-5 h-5 mt-0.5 shrink-0" />
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
