"use client";

import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";

interface SubscriptionPackage {
    id: string;
    packageName: string;
    packagePrice: string;
    discount: string;
    promotedListing: string;
    featuredListing: string;
    topListing: string;
    features: string[];
}

const createEmptyPackage = (id: string): SubscriptionPackage => ({
    id,
    packageName: "",
    packagePrice: "",
    discount: "",
    promotedListing: "",
    featuredListing: "",
    topListing: "",
    features: [],
});

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="mb-1.5 block text-sm font-semibold text-gray-800">{children}</label>;
}

function TextInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg bg-blue-50/60 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
    );
}

export default function SubscriptionManagement() {
    const [isEnabled, setIsEnabled] = useState(true);
    const [packages, setPackages] = useState<SubscriptionPackage[]>([
        { ...createEmptyPackage("1"), features: ["Sekondi-Takoradi Metropolitan"] },
    ]);
    const [featureDrafts, setFeatureDrafts] = useState<Record<string, string>>({});

    const updatePackage = (
        id: string,
        field: keyof Omit<SubscriptionPackage, "features" | "id">,
        value: string
    ) => {
        setPackages((prev) =>
            prev.map((pkg) => (pkg.id === id ? { ...pkg, [field]: value } : pkg))
        );
    };

    const handleDeletePackage = (id: string) => {
        setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    };

    const handleAddPackage = () => {
        setPackages((prev) => [...prev, createEmptyPackage(`pkg-${Date.now()}`)]);
    };

    const handleFeatureDraftChange = (packageId: string, value: string) => {
        setFeatureDrafts((prev) => ({ ...prev, [packageId]: value }));
    };

    const handleAddFeature = (packageId: string) => {
        const value = featureDrafts[packageId]?.trim();
        if (!value) return;
        setPackages((prev) =>
            prev.map((pkg) =>
                pkg.id === packageId ? { ...pkg, features: [...pkg.features, value] } : pkg
            )
        );
        setFeatureDrafts((prev) => ({ ...prev, [packageId]: "" }));
    };

    const handleDeleteFeature = (packageId: string, index: number) => {
        setPackages((prev) =>
            prev.map((pkg) =>
                pkg.id === packageId
                    ? { ...pkg, features: pkg.features.filter((_, i) => i !== index) }
                    : pkg
            )
        );
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            {/* Header with toggle */}
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">Subscription Management</h2>
                <button
                    onClick={() => setIsEnabled((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${isEnabled ? "bg-amber-500" : "bg-gray-300"
                        }`}
                    aria-pressed={isEnabled}
                    aria-label="Toggle subscription management"
                >
                    <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isEnabled ? "translate-x-5" : "translate-x-0.5"
                            }`}
                    />
                </button>
            </div>

            <div className="space-y-4">
                {packages.map((pkg, index) => (
                    <div key={pkg.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                        {/* Package header */}
                        <div className="flex items-center justify-between px-6 pt-5">
                            <h3 className="text-sm font-semibold text-gray-900">Package {index + 1}</h3>
                            <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <FieldLabel>Package Name</FieldLabel>
                                    <TextInput
                                        value={pkg.packageName}
                                        onChange={(v) => updatePackage(pkg.id, "packageName", v)}
                                        placeholder="Enter package name here"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Package Price</FieldLabel>
                                    <TextInput
                                        value={pkg.packagePrice}
                                        onChange={(v) => updatePackage(pkg.id, "packagePrice", v)}
                                        placeholder="Enter package price"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Discount</FieldLabel>
                                    <TextInput
                                        value={pkg.discount}
                                        onChange={(v) => updatePackage(pkg.id, "discount", v)}
                                        placeholder="Enter discount percentage"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Promoted Listing</FieldLabel>
                                    <TextInput
                                        value={pkg.promotedListing}
                                        onChange={(v) => updatePackage(pkg.id, "promotedListing", v)}
                                        placeholder="Enter promoted listing duration"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Featured Listing</FieldLabel>
                                    <TextInput
                                        value={pkg.featuredListing}
                                        onChange={(v) => updatePackage(pkg.id, "featuredListing", v)}
                                        placeholder="Enter featured listing duration"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Top Listing</FieldLabel>
                                    <TextInput
                                        value={pkg.topListing}
                                        onChange={(v) => updatePackage(pkg.id, "topListing", v)}
                                        placeholder="Enter top listing duration"
                                    />
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mt-6">
                                <h4 className="mb-3 text-sm font-semibold text-gray-800">Features</h4>

                                <div className="space-y-2.5">
                                    {pkg.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700">
                                                {idx + 1}. {feature}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteFeature(pkg.id, idx)}
                                                className="text-red-500 transition hover:text-red-600"
                                                aria-label="Delete feature"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={featureDrafts[pkg.id] ?? ""}
                                        onChange={(e) => handleFeatureDraftChange(pkg.id, e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddFeature(pkg.id)}
                                        placeholder="Enter feature name"
                                        className="w-full rounded-md border border-dashed border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleAddFeature(pkg.id)}
                                        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add New Features
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add new subscription package */}
            <button
                onClick={handleAddPackage}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
                <Plus className="h-4 w-4" />
                Add New Subscription
            </button>
        </div>
    );
}