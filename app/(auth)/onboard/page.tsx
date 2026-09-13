"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, ShoppingBag, type LucideIcon } from "lucide-react";
import mainLogo from "@/public/image/anopadwa-logo.png";

type Role = "buyer" | "seller";

interface RoleOption {
    id: Role;
    icon: LucideIcon;
    iconColor: string;
    title: string;
    description: string;
}

const roleOptions: RoleOption[] = [
    {
        id: "buyer",
        icon: ShoppingCart,
        iconColor: "text-neutral-500",
        title: "Shop your favorites",
        description:
            "Discover products, place orders, and enjoy a seamless shopping experience.",
    },
    {
        id: "seller",
        icon: ShoppingBag,
        iconColor: "text-pink-500",
        title: "Sell your products",
        description: "List your products, manage orders, and grow your business with ease.",
    },
];

export default function OnboardingPage() {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (!selectedRole) return;
        setIsSubmitting(true);
        try {
            // Wire this up to your RTK Query mutation, e.g.:
            // await setUserRole({ role: selectedRole }).unwrap();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF8EA] flex items-center justify-center p-6">
            <div className="w-full max-w-xl flex flex-col items-center">
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

                <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-1.5">
                    Welcome! What brings you here?
                </h1>
                <p className="text-sm text-center text-neutral-500 mb-6">
                    Choose whether you want to shop or sell.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                    {roleOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedRole === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setSelectedRole(option.id)}
                                className={`text-left rounded-xl border bg-white p-5 transition-colors cursor-pointer focus:outline-none ${isSelected
                                        ? "border-amber-400 ring-2 ring-amber-400"
                                        : "border-neutral-200 hover:border-neutral-300"
                                    }`}
                            >
                                <Icon className={`h-6 w-6 mb-3 ${option.iconColor}`} />
                                <h2 className="text-sm font-semibold text-neutral-900 mb-1.5">
                                    {option.title}
                                </h2>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    {option.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedRole || isSubmitting}
                    className="w-full rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm transition-colors cursor-pointer"
                >
                    {isSubmitting ? "Saving..." : "Next"}
                </button>
            </div>
        </div>
    );
}