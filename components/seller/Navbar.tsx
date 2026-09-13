"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "Become a Seller", href: "/become-a-seller" },
    { label: "Blog", href: "/blog" },
];

function AnopadwaLogo() {
    return (
        <Link href="/" className="flex items-center gap-2 shrink-0">
            {/* Sun + house mark */}
            <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* sun rays */}
                <g stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="16" y1="2" x2="16" y2="7" />
                    <line x1="6" y1="6" x2="9.5" y2="9.5" />
                    <line x1="2" y1="16" x2="7" y2="16" />
                    <line x1="26" y1="6" x2="22.5" y2="9.5" />
                    <line x1="30" y1="16" x2="25" y2="16" />
                    <line x1="9.5" y1="22.5" x2="7" y2="25" />
                    <line x1="22.5" y1="22.5" x2="25" y2="25" />
                </g>
                <circle cx="16" cy="16" r="7" fill="#F5A623" />
                {/* house silhouette */}
                <g fill="#111827">
                    <path d="M4 40V26L16 17L28 26V40H4Z" />
                    <rect x="10" y="30" width="4" height="10" fill="#F5F5F4" />
                    <rect x="18" y="30" width="4" height="6" fill="#F5F5F4" />
                    <path d="M0 27L16 15L32 27L29.5 30L16 19.5L2.5 30L0 27Z" />
                </g>
            </svg>

            <div className="flex flex-col leading-none">
                <span className="text-2xl font-extrabold tracking-tight">
                    <span className="text-[#F5A623]">Anopa</span>
                    <span className="text-[#1F7A4D]">dwa</span>
                </span>
                <span className="text-[11px] italic text-gray-500 -mt-0.5">
                    Wake up to New Opportunities
                </span>
            </div>
        </Link>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="mx-4 mt-4 rounded-3xl bg-gray-50 shadow-sm md:mx-6">
            <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-8">
                <AnopadwaLogo />

                {/* Desktop nav links */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-[#1F7A4D]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop right side: location + join */}
                <div className="hidden items-center gap-3 md:flex">
                    <span className="text-sm font-medium text-gray-800">Location</span>

                    <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-full bg-[#F5A623] px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#e59915]"
                    >
                        All of Ashanti
                        <ChevronDown size={16} strokeWidth={2.5} />
                    </button>

                    <button
                        type="button"
                        className="rounded-full bg-[#F5A623] px-6 py-2 text-sm font-extrabold uppercase tracking-wide text-gray-900 transition-colors hover:bg-[#e59915]"
                    >
                        Join
                    </button>
                </div>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="flex items-center justify-center rounded-full p-2 text-gray-800 md:hidden lg:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile dropdown panel */}
            {mobileOpen && (
                <div className="flex flex-col gap-4 border-t border-gray-200 px-5 pb-5 pt-4 lg:hidden">
                    <nav className="flex flex-col gap-3">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-[#1F7A4D]"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <span className="text-sm font-medium text-gray-800">Location</span>

                        <button
                            type="button"
                            className="flex items-center gap-1.5 rounded-full bg-[#F5A623] px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#e59915]"
                        >
                            All of Ashanti
                            <ChevronDown size={16} strokeWidth={2.5} />
                        </button>

                        <button
                            type="button"
                            className="rounded-full bg-[#F5A623] px-6 py-2 text-sm font-extrabold uppercase tracking-wide text-gray-900 transition-colors hover:bg-[#e59915]"
                        >
                            Join
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}