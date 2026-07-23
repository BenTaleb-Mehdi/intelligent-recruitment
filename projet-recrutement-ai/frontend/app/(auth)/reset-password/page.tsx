"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, TextField, Label, Input, Button, Link } from "@heroui/react";
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

const { error } = await authClient.requestPasswordReset({ 
    email,
    // Change this URL to point to /update-password
    redirectTo: "http://localhost:3000/update-password", 
});

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
            <Card.Header className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-small text-default-500">
                    Enter your email to receive a reset link
                </p>
            </Card.Header>
            <CardContent>
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
                    
                    {/* Corrected onChange to extract the target value correctly */}
                    <TextField isRequired value={email} onChange={(value: string) => setEmail(value)}>
                        <Label>Email</Label>
                        <Input type="email" placeholder="you@example.com" />
                    </TextField>
                    
                    <Button
                        type="submit"
                        variant="primary"
                        className="font-medium"
                        isDisabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <Link href="/" className="cursor-pointer text-sm">
                    Back to sign in
                </Link>
            </CardFooter>
        </Card>
    );
}