"use client";
import React, { useState, Suspense } from "react";
import { Card, CardHeader, CardContent, TextField, Label, Input, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "@iconify/react";
import { useSearchParams, useRouter } from "next/navigation";

function UpdatePasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!token) {
            setError("Invalid or missing reset token. Please request a new link.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        // This is the Better Auth method to finalize the new password
        const { error } = await authClient.resetPassword({ 
            newPassword: password,
            token: token 
        });

        if (error) {
            setError(error.message || "Failed to reset password.");
            setLoading(false);
        } else {
            // Success! Send them to the login page
            router.push("/");
        }
    };

    return (
        <Card className="w-full max-w-[400px] p-4 shadow-lg">
            <CardHeader className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Update Password</h1>
                <p className="text-small text-default-500">
                    Enter your new secure password
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    {error && (
                        <div className="flex items-start gap-2 bg-danger-50 text-danger border border-danger-200 rounded-lg p-3">
                            <Icon icon="lucide:circle-alert" className="w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    
                    <TextField isRequired value={password} onChange={(value: string) => setPassword(value)}>
                        <Label>New Password</Label>
                        <Input type="password" placeholder="••••••••" />
                    </TextField>

                    <TextField isRequired value={confirmPassword} onChange={(value: string) => setConfirmPassword(value)}>
                        <Label>Confirm Password</Label>
                        <Input type="password" placeholder="••••••••" />
                    </TextField>
                    
                    <Button
                        type="submit"
                        variant="primary"
                        className="font-medium"
                        isDisabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

// We wrap this in Suspense because Next.js requires it when using useSearchParams()
export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UpdatePasswordForm />
        </Suspense>
    );
}