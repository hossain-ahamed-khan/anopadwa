"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import mainLogo from "@/public/image/anopadwa-logo.png";
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/redux/features/auth/authSlice";
import { useLoginMutation } from "@/redux/features/auth/authApi";

export default function SignInPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loginUser, { isLoading }] = useLoginMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await loginUser({ email: email.trim(), password }).unwrap();
            const { user, accessToken, refreshToken } = response.data;

            dispatch(login({ user, token: accessToken, refreshToken }));
            toast.success("Logged in successfully");
            router.replace("/buyer");
        } catch (error) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "data" in error &&
                    typeof error.data === "object" &&
                    error.data !== null &&
                    "message" in error.data &&
                    typeof error.data.message === "string"
                    ? error.data.message
                    : "Unable to log in. Please check your credentials and try again.";

            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-[343px] flex flex-col items-center">
                {/* Logo */}
                <Image
                    src={mainLogo}
                    alt="Anopadwa - Wake up to New Opportunities"
                    width={200}
                    height={50}
                    priority
                    className="h-auto w-[200px] object-contain"
                />

                {/* Heading */}
                <h1 className="mt-10 text-3xl font-semibold text-neutral-800 text-center">
                    Login to Account
                </h1>
                <p className="mt-4 text-sm text-neutral-800 text-center">
                    Please enter your email and password to continue
                </p>

                <form onSubmit={handleSubmit} className="mt-12 w-full">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs text-neutral-800 mb-2"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="esteban_schiller@gmail.com"
                            autoComplete="email"
                            required
                            className="w-full h-[35px] rounded-[3px] border border-neutral-200 bg-[#FEFDFA] px-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        />
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label
                            htmlFor="password"
                            className="block text-xs text-neutral-800 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*********"
                                autoComplete="current-password"
                                required
                                className="w-full h-[35px] rounded-[3px] border border-neutral-200 bg-[#FEFDFA] px-3 pr-10 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
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

                    {/* Remember / Forgot */}
                    <div className="mt-3 flex items-center justify-between text-xs text-neutral-800">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberPassword}
                                onChange={(e) => setRememberPassword(e.target.checked)}
                                className="h-3.5 w-3.5 rounded-[2px] border-neutral-300 accent-amber-400 cursor-pointer"
                            />
                            Remember Password
                        </label>
                        <Link
                            href="/forget-password"
                            className="hover:text-amber-600 transition-colors"
                        >
                            Forget Password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-9 w-full h-[35px] rounded-[3px] bg-[#FCB61A] hover:bg-[#EBA70F] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs transition-colors cursor-pointer"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}