"use client";

import Link from "next/link";
import Image from "next/image";
import mainLogo from "@/public/image/anopadwa-logo.png";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    ListChecks,
    Layers,
    MapPin,
    Target,
    MonitorPlay,
    ScanFace,
    Settings,
} from "lucide-react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Administrators", href: "/admin/administrators", icon: ShieldCheck },
    { label: "Review Listing", href: "/admin/reviews", icon: ListChecks },
    { label: "Category Management", href: "/admin/categories", icon: Layers },
    { label: "Location Management", href: "/admin/locations", icon: MapPin },
    { label: "Promotion Type", href: "/admin/promotions", icon: Target },
    { label: "Subscription Model", href: "/admin/subscriptions", icon: MonitorPlay },
    { label: "Fraud Detection", href: "/admin/fraud-detection", icon: ScanFace },
    { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

/**
 * A nav item is active if the current path matches it exactly, or sits
 * inside it (e.g. `/admin/users/42` stays on "User Management"). Matching
 * on a `/` boundary stops `/admin/users` from also lighting up for
 * `/admin/users-export` or similar unrelated siblings.
 */
function isRouteActive(pathname: string, href: string) {
    if (href === "/admin") {
        return pathname === "/admin" || pathname === "/admin/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

// Falls back to Dashboard whenever the current path doesn't match any nav
// item yet — e.g. hitting "/" before the other admin routes exist.
const DEFAULT_ACTIVE_HREF = "/admin";

export default function Sidebar() {
    const pathname = usePathname() ?? "";
    const activeHref =
        NAV_ITEMS.find((item) => isRouteActive(pathname, item.href))?.href ??
        DEFAULT_ACTIVE_HREF;

    return (
        <aside className="relative flex h-full w-64 shrink-0 flex-col bg-[#1C1C1E] py-6">
            {/* Logo */}
            <div className="mb-6 px-6">
                <div className="flex items-center gap-2">
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
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 px-3">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const isActive = href === activeHref;
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={`relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${isActive
                                ? "bg-[#F5A623] text-[#1C1C1E]"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {isActive && (
                                <span className="absolute -left-3 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-md bg-[#F5A623]" />
                            )}
                            <Icon size={18} strokeWidth={2} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}