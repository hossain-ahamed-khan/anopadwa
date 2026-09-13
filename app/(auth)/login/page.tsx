"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import mainLogo from "@/public/image/anopadwa-logo.png";
import loginImage from "@/public/image/login-image.png";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Wire this up to your RTK Query login mutation, e.g.:
            // await login({ email, password }).unwrap();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF8EA] flex">
            {/* Left: hero image panel */}
            <div className="hidden lg:block lg:w-[45%] p-6">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-pink-300 to-pink-400">
                    <Image
                        src={loginImage}
                        alt="loginImage"
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 0px, 45vw"
                    />
                </div>
            </div>

            {/* Right: form panel */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md flex flex-col justify-center">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-1.5 mb-6">
                        <Image
                            src={mainLogo}
                            alt="mainLogo"
                            className="object-cover"
                            width={240}
                            height={60}
                        />
                    </div>

                    <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-6">
                        Sign in to your account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-neutral-800 mb-1.5"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address here"
                                required
                                className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-neutral-800 mb-1.5"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-0.5">
                            <label className="flex items-center gap-1.5 text-neutral-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberPassword}
                                    onChange={(e) => setRememberPassword(e.target.checked)}
                                    className="h-3.5 w-3.5 rounded border-neutral-300 text-amber-500 focus:ring-amber-400"
                                />
                                Remember Password
                            </label>
                            <Link
                                href="/forget-password"
                                className="text-neutral-500 hover:text-amber-600"
                            >
                                Forget Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 text-sm transition-colors mt-2 cursor-pointer"
                        >
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="text-sm text-center text-neutral-500 mt-6">
                        Don&apos;t have account?{" "}
                        <Link
                            href="/sign-up"
                            className="text-neutral-800 font-semibold hover:text-amber-600"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}