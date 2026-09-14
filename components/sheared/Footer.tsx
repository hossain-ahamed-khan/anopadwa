"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, ChevronUp } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import mainLogo from "@/public/image/anopadwa-logo.png";

const informationLinks = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Safety Tips", href: "/safety-tips" },
    { label: "Disclaimers", href: "/disclaimers" },
    { label: "Sitemap", href: "/sitemap" },
];

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
];

const paymentMethods = ["MasterCard", "PayPal", "Discover", "VISA"];

const socialLinks = [
    { icon: SiFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="w-full bg-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
                    {/* Brand + socials */}
                    <div>
                        <Image
                            src={mainLogo}
                            alt="Anopadwa"
                            className="object-contain mb-4"
                            width={160}
                            height={40}
                        />
                        <p className="text-sm text-neutral-400 leading-relaxed mb-5">
                            Post Your Item on Ghana&apos;s #1 Free Classifieds Marketplace — Reach
                            Thousands of Buyers Across Ghana.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 hover:bg-emerald-600 hover:text-white transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Information</h3>
                        <div className="w-8 h-0.5 bg-emerald-600 mb-4" />
                        <ul className="space-y-2.5">
                            {informationLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-neutral-400 hover:text-emerald-500 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Quick links</h3>
                        <div className="w-8 h-0.5 bg-emerald-600 mb-4" />
                        <ul className="space-y-2.5">
                            {quickLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-neutral-400 hover:text-emerald-500 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Contact info</h3>
                        <div className="w-8 h-0.5 bg-emerald-600 mb-4" />
                        <ul className="space-y-2.5">
                            <li className="flex items-center gap-2 text-sm text-neutral-400">
                                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                                Business Address
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-400">
                                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                                <a
                                    href="mailto:info@anopadwa.com"
                                    className="hover:text-emerald-500 transition-colors"
                                >
                                    info@anopadwa.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-400">
                                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                                Business Phone
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-neutral-500 text-center sm:text-left">
                        © Copyright Anopadwa.com {new Date().getFullYear()}. Designed and
                        Developed by Webspoel Agency
                    </p>

                    <div className="flex items-center gap-3">
                        {paymentMethods.map((method) => (
                            <span
                                key={method}
                                className="rounded-md bg-neutral-800 text-neutral-300 text-xs font-medium px-3 py-1.5"
                            >
                                {method}
                            </span>
                        ))}
                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronUp className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}