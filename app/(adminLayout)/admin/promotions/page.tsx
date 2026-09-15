"use client";

import { useState } from "react";
import { Trash2, Plus, ChevronDown } from "lucide-react";

interface PromotionPackage {
    id: string;
    packageName: string;
    promotionDescription: string;
    promotionType: string;
    promotionStatus: string;
    placementType: string;
    placementPosition: string;
    priorityLevel: string;
    pricingModel: string;
    currency: string;
    regularPrice: string;
    promotionPrice: string;
    startDate: string;
    endDate: string;
}

const createEmptyPackage = (id: string): PromotionPackage => ({
    id,
    packageName: "",
    promotionDescription: "",
    promotionType: "",
    promotionStatus: "",
    placementType: "",
    placementPosition: "",
    priorityLevel: "",
    pricingModel: "",
    currency: "",
    regularPrice: "",
    promotionPrice: "",
    startDate: "",
    endDate: "",
});

const PROMOTION_TYPE_OPTIONS = ["Discount", "Featured Listing", "Banner Ad", "Bundle Deal"];
const STATUS_OPTIONS = ["Active", "Scheduled", "Paused", "Expired"];
const PLACEMENT_TYPE_OPTIONS = ["Homepage", "Category Page", "Search Results", "Product Page"];
const PLACEMENT_POSITION_OPTIONS = ["Top", "Middle", "Bottom", "Sidebar"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const PRICING_MODEL_OPTIONS = ["Flat Rate", "Percentage Off", "Per Day", "Per Click"];
const CURRENCY_OPTIONS = ["GHS", "USD", "EUR"];

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

function SelectInput({
    value,
    onChange,
    placeholder,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    options: string[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none rounded-lg bg-blue-50/60 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-200"
            >
                <option value="" disabled hidden>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
    );
}

function DateInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    return (
        <div className="relative">
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none rounded-lg bg-blue-50/60 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-200 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            {!value && (
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {placeholder}
                </span>
            )}
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="mb-3 text-xs font-medium text-gray-400">{children}</p>;
}

export default function PromotionTypeForm() {
    const [packages, setPackages] = useState<PromotionPackage[]>([createEmptyPackage("1")]);

    const updatePackage = (id: string, field: keyof PromotionPackage, value: string) => {
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

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-800">Promotion Type</h2>

            <div className="space-y-4">
                {packages.map((pkg, index) => (
                    <div key={pkg.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                        {/* Package header */}
                        <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
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
                            {/* Create Promotion */}
                            <SectionLabel>Create Promotion</SectionLabel>
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
                                    <FieldLabel>Promotion Description</FieldLabel>
                                    <TextInput
                                        value={pkg.promotionDescription}
                                        onChange={(v) => updatePackage(pkg.id, "promotionDescription", v)}
                                        placeholder="Enter a short description"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Promotion Type</FieldLabel>
                                    <SelectInput
                                        value={pkg.promotionType}
                                        onChange={(v) => updatePackage(pkg.id, "promotionType", v)}
                                        placeholder="Select promotion type"
                                        options={PROMOTION_TYPE_OPTIONS}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Promotion Status</FieldLabel>
                                    <SelectInput
                                        value={pkg.promotionStatus}
                                        onChange={(v) => updatePackage(pkg.id, "promotionStatus", v)}
                                        placeholder="Select status"
                                        options={STATUS_OPTIONS}
                                    />
                                </div>
                            </div>

                            {/* Promotion Placement */}
                            <SectionLabel>
                                <span className="mt-6 block">Promotion Placement</span>
                            </SectionLabel>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <FieldLabel>Placement Type</FieldLabel>
                                    <SelectInput
                                        value={pkg.placementType}
                                        onChange={(v) => updatePackage(pkg.id, "placementType", v)}
                                        placeholder="Select placement"
                                        options={PLACEMENT_TYPE_OPTIONS}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Placement Position</FieldLabel>
                                    <SelectInput
                                        value={pkg.placementPosition}
                                        onChange={(v) => updatePackage(pkg.id, "placementPosition", v)}
                                        placeholder="Select position"
                                        options={PLACEMENT_POSITION_OPTIONS}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Priority Level</FieldLabel>
                                    <SelectInput
                                        value={pkg.priorityLevel}
                                        onChange={(v) => updatePackage(pkg.id, "priorityLevel", v)}
                                        placeholder="Select priority"
                                        options={PRIORITY_OPTIONS}
                                    />
                                </div>
                            </div>

                            {/* Pricing */}
                            <SectionLabel>
                                <span className="mt-6 block">Pricing</span>
                            </SectionLabel>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <FieldLabel>Pricing Model</FieldLabel>
                                    <SelectInput
                                        value={pkg.pricingModel}
                                        onChange={(v) => updatePackage(pkg.id, "pricingModel", v)}
                                        placeholder="Select pricing model"
                                        options={PRICING_MODEL_OPTIONS}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Currency</FieldLabel>
                                    <SelectInput
                                        value={pkg.currency}
                                        onChange={(v) => updatePackage(pkg.id, "currency", v)}
                                        placeholder="Select currency"
                                        options={CURRENCY_OPTIONS}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Regular Price</FieldLabel>
                                    <TextInput
                                        value={pkg.regularPrice}
                                        onChange={(v) => updatePackage(pkg.id, "regularPrice", v)}
                                        placeholder="Enter regular price"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Promotion Price</FieldLabel>
                                    <TextInput
                                        value={pkg.promotionPrice}
                                        onChange={(v) => updatePackage(pkg.id, "promotionPrice", v)}
                                        placeholder="Enter promotion price"
                                    />
                                </div>
                            </div>

                            {/* Promotion Duration */}
                            <SectionLabel>
                                <span className="mt-6 block">Promotion Duration</span>
                            </SectionLabel>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <FieldLabel>Start Date</FieldLabel>
                                    <DateInput
                                        value={pkg.startDate}
                                        onChange={(v) => updatePackage(pkg.id, "startDate", v)}
                                        placeholder="Select start date"
                                    />
                                </div>
                                <div>
                                    <FieldLabel>End date</FieldLabel>
                                    <DateInput
                                        value={pkg.endDate}
                                        onChange={(v) => updatePackage(pkg.id, "endDate", v)}
                                        placeholder="Select end date"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add new promotion type */}
            <button
                onClick={handleAddPackage}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
                <Plus className="h-4 w-4" />
                Add New Promotion Type
            </button>
        </div>
    );
}