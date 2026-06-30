"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

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
                            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
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
        startContent={<GoogleIcon className="w-5 h-5" />}
        onPress={handleGoogleLogin}
    >
        Dkhul b Google
    </Button>
                    <Button
                        variant="bordered"
                        className="w-full border-default-200 hover:border-default-400 font-medium"
                        startContent={<GithubIcon className="size-5 text-default-900" />}
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
