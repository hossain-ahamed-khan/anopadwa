"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
    name: string;
    role: string;
    avatarUrl: string;
}

export default function Header({ name, role, avatarUrl }: HeaderProps) {
    return (
        <header className="flex items-center justify-end border-b border-gray-100 bg-white px-8 py-4">
            <button className="flex items-center gap-3 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-gray-50">
                <Image
                    src={avatarUrl}
                    alt={name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                />
                <div className="text-left leading-tight">
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
            </button>
        </header>
    );
}