"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, TextField, Label, Input, Button, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "@iconify/react";
import Alert from "@/components/ui/Alert";

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

        const mappedRole = role === "recruteur" ? "RECRUITER" : "CANDIDATE";
        const { error } = await authClient.signUp.email({
            email,
            password,
            name,
            role: mappedRole,
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
        <Card className="w-full shadow-none border-none bg-transparent p-0">
            <CardHeader className="flex flex-col items-center gap-3 pb-2">
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-sm text-default-500">Sign up to get started</p>
                </div>
            </CardHeader>
            <CardContent className="px-6 pt-4">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    {error && <Alert variant="danger" title="Registration failed" message={error} />}
                    {success && <Alert variant="success" title="Account created!" message={success} />}
                    <TextField isRequired value={name} onChange={setName}>
                        <Label>Full Name</Label>
                        <Input type="text" placeholder="John Doe" />
                    </TextField>
                    <TextField isRequired value={email} onChange={setEmail}>
                        <Label>Email</Label>
                        <Input type="email" placeholder="you@example.com" />
                    </TextField>
                    <TextField isRequired value={password} onChange={setPassword}>
                        <Label>Password</Label>
                        <Input type="password" placeholder="Create a strong password" />
                    </TextField>

                    {/* Role Selection - Modern Segmented Control */}
                    <div className="space-y-3 mt-1 mb-2">
                        <span className="text-sm font-medium text-default-700">I want to join as</span>
                        <div className="flex p-1 bg-default-100 rounded-2xl ring-1 ring-inset ring-black/5">
                            <button
                                type="button"
                                onClick={() => setRole("candidat")}
                                className={`flex-1 flex items-center justify-center gap-2 h-11 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                    role === "candidat"
                                        ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                                        : "text-default-500 hover:text-default-700 hover:bg-default-200/50"
                                }`}
                            >
                                <Icon icon="lucide:graduation-cap" className="w-[18px] h-[18px]" />
                                Candidat
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("recruteur")}
                                className={`flex-1 flex items-center justify-center gap-2 h-11 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                    role === "recruteur"
                                        ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                                        : "text-default-500 hover:text-default-700 hover:bg-default-200/50"
                                }`}
                            >
                                <Icon icon="lucide:building-2" className="w-[18px] h-[18px]" />
                                Recruteur
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="font-semibold mt-1"
                        isDisabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center gap-1 pt-2 pb-0">
                <p className="text-sm text-default-500">
                    Already have an account?
                </p>
                <Link className="cursor-pointer font-medium text-primary text-sm" onPress={() => setView("login")}>
                    Sign in
                </Link>
            </CardFooter>
        </Card>
    );
}