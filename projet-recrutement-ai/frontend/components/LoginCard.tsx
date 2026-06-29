"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface LoginCardProps {
    setView: (view: "login" | "register") => void;
}

export default function LoginCard({ setView }: LoginCardProps) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await authClient.signIn.email({ email, password });

        if (error) {
            setError(error.message || "Invalid email or password!");
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <Card className="w-full max-w-[400px] p-4 shadow-lg">
            <CardHeader className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-small text-default-500">Sign in to your dashboard</p>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {error && <p className="text-danger text-sm bg-danger-50 p-2 rounded">{error}</p>}
                    <Input type="email" label="Email" variant="bordered" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input type="password" label="Password" variant="bordered" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" color="success" className="text-white" isLoading={loading}>Sign In</Button>
                </form>
            </CardBody>
            <CardFooter className="justify-center">
                <p className="text-small">Don&apos;t have an account? <Link size="sm" className="cursor-pointer" onPress={() => setView("register")}>Create one</Link></p>
            </CardFooter>
        </Card>
    );
}