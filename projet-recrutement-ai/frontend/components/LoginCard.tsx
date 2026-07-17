"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, TextField, Label, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Alert from "@/components/ui/Alert";

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

        const { data, error } = await authClient.signIn.email({ email, password });

        if (error) {
            setError(error.message || "Invalid email or password.");
            setLoading(false);
        } else if (data) {
            const role = (data.user as any).role;

            router.push(role === "RECRUITER" ? "/recruiter/dashboard" : "/candidate/dashboard");

        }
    };

    const handleGithubLogin = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: window.location.origin
        });
    };
    const handleGoogleLogin = async () => {
    try {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: window.location.origin
        });
    } catch (error) {
        console.error("Error signing in with Google:", error);
    }
};

    const handleLinkedinLogin = async () => {
    try {
        sessionStorage.setItem("is_signing_up", "false");
        await authClient.signIn.social({
            provider: "linkedin",
            callbackURL: window.location.origin
        });
    } catch (error) {
        console.error("Kh6a2 f dkhul b LinkedIn:", error);
    }
};

    return (
        <Card className="w-full shadow-none border-none bg-transparent p-0">
            <CardHeader className="flex flex-col items-center gap-3 pb-2">
               
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-default-500">Sign in to your account</p>
                </div>
            </CardHeader>
            <CardContent className="px-6 pt-4">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {error && <Alert variant="danger" message={error} />}
                    <TextField isRequired value={email} onChange={setEmail}>
                        <Label>Email</Label>
                        <Input type="email" placeholder="you@example.com" />
                    </TextField>
                    <TextField isRequired value={password} onChange={setPassword}>
                        <Label>Password</Label>
                        <Input type="password" placeholder="Enter your password" />
                    </TextField>
                    <div className="flex justify-end -mt-1">
                        <Link href="/reset-password" className="cursor-pointer text-primary text-sm">
                            Forgot password?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="font-semibold"
                        isDisabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                   <div className="flex items-center gap-4 my-5">
                        <hr className="flex-1 border-t border-default-200" />
                        <span className="text-xs font-medium text-default-500 uppercase tracking-wider">
                            Or continue with
                        </span>
                        <hr className="flex-1 border-t border-default-200" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Button
                            variant="outline"
                            className="w-full h-11 font-medium"
                            onPress={handleGoogleLogin}
                        >
                            <Icon icon="logos:google-icon" className="w-5 h-5" />
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-11 font-medium"
                            onPress={handleLinkedinLogin}
                        >
                            <Icon icon="logos:linkedin-icon" className="w-5 h-5" />
                            Continue with LinkedIn
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-11 font-medium"
                            onPress={handleGithubLogin}
                        >
                            <Icon icon="lucide:github" className="w-5 h-5 text-default-900" />
                            Continue with GitHub
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="justify-center gap-1 pt-2 pb-0">
                <p className="text-sm text-default-500">
                    Don&apos;t have an account?
                </p>
                <Link className="cursor-pointer font-medium text-primary text-sm" onPress={() => setView("register")}>
                    Create one
                </Link>
            </CardFooter>
        </Card>
    );
}
