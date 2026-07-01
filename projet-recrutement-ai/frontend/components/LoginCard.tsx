"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

interface LoginCardProps {
    setView: (view: "login" | "register") => void;
}

export default function LoginCard({ setView }: LoginCardProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await authClient.signIn.email({ email, password });

        if (error) {
            setError(error.message || "Invalid email or password.");
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    const handleGithubLogin = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "http://localhost:3000/dashboard"
        });
    };
    const handleGoogleLogin = async () => {
    try {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000/dashboard"
        });
    } catch (error) {
        console.error("Error signing in with Google:", error);
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
                    {error && (
                        <div className="flex items-start gap-2 bg-danger-50 text-danger border border-danger-200 rounded-lg p-3">
                            <Icon icon="lucide:circle-alert" className="w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm">{error}</p>
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
                    <Input
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        variant="bordered"
                        value={password}
                        onValueChange={setPassword}
                        isRequired
                    />
                    <div className="flex justify-end">
                        <Link href="/reset-password" size="sm" className="cursor-pointer">
                            Forgot password?
                        </Link>
                    </div>
                    <Button type="submit" color="success" className="text-white font-medium" isLoading={loading}>
                        Sign In
                    </Button>
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-divider" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-content1 px-2 text-default-400">Or continue with</span>
                        </div>
                    </div>
                    <Button 
                            variant="bordered"
                            className="w-full border-default-200 hover:border-default-400 font-medium"
                            startContent={<Icon icon="logos:google-icon" className="w-5 h-5" />}
                            onPress={handleGoogleLogin}
                        >
                            Sign in with Google
                    </Button>
                    <Button
                        variant="bordered"
                        className="w-full border-default-200 hover:border-default-400 font-medium"
                        startContent={<Icon icon="lucide:github" className="size-5 text-default-900" />}
                        onPress={handleGithubLogin}
                    >
                        Sign in with GitHub
                    </Button>
                </form>
            </CardBody>
            <CardFooter className="justify-center">
                <p className="text-small">
                    Don&apos;t have an account?{" "}
                    <Link size="sm" className="cursor-pointer" onPress={() => setView("register")}>
                        Create one
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
