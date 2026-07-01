"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "@iconify/react";

interface RegisterCardProps {
    setView: (view: "login" | "register") => void;
}

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
            isOnboarded: true,
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
                            <Icon icon="lucide:circle-alert" className="w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold">Registration failed</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-start gap-2 bg-success-50 text-success border border-success-200 rounded-lg p-3">
                            <Icon icon="lucide:circle-check" className="w-5 h-5 mt-0.5 shrink-0" />
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
                    
            {/* Role Selection Buttons */}
                    <div className="flex gap-2 w-full">
                        <Button
                            className="flex-1 font-medium border-2"
                            color={role === "candidat" ? "primary" : "default"}
                            variant="bordered"
                            onPress={() => setRole("candidat")}
                        >
                            Candidat
                        </Button>
                        <Button
                            className="flex-1 font-medium border-2"
                            color={role === "recruteur" ? "primary" : "default"}
                            variant="bordered"
                            onPress={() => setRole("recruteur")}
                        >
                            Recruteur
                        </Button>
                    </div>

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