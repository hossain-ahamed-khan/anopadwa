"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, User } from "lucide-react";
import mainLogo from "@/public/image/anopadwa-logo.png";
// Wire this up to your auth slice/selector, e.g.:
// import { useAppSelector } from "@/store/hooks";
// import { selectIsAuthenticated } from "@/features/auth/authSlice";

export default function Navbar() {
    // Replace with your real auth check, e.g.:
    // const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isAuthenticated = true;

    return (
        <header className="w-full bg-white border-b border-emerald-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
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

                {/* Right actions */}
                <nav className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/seller"
                                className="px-4 py-1 rounded-2xl border border-[#1B6B44] text-[#1B6B44] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#1B6B44] hover:text-white hover:shadow-[0_6px_16px_rgba(27,107,68,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B44] focus-visible:ring-offset-2"
                            >
                                Switch to Seller
                            </Link>
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
                            <Link
                                href="/login"
                                className="text-sm text-neutral-600 hover:text-amber-600 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                className="rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}