"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import mainLogo from "@/public/image/anopadwa-logo.png";
import varifyImage from "@/public/image/varify-image.png";

const OTP_LENGTH = 6;
const OTP_DURATION_SECONDS = 22;

export default function VerifyEmailPage({ email }: { email: string }) {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION_SECONDS);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleResend = async () => {
        setSecondsLeft(OTP_DURATION_SECONDS);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        // Wire this up to your RTK Query mutation, e.g.:
        // await resendVerificationCode({ email }).unwrap();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Wire this up to your RTK Query mutation, e.g.:
            // await verifyEmail({ email, code: otp.join("") }).unwrap();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF8EA] flex">
            {/* Left: hero image panel */}
            <div className="hidden lg:block lg:w-[45%] p-6">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-amber-500 to-orange-500">
                    <Image
                        src={varifyImage}
                        alt="verifyEmailImage"
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

                    <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-3">
                        Enter Emailed Verification Code
                    </h1>

                    <p className="text-sm text-center text-neutral-500 mb-6">
                        We&apos;ve sent a verification code (OTP) to your email{" "}
                        <span className="font-semibold text-neutral-700">{email}</span>. Please
                        check your inbox and enter the code below.
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
                                    onClick={handleResend}
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
                </div>
            </div>
        </div>
    );
}