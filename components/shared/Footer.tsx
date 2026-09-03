"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa";

const HELP_LINKS = [
    { label: "Your Orders", href: "/orders" },
    { label: "Returns & Replacements", href: "/returns" },
    { label: "Shipping Rates & Policies", href: "/shipping-policy" },
    { label: "Refund and Returns Policy", href: "/refund-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Cookie Settings", href: "/cookie-settings" },
    { label: "Help Center", href: "/help-center" },
];

const SELLER_LINKS = [
    { label: "Become an Affilate", href: "/affiliate" },
    { label: "Advertise Your Products", href: "/advertise" },
    { label: "Sell/Publish with Us", href: "/sell-with-us" },
    { label: "Become an Blowwe Vendor", href: "/become-a-vendor" },
];

const PAYMENT_LOGOS = [
    { name: "bKash", src: "/payments/bkash.svg" },
    { name: "Nagad", src: "/payments/nagad.svg" },
    { name: "Rocket", src: "/payments/rocket.svg" },
    { name: "Payoneer", src: "/payments/payoneer.svg" },
    { name: "PayPal", src: "/payments/paypal.svg" },
    { name: "Upay", src: "/payments/upay.svg" },
    { name: "Apple Pay", src: "/payments/apple-pay.svg" },
    { name: "Mastercard", src: "/payments/mastercard.svg" },
    { name: "Visa", src: "/payments/visa.svg" },
    { name: "PayPal", src: "/payments/paypal-2.svg" },
];

const SOCIAL_LINKS = [
    { label: "Facebook", href: "#", icon: FaFacebook, className: "text-[#5B5FE9]" },
    { label: "X", href: "#", icon: null, className: "" },
    { label: "Instagram", href: "#", icon: FaInstagram, className: "text-[#E1306C]" },
    { label: "LinkedIn", href: "#", icon: FaLinkedin, className: "text-[#5B5FE9]" },
];

