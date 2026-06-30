"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link, Select, SelectItem } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

interface RegisterCardProps {
    setView: (view: "login" | "register") => void;
}

const roles = [
    { key: "candidat", label: "Candidat" },
    { key: "recruteur", label: "Recruteur" },
];

export default function RegisterCard({ setView }: RegisterCardProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<string>("candidat");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const { error } = await authClient.signUp.email({
            email,
            password,
            name,
            role,
        } as any);

        if (error) {
            setError(error.message || "Something went wrong. Please try again.");
            setLoading(false);
        } else {
            setSuccess("Account created successfully! You can now sign in.");
            setLoading(false);
            setTimeout(() => setView("login"), 2000);
        }
    };

    return (
        <Card className="w-full max-w-[400px] p-4 shadow-lg">
            <CardHeader className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-small text-default-500">Sign up for a new account</p>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    {error && (
                        <div className="flex items-start gap-2 bg-danger-50 text-danger border border-danger-200 rounded-lg p-3">
                            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-semibold">Registration failed</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-start gap-2 bg-success-50 text-success border border-success-200 rounded-lg p-3">
                            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-semibold">Account created!</p>
                                <p className="text-sm">{success}</p>
                            </div>
                        </div>
                    )}
                    <Input
                        type="text"
                        label="Full Name"
                        placeholder="John Doe"
                        variant="bordered"
                        value={name}
                        onValueChange={setName}
                        isRequired
                    />
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        variant="bordered"
                        value={email}
                        onValueChange={setEmail}
                        isRequired
                    />
                    <Input
                        type="password"
                        label="Password"
                        placeholder="Create a strong password"
                        variant="bordered"
                        value={password}
                        onValueChange={setPassword}
                        isRequired
                    />
                    <Select
                        label="Role"
                        placeholder="Select your role"
                        variant="bordered"
                        selectedKeys={[role]}
                        onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string;
                            if (value) setRole(value);
                        }}
                    >
                        {roles.map((r) => (
                            <SelectItem key={r.key}>{r.label}</SelectItem>
                        ))}
                    </Select>
                    <Button type="submit" color="primary" className="font-medium" isLoading={loading}>
                        Register
                    </Button>
                </form>
            </CardBody>
            <CardFooter className="justify-center">
                <p className="text-small">
                    Already have an account?{" "}
                    <Link size="sm" className="cursor-pointer" onPress={() => setView("login")}>
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
