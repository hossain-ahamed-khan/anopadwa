"use client";

import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSlice";
import { useGetSellerAccountQuery } from "@/redux/features/seller/account/sellerAccountApi";

type BusinessDetail = {
    label: string;
    value: string;
};

export default function AccountDetailsView() {
    const user = useAppSelector(selectUser);
    const { data: seller, isLoading, isError, refetch } = useGetSellerAccountQuery();

    if (isLoading) {
        return (
            <section className="space-y-5">
                {Array.from({ length: 3 }, (_, index) => (
                    <div
                        key={index}
                        className="h-40 animate-pulse rounded-xl bg-white shadow-sm"
                    />
                ))}
            </section>
        );
    }

    if (isError || !seller) {
        return (
            <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">
                    Unable to load account details
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Please try again to load your seller profile.
                </p>
                <button
                    type="button"
                    onClick={() => void refetch()}
                    className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                    Try again
                </button>
            </section>
        );
    }

    const businessDetails: BusinessDetail[] = [
        { label: "Business Type", value: seller.businessType || "Not provided" },
        { label: "Customers Served", value: seller.customersServed || "Not provided" },
        { label: "Response Time", value: seller.responseTime || "Not provided" },
    ];

    return (
        <section className="space-y-5">
            {/* Profile card */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-emerald-500 bg-emerald-50">
                        {seller.businessLogoUrl ? (
                            <Image
                                src={seller.businessLogoUrl}
                                alt={`${seller.storeName} logo`}
                                fill
                                sizes="112px"
                                className="object-contain"
                            />
                        ) : (
                            <span className="text-3xl font-bold text-emerald-700">
                                {seller.storeName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-900">{seller.storeName}</h1>

                        <div className="mt-3 border-t border-slate-100 pt-3">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                                <span className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                        <Phone className="h-3.5 w-3.5" />
                                    </span>
                                    {user?.phone || "Phone not provided"}
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                        <Mail className="h-3.5 w-3.5" />
                                    </span>
                                    {user?.email || "Email not provided"}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                    <MapPin className="h-3.5 w-3.5" />
                                </span>
                                {seller.addressLine || "Address not provided"}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">About {seller.storeName}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {seller.about || "This seller has not added an about description yet."}
                </p>
            </div>

            {/* Business details */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">Business Details</h2>
                <div className="mt-3 divide-y divide-slate-100">
                    {businessDetails.map((detail) => (
                        <div
                            key={detail.label}
                            className="flex items-center justify-between py-3 text-sm"
                        >
                            <span className="text-slate-400">{detail.label}</span>
                            <span className="font-medium text-slate-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}