function XIcon() {
    return (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="white" aria-hidden="true">
                <path d="M18.244 2H21.5l-7.5 8.57L22.75 22h-6.85l-5.36-6.66L4.4 22H1.14l8.03-9.18L1.5 2h7.02l4.84 6.09L18.244 2Zm-1.2 18h1.9L7.03 4h-1.98l11.99 16Z" />
            </svg>
        </span>
    );
}

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Newsletter */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Join our newsletter</h3>
                        <p className="mt-1 max-w-sm text-sm text-gray-500">
                            Register now to get latest updates on promotions & coupons. Don&apos;t
                            worry, we not spam!
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-1.5 md:items-end">
                        <form className="flex w-full max-w-md">
                            <div className="relative flex-1">
                                <Mail
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full rounded-l-md border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#5B5FE9]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="shrink-0 rounded-r-md bg-[#5B5FE9] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#4a4fd6]"
                            >
                                SEND
                            </button>
                        </form>
                        <p className="text-xs text-gray-400">
                            By subscribing you agree to our{" "}
                            <Link href="/terms" className="text-[#5B5FE9] hover:underline">
                                Terms & Conditions and Privacy & Cookies Policy.
                            </Link>
                        </p>
                    </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Link columns */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Do you need help */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Do You Need Help ?</h4>
                        <p className="mt-3 max-w-[220px] text-sm text-gray-500">
                            You can contact with us. We will Give you proper solution.
                        </p>

                        <div className="mt-5 flex items-start gap-3">
                            <Phone size={20} className="mt-0.5 shrink-0 text-gray-700" />
                            <div>
                                <p className="text-xs text-gray-400">Saturday - Thursday : 10am-11pm</p>
                                <p className="text-sm font-bold text-gray-900">09638566693</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-3">
                            <Mail size={20} className="mt-0.5 shrink-0 text-gray-700" />
                            <div>
                                <p className="text-xs text-gray-400">Need help with your order?</p>
                                <p className="text-sm font-bold text-gray-900">storenetbd@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Make money with us */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Make Money with Us</h4>
                        <ul className="mt-3 flex flex-col gap-2.5">
                            {SELLER_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 transition-colors hover:text-[#5B5FE9]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Let us help you */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Let Us Help You</h4>
                        <ul className="mt-3 flex flex-col gap-2.5">
                            {HELP_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 transition-colors hover:text-[#5B5FE9]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Download app */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Download our app</h4>

                        <div className="mt-3 flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <a
                                    href="#"
                                    className="flex items-center gap-2 rounded-md bg-black px-3 py-1.5"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M3 3.5v17a.5.5 0 0 0 .8.4l12-8.5-12-8.9a.5.5 0 0 0-.8.5Z"
                                            fill="#00E1FF"
                                        />
                                        <path d="M16.6 12.4 20 10l-3.4-2.4-3 2.4 3 2.4Z" fill="#FFD800" />
                                        <path d="M3.8 20.9 16.6 12.4l-3-2.4L3.3 20.4c.1.3.3.4.5.5Z" fill="#FF3D57" />
                                        <path d="M3.3 3.6 13.6 10l3-2.4L3.8 3.1a.5.5 0 0 0-.5.5Z" fill="#00E676" />
                                    </svg>
                                    <span className="leading-none text-white">
                                        <span className="block text-[9px] text-gray-300">GET IT ON</span>
                                        <span className="block text-xs font-bold">Google Play</span>
                                    </span>
                                </a>
                                <div className="text-xs text-gray-500">
                                    Download App Get
                                    <br />
                                    -10% Discount
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href="#"
                                    className="flex items-center gap-2 rounded-md bg-black px-3 py-1.5"
                                >
                                    <svg width="16" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M16.365 1.43c0 1.14-.462 2.06-1.045 2.72-.63.72-1.66 1.27-2.57 1.2-.12-1.1.46-2.24 1.03-2.9.63-.73 1.7-1.28 2.585-1.02ZM20.6 17.02c-.36.82-.53 1.19-1 1.9-.65 1-1.57 2.24-2.7 2.25-1 .01-1.26-.65-2.62-.64-1.37.01-1.65.66-2.65.65-1.13-.01-2-1.14-2.65-2.14-1.82-2.78-2-6.04-.88-7.78.79-1.24 2.05-1.97 3.24-1.97 1.2 0 1.96.66 2.95.66.96 0 1.55-.66 2.95-.66 1.05 0 2.17.57 2.96 1.56-2.6 1.42-2.18 5.15.4 6.23Z" />
                                    </svg>
                                    <span className="leading-none text-white">
                                        <span className="block text-[9px] text-gray-300">Download on the</span>
                                        <span className="block text-xs font-bold">App Store</span>
                                    </span>
                                </a>
                                <div className="text-xs text-gray-500">
                                    Download App Get
                                    <br />
                                    -20% Discount
                                </div>
                            </div>
                        </div>

                        <p className="mt-5 text-sm text-gray-700">Follow us on social media:</p>
                        <div className="mt-2 flex items-center gap-3">
                            {SOCIAL_LINKS.map((social) =>
                                social.icon ? (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className={`transition-opacity hover:opacity-70 ${social.className}`}
                                    >
                                        <social.icon size={20} fill="currentColor" />
                                    </a>
                                ) : (
                                    <a key={social.label} href={social.href} aria-label={social.label}>
                                        <XIcon />
                                    </a>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Bottom bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                        Copyright 2024 © All right reserved. Powered by{" "}
                        <Link href="/" className="text-[#5B5FE9] hover:underline">
                            STORENETBD.
                        </Link>
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        {PAYMENT_LOGOS.map((logo, idx) => (
                            <Image
                                key={`${logo.name}-${idx}`}
                                src={logo.src}
                                alt={logo.name}
                                width={40}
                                height={20}
                                className="h-5 w-auto object-contain"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}