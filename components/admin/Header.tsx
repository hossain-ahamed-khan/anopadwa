"use client";

import { ChevronDown } from "lucide-react";
import { useAdminMeQuery } from "@/redux/features/auth/authApi";

export default function Header() {
    const { data, isLoading } = useAdminMeQuery();
    const admin = data?.data.admin;
    const name = admin?.name ?? (isLoading ? "Loading..." : "Admin");
    const role = admin?.role ?? "";
    const initials = name.slice(0, 2).toUpperCase();

    return (
        <header className="flex items-center justify-end border-b border-gray-100 bg-white px-8 py-4">
            <button className="flex items-center gap-3 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-gray-50">
                <span
                    aria-label={`${name} avatar`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5A623] text-sm font-semibold text-[#1C1C1E]"
                >
                    {initials}
                </span>
                <div className="text-left leading-tight">
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
            </button>
        </header>
    );
}