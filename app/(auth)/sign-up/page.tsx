"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import mainLogo from "@/public/image/anopadwa-logo.png";
import signUpImage from "@/public/image/signup-image.png";

export default function SignUpPage() {
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
        <div className="min-h-screen bg-[#FEF8EA] flex items-center justify-center p-6">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left: hero image */}
                <div className="relative hidden md:block aspect-4/5 rounded-2xl overflow-hidden bg-linear-to-br from-pink-300 to-pink-400">
                    <Image
                        src={signUpImage}
                        alt="loginImage"
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 0px, 50vw"
                    />
                </div>

                {/* Right: form */}
                <div className="flex flex-col justify-center px-2 md:px-6">
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

                    <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-5">
                        Create your free account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-3.5 w-96 mx-auto">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-semibold text-neutral-800 mb-1"
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
                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-neutral-800 mb-1"
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
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-neutral-400 hover:text-neutral-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-neutral-800 mb-1"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-neutral-400 hover:text-neutral-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                            <label className="flex items-center gap-1.5 text-neutral-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberPassword}
                                    onChange={(e) => setRememberPassword(e.target.checked)}
                                    className="h-3 w-3 rounded border-neutral-300 text-amber-500 focus:ring-amber-400"
                                />
                                By continuing, I agree to the Terms & Conditions and Privacy Policy
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm transition-colors mt-4 cursor-pointer"
                        >
                            {isSubmitting ? "Creating..." : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}