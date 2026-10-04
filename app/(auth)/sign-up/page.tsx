"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import mainLogo from "@/public/image/anopadwa-logo.png";
import signUpImage from "@/public/image/signup-image.png";
import {
    useRegisterMutation,
    useVerifyOtpMutation,
} from "@/redux/features/register/registerApi";

const OTP_LENGTH = 6;

type Step = "details" | "otp";

function getErrorMessage(error: unknown, fallback: string) {
    if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
    ) {
        return error.data.message;
    }

    return fallback;
}

export default function SignUpPage() {
    const router = useRouter();
    const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [step, setStep] = useState<Step>("details");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [destination, setDestination] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(true);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (!agreeToTerms) {
            toast.error("Please agree to the Terms & Conditions and Privacy Policy.");
            return;
        }

        try {
            const response = await registerUser({
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password,
            }).unwrap();

            setDestination(response.data.otp.destination);
            setStep("otp");
            toast.success(response.data.otp.message || "Verification code sent.");
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to create your account. Please try again."));
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const nextOtp = [...otp];
        nextOtp[index] = digit;
        setOtp(nextOtp);

        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;

        e.preventDefault();
        const nextOtp = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((digit, index) => {
            nextOtp[index] = digit;
        });
        setOtp(nextOtp);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await verifyOtp({
                destination,
                code: otp.join(""),
                purpose: "registration",
            }).unwrap();
            toast.success("Your account has been verified successfully.");
            router.replace("/login");
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to verify the code. Please try again."));
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF8EA] flex">
            <div className="hidden lg:block lg:w-[45%] p-6">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-neutral-700 to-neutral-900">
                    <Image
                        src={signUpImage}
                        alt="Sign up"
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 0px, 45vw"
                    />
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-1.5 mb-6">
                        <Image src={mainLogo} alt="Anopadwa" className="object-cover" width={240} height={60} />
                    </div>

                    {step === "details" ? (
                        <>
                            <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-6">
                                Create your free account
                            </h1>
                            <form onSubmit={handleRegister} className="space-y-4 w-full">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                        className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-800 mb-1.5">
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
                                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. +233241234568"
                                        required
                                        className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                    />
                                </div>

                                <PasswordField
                                    id="password"
                                    label="Password"
                                    value={password}
                                    onChange={setPassword}
                                    visible={showPassword}
                                    onToggle={() => setShowPassword((visible) => !visible)}
                                    placeholder="Enter your password"
                                />
                                <PasswordField
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    visible={showConfirmPassword}
                                    onToggle={() => setShowConfirmPassword((visible) => !visible)}
                                    placeholder="Enter your password again"
                                />

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
                                        <Link href="/terms" className="text-neutral-700 hover:text-amber-600 font-medium">Terms & Conditions</Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-neutral-700 hover:text-amber-600 font-medium">Privacy Policy</Link>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isRegistering}
                                    className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 text-sm transition-colors mt-2 cursor-pointer"
                                >
                                    {isRegistering ? "Creating..." : "Sign Up"}
                                </button>
                            </form>
                            <p className="text-sm text-center text-neutral-500 mt-6">
                                Already have an account?{" "}
                                <Link href="/login" className="text-neutral-800 font-semibold hover:text-amber-600">Sign In</Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-3">
                                Enter Verification Code
                            </h1>
                            <p className="text-sm text-center text-neutral-500 mb-6">
                                We&apos;ve sent a verification code to{" "}
                                <span className="font-semibold text-neutral-700">{destination}</span>.
                            </p>
                            <form onSubmit={handleVerify} className="w-full">
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(element) => { inputRefs.current[index] = element; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={handleOtpPaste}
                                            placeholder="-"
                                            aria-label={`Verification digit ${index + 1}`}
                                            className="w-11 h-11 rounded-md border border-neutral-200 bg-white text-center text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isVerifying || otp.some((digit) => !digit)}
                                    className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-900 font-semibold py-3 text-sm transition-colors cursor-pointer"
                                >
                                    {isVerifying ? "Verifying..." : "Verify Account"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function PasswordField({
    id,
    label,
    value,
    onChange,
    visible,
    onToggle,
    placeholder,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    visible: boolean;
    onToggle: () => void;
    placeholder: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-neutral-800 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required
                    className="w-full rounded-md border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                    aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
}
