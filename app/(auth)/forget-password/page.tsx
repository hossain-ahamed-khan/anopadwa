"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import mainLogo from "@/public/image/anopadwa-logo.png";
import forgotPasswordImage from "@/public/image/forgot-password-image.png";
import resetImage from "@/public/image/reset-image.png";
import varifyImage from "@/public/image/varify-image.png";
import type { StaticImageData } from "next/image";

type Step = "request" | "otp" | "reset";

const OTP_LENGTH = 6;
const OTP_DURATION_SECONDS = 22;

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>("request");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stepImage: Record<Step, StaticImageData> = {
        request: forgotPasswordImage,
        otp: varifyImage,
        reset: resetImage,
    };

    return (
        <div className="min-h-screen bg-[#FEF8EA] flex">
            {/* Left: hero image panel */}
            <div className="hidden lg:block lg:w-[45%] p-6">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-pink-300 to-pink-400">
                    <Image
                        src={stepImage[step]}
                        alt="forgotPasswordImage"
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

                    {step === "request" && (
                        <RequestResetStep
                            email={email}
                            setEmail={setEmail}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting}
                            onSuccess={() => setStep("otp")}
                        />
                    )}

                    {step === "otp" && (
                        <OtpStep
                            email={email}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting}
                            onSuccess={() => setStep("reset")}
                        />
                    )}

                    {step === "reset" && (
                        <NewPasswordStep
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Step 1: Request reset link                                        */
/* ---------------------------------------------------------------- */

function RequestResetStep({
    email,
    setEmail,
    isSubmitting,
    setIsSubmitting,
    onSuccess,
}: {
    email: string;
    setEmail: (value: string) => void;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    onSuccess: () => void;
}) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Wire this up to your RTK Query mutation, e.g.:
            // await requestPasswordReset({ email }).unwrap();
            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-6">
                Reset your password
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
                        placeholder="Email address"
                        required
                        className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 text-sm transition-colors mt-2 cursor-pointer"
                >
                    {isSubmitting ? "Sending..." : "Reset Password"}
                </button>
            </form>
        </>
    );
}

/* ---------------------------------------------------------------- */
/* Step 2: Enter emailed verification code                           */
/* ---------------------------------------------------------------- */

function OtpStep({
    email,
    isSubmitting,
    setIsSubmitting,
    onSuccess,
}: {
    email: string;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    onSuccess: () => void;
}) {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION_SECONDS);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);

        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((char, i) => {
            next[i] = char;
        });
        setOtp(next);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Wire this up to your RTK Query mutation, e.g.:
            // await verifyOtp({ email, code: otp.join("") }).unwrap();
            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-3">
                Enter Emailed Verification Code
            </h1>

            <p className="text-sm text-center text-neutral-500 mb-6">
                We&apos;ve sent a verification code (OTP) to your email{" "}
                <span className="font-semibold text-neutral-700">{email || "your email"}</span>.
                Please check your inbox and enter the code below.
            </p>

            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex items-center justify-center gap-2 mb-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            placeholder="-"
                            className="w-11 h-11 rounded-md border border-neutral-200 bg-white text-center text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        />
                    ))}
                </div>

                <p className="text-sm text-center text-neutral-500 mb-6">
                    {secondsLeft > 0 ? (
                        <>Code expires in {formatTime(secondsLeft)}</>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setSecondsLeft(OTP_DURATION_SECONDS)}
                            className="text-amber-600 font-semibold hover:text-amber-700 cursor-pointer"
                        >
                            Resend code
                        </button>
                    )}
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting || otp.some((digit) => !digit)}
                    className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 text-sm transition-colors cursor-pointer"
                >
                    {isSubmitting ? "Verifying..." : "Sign Up"}
                </button>
            </form>
        </>
    );
}

/* ---------------------------------------------------------------- */
/* Step 3: Enter new password                                        */
/* ---------------------------------------------------------------- */

function NewPasswordStep({
    isSubmitting,
    setIsSubmitting,
}: {
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
}) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Wire this up to your RTK Query mutation, e.g.:
            // await updatePassword({ password }).unwrap();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-6">
                Enter new password
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
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

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 text-sm transition-colors mt-2 cursor-pointer"
                >
                    {isSubmitting ? "Updating..." : "Update Password"}
                </button>
            </form>
        </>
    );
}