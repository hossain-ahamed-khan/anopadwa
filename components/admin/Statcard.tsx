import Image from "next/image";
import { Check } from "lucide-react";

interface StatCardProps {
    value: string;
    label: string;
    variant: "group" | "new" | "active";
    groupAvatarUrls?: [string, string];
}

export default function StatCard({
    value,
    label,
    variant,
    groupAvatarUrls,
}: StatCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-5">
            <div className="h-9 w-16">
                {variant === "group" && groupAvatarUrls && (
                    <div className="flex -space-x-3">
                        <Image
                            src={groupAvatarUrls[0]}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full border-2 border-gray-50 object-cover"
                        />
                        <Image
                            src={groupAvatarUrls[1]}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full border-2 border-gray-50 object-cover"
                        />
                    </div>
                )}
                {variant === "new" && (
                    <span className="inline-flex h-9 w-9 -rotate-6 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold leading-none text-white">
                        NEW
                    </span>
                )}
                {variant === "active" && (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                        <Check size={18} className="text-emerald-600" strokeWidth={3} />
                    </span>
                )}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}