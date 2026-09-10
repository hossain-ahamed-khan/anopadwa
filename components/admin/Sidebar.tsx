"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Gauge,
    Users,
    ShieldCheck,
    ClipboardList,
    Shapes,
    ScanFace,
    Settings,
    type LucideIcon,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: Gauge },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Administrators", href: "/admin/administrators", icon: ShieldCheck },
    { label: "Review Listing", href: "/admin/review-listing", icon: ClipboardList },
    { label: "Category Management", href: "/admin/categories", icon: Shapes },
    { label: "Fraud Detection", href: "/admin/fraud-detection", icon: ScanFace },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-72 flex-col bg-neutral-900 px-5 py-6">
            {/* Logo */}
            <div className="flex items-center gap-2 px-1 mb-8">
                <span className="text-2xl" aria-hidden="true">
                    🌅
                </span>
                <div className="leading-tight">
                    <p className="text-lg font-bold tracking-tight">
                        <span className="text-amber-400">Anopa</span>
                        <span className="text-emerald-500">dwa</span>
                    </p>
                    <p className="text-[9px] font-medium text-neutral-400 tracking-wide -mt-0.5">
                        Wake up to New Opportunities
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;

                    return (
                        <div key={href} className="relative">
                            {isActive && (
                                <span className="absolute -left-5 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-amber-400" />
                            )}
                            <Link
                                href={href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${isActive
                                        ? "bg-amber-400 text-neutral-900"
                                        : "text-neutral-200 hover:bg-neutral-800"
                                    }`}
                            >
                                <Icon className="h-5 w-5" strokeWidth={2} />
                                {label}
                            </Link>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}