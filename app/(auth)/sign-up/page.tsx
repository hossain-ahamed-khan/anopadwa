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
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Wire this up to your RTK Query register mutation, e.g.:
            // await register({ email, password }).unwrap();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF8EA] flex">
            {/* Left: hero image panel */}
            <div className="hidden lg:block lg:w-[45%] p-6">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-neutral-700 to-neutral-900">
                    <Image
                        src={signUpImage}
                        alt="signUpImage"
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
                        Create your free account
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

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-semibold text-neutral-800 mb-1.5"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Enter your password again"
                                    required
                                    className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-1.5 text-sm pt-0.5">
                            <input
                                id="agreeToTerms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="h-3.5 w-3.5 mt-0.5 rounded border-neutral-300 text-amber-500 focus:ring-amber-400 cursor-pointer shrink-0"
                            />
                            <label htmlFor="agreeToTerms" className="text-neutral-500 cursor-pointer">
                                By continuing, I agree to the{" "}
                                <Link href="/terms" className="text-neutral-700 hover:text-amber-600 font-medium">
                                    Terms & Conditions
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-neutral-700 hover:text-amber-600 font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 text-sm transition-colors mt-2 cursor-pointer"
                        >
                            {isSubmitting ? "Creating..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-sm text-center text-neutral-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-neutral-800 font-semibold hover:text-amber-600"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}