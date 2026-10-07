"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, User, X } from "lucide-react";
import mainLogo from "@/public/image/anopadwa-logo.png";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/features/auth/authSlice";
import {
    SellerType,
    useBecomeSellerMutation,
} from "@/redux/features/becomeSeller/becomeSeller";
import { useGetMyProfileApiQuery } from "@/redux/features/buyer/myAccount";

type SellerStep = "type" | "store";

export default function Navbar() {
    const router = useRouter();
    const isAuthenticated = Boolean(useAppSelector(selectToken));
    const { data: profile, isLoading: isProfileLoading } =
        useGetMyProfileApiQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [becomeSeller, { isLoading, error }] = useBecomeSellerMutation();
    const [hasBecomeSeller, setHasBecomeSeller] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState<SellerStep>("type");
    const [sellerType, setSellerType] = useState<SellerType | null>(null);
    const [storeName, setStoreName] = useState("");

    const openSellerFlow = () => {
        if (isProfileLoading) {
            return;
        }

        const alreadySeller =
            hasBecomeSeller ||
            profile?.isSeller === true ||
            (profile?.sellerProfile !== null &&
                profile?.sellerProfile !== undefined);

        if (alreadySeller) {
            router.push("/seller");
            return;
        }

        setStep("type");
        setSellerType(null);
        setStoreName("");
        setIsModalOpen(true);
    };

    const closeSellerFlow = () => {
        if (!isLoading) {
            setIsModalOpen(false);
        }
    };

    const submitSellerProfile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!sellerType || !storeName.trim()) return;

        try {
            await becomeSeller({
                sellerType,
                storeName: storeName.trim(),
            }).unwrap();
            setHasBecomeSeller(true);
            setIsModalOpen(false);
            router.push("/seller");
        } catch {
            // The mutation error is rendered below the form.
        }
    };

    return (
        <>
            <header className="w-full bg-white border-b border-emerald-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/buyer" className="flex items-center shrink-0">
                        <Image
                            src={mainLogo}
                            alt="Anopadwa"
                            className="object-contain"
                            width={160}
                            height={40}
                            priority
                        />
                    </Link>

                    <nav className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <button
                                    type="button"
                                    onClick={openSellerFlow}
                                    disabled={isProfileLoading}
                                    className="px-4 py-1 rounded-2xl border border-[#1B6B44] text-[#1B6B44] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#1B6B44] hover:text-white hover:shadow-[0_6px_16px_rgba(27,107,68,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B44] focus-visible:ring-offset-2"
                                >
                                    Switch to Seller
                                </button>
                                <Link
                                    href="/buyer/chat"
                                    className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-amber-600 transition-colors"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Chat
                                </Link>
                                <Link
                                    href="/buyer/account"
                                    className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-amber-600 transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    My Account
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm text-neutral-600 hover:text-amber-600 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/sign-up" className="rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2 transition-colors">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="become-seller-title"
                >
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 id="become-seller-title" className="text-xl font-semibold text-neutral-900">
                                Become a seller
                            </h2>
                            <button type="button" onClick={closeSellerFlow} disabled={isLoading} aria-label="Close">
                                <X className="h-5 w-5 text-neutral-500" />
                            </button>
                        </div>

                        {step === "type" ? (
                            <div className="mt-6 space-y-3">
                                <p className="text-sm text-neutral-600">Choose the type of seller account you want to create.</p>
                                {([
                                    ["individual", "Become an individual seller"],
                                    ["business", "Become a business seller"],
                                ] as const).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setSellerType(value);
                                            setStep("store");
                                        }}
                                        className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-left font-medium text-neutral-800 hover:border-[#1B6B44] hover:bg-emerald-50"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={submitSellerProfile} className="mt-6 space-y-4">
                                <p className="text-sm text-neutral-600">
                                    {sellerType === "individual" ? "Individual" : "Business"} seller
                                </p>
                                <label htmlFor="store-name" className="block text-sm font-medium text-neutral-700">
                                    Store name
                                </label>
                                <input
                                    id="store-name"
                                    value={storeName}
                                    onChange={(event) => setStoreName(event.target.value)}
                                    placeholder="Kofi Deals"
                                    required
                                    maxLength={100}
                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-[#1B6B44] focus:ring-2 focus:ring-emerald-100"
                                />
                                {error && <p className="text-sm text-red-600">We could not create your seller profile. Please try again.</p>}
                                <div className="flex justify-between gap-3">
                                    <button type="button" onClick={() => setStep("type")} disabled={isLoading} className="rounded-lg px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
                                        Back
                                    </button>
                                    <button type="submit" disabled={isLoading || !storeName.trim()} className="rounded-lg bg-[#1B6B44] px-4 py-2 text-sm font-semibold text-white hover:bg-[#155536] disabled:cursor-not-allowed disabled:opacity-50">
                                        {isLoading ? "Creating..." : "Continue"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
