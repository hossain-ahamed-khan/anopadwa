"use client";

import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { ChevronRight, ChevronDown, Sparkles, Camera, X } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { useCreateListingMutation } from "@/redux/features/seller/createListing/listingApi";
import { useGetCategoriesQuery } from "@/redux/features/seller/createListing/getCategories";
import { useGetRegionsQuery } from "@/redux/features/seller/createListing/getRegion";
import { useGetDistrictsByRegionQuery } from "@/redux/features/seller/createListing/getDistrict";

// ---------- Types ----------

type PricingTerms = "fixed" | "negotiable" | "on_call";

interface ProductFormState {
    categoryId: string;
    title: string;
    description: string;
    condition: string;
    currency: string;
    pricingTerms: PricingTerms;
    price: string;
    images: File[];
    regionId: string;
    districtId: string;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const initialState: ProductFormState = {
    categoryId: "",
    title: "",
    description: "",
    condition: "used",
    currency: "GHS",
    pricingTerms: "fixed",
    price: "",
    images: [],
    regionId: "",
    districtId: "",
};

// ---------- Small building blocks ----------

function Section({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wide text-neutral-500">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-neutral-800">
                {label}
                {required && <span className="text-rose-500">*</span>}
            </span>
            {children}
        </label>
    );
}

function Select({
    value,
    onChange,
    placeholder,
    options,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: Array<string | { value: string; label: string }>;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
                <option value="" disabled className="text-neutral-400">
                    {placeholder}
                </option>
                {options.map((option) => {
                    const opt = typeof option === "string"
                        ? { value: option, label: option }
                        : option;
                    return (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                    );
                })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        </div>
    );
}

function TextInput({
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
    );
}

function AiButton({ label, onClick }: { label: string; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
        >
            <Sparkles className="h-3.5 w-3.5" />
            {label}
        </button>
    );
}

// ---------- Main component ----------

export default function UploadProductForm() {
    const [form, setForm] = useState<ProductFormState>(initialState);
    const [isDraggingImages, setIsDraggingImages] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();
    const { data: regionsResponse, isLoading: isLoadingRegions } = useGetRegionsQuery();
    const { data: districtsResponse, isLoading: isLoadingDistricts } =
        useGetDistrictsByRegionQuery(form.regionId || skipToken);
    const [createListing, { isLoading: isCreatingListing }] = useCreateListingMutation();

    const categories = categoriesResponse?.data.categories ?? [];
    const regions = regionsResponse?.data.regions.filter((region) => region.isEnabled) ?? [];
    const districts = districtsResponse?.data.districts.filter((district) => district.isEnabled) ?? [];

    function update<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function addImages(fileList: FileList | null) {
        if (!fileList) return;
        const incoming = Array.from(fileList);
        const validTypeFiles = incoming.filter((f) => ALLOWED_IMAGE_TYPES.includes(f.type));

        if (validTypeFiles.length < incoming.length) {
            setImageError("Allowed image types does not match. jpeg, jpg, png");
            return;
        }

        const validSizeFiles = validTypeFiles.filter((f) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
        if (validSizeFiles.length < validTypeFiles.length) {
            setImageError(`Maximum file size limit is ${MAX_FILE_SIZE_MB}MB`);
            return;
        }

        const combined = [...form.images, ...validSizeFiles].slice(0, MAX_IMAGES);
        if (form.images.length + validSizeFiles.length > MAX_IMAGES) {
            setImageError(`You can upload maximum ${MAX_IMAGES} images`);
        } else {
            setImageError(null);
        }
        update("images", combined);
    }

    function removeImage(index: number) {
        update(
            "images",
            form.images.filter((_, i) => i !== index)
        );
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDraggingImages(false);
        addImages(e.dataTransfer.files);
    }

    function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
        addImages(e.target.files);
        e.target.value = "";
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!form.categoryId || !form.regionId || !form.districtId || !form.title.trim() ||
            !form.description.trim() || !form.condition || !form.pricingTerms || !form.price) {
            toast.error("Please complete all required listing fields.");
            return;
        }
        if (form.images.length === 0) {
            toast.error("Please add at least one listing image.");
            return;
        }

        const formData = new FormData();
        const fields = {
            title: form.title.trim(),
            description: form.description.trim(),
            categoryId: form.categoryId,
            condition: form.condition,
            pricingType: form.pricingTerms,
            price: form.price,
            currency: form.currency,
            regionId: form.regionId,
            districtId: form.districtId,
            publish: "true",
        };

        Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
        form.images.forEach((image) => formData.append("images", image));

        try {
            await createListing(formData).unwrap();
            toast.success("Listing submitted successfully.");
            setForm(initialState);
            setImageError(null);
        } catch (error) {
            const message =
                typeof error === "object" && error !== null && "data" in error &&
                    typeof error.data === "object" && error.data !== null && "message" in error.data &&
                    typeof error.data.message === "string"
                    ? error.data.message
                    : "Unable to submit listing. Please try again.";
            toast.error(message);
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
                    <span>Home</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-emerald-700">Upload a Product</span>
                </nav>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    {/* Basic Information */}
                    <Section
                        title="BASIC INFORMATION"
                        action={
                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Help me create this listing!
                            </button>
                        }
                    >
                        <div>
                            <Field label="Category">
                                <Select
                                    value={form.categoryId}
                                    onChange={(v) => update("categoryId", v)}
                                    placeholder="Select a category"
                                    options={categories.map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                    }))}
                                />
                            </Field>
                        </div>
                        {isLoadingCategories && (
                            <p className="text-xs text-neutral-500">Loading categories...</p>
                        )}
                    </Section>

                    {/* Product Information */}
                    <Section title="PRODUCT INFORMATION">
                        <div className="space-y-4">
                            <Field label="Title" required>
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        value={form.title}
                                        onChange={(v) => update("title", v)}
                                        placeholder="Enter Title"
                                    />
                                    <AiButton label="Write With AI" />
                                </div>
                            </Field>

                            <Field label="Product Description" required>
                                <div className="relative">
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => update("description", e.target.value)}
                                        placeholder="Enter Product Description"
                                        rows={4}
                                        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 pb-12 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <AiButton label="Rewrite Description" />
                                        <AiButton label="Write With AI" />
                                    </div>
                                </div>
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Condition" required>
                                    <Select
                                        value={form.condition}
                                        onChange={(v) => update("condition", v)}
                                        placeholder="Select condition"
                                        options={["new", "used", "refurbished"]}
                                    />
                                </Field>
                                <Field label="Currency" required>
                                    <Select
                                        value={form.currency}
                                        onChange={(v) => update("currency", v)}
                                        placeholder="Select currency"
                                        options={["GHS", "USD"]}
                                    />
                                </Field>
                            </div>
                        </div>
                    </Section>

                    {/* Pricing */}
                    <Section title="PRICING">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Pricing Type" required>
                                <Select
                                    value={form.pricingTerms}
                                    onChange={(v) => update("pricingTerms", v as PricingTerms)}
                                    placeholder="Select pricing type"
                                    options={[
                                        { value: "fixed", label: "Fixed" },
                                        { value: "negotiable", label: "Negotiable" },
                                        { value: "on_call", label: "On Call" },
                                    ]}
                                />
                            </Field>
                            <Field label="Price" required>
                                <TextInput
                                    value={form.price}
                                    onChange={(v) => update("price", v)}
                                    placeholder="Enter price"
                                    type="number"
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Images */}
                    <Section title="IMAGES">
                        <div>
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDraggingImages(true);
                                }}
                                onDragLeave={() => setIsDraggingImages(false)}
                                onDrop={handleDrop}
                                className={`relative flex min-h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${isDraggingImages
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-neutral-200 bg-neutral-50"
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                                    multiple
                                    onChange={handleFileInput}
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                />
                                <Camera className="mb-3 h-6 w-6 text-neutral-400" />
                                <p className="text-sm text-neutral-600">Upload up to {MAX_IMAGES} photos</p>
                                <p className="mt-1 text-xs text-neutral-400">
                                    Drag &amp; drop photos here or click to upload
                                </p>
                            </div>

                            {form.images.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {form.images.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="group relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-neutral-500">
                                <li>Maximum file size limit is {MAX_FILE_SIZE_MB}MB</li>
                                <li>You can upload maximum {MAX_IMAGES} images</li>
                                <li>Allowed image types does not match. jpeg, jpg, png</li>
                            </ul>
                            {imageError && <p className="mt-2 text-xs font-medium text-rose-500">{imageError}</p>}
                        </div>
                    </Section>

                    {/* Location */}
                    <Section title="LOCATION">
                        <div className="space-y-4">
                            <Field label="Select a Region">
                                <Select
                                    value={form.regionId}
                                    onChange={(v) => {
                                        update("regionId", v);
                                        update("districtId", "");
                                    }}
                                    placeholder="Select Region"
                                    options={regions.map((region) => ({
                                        value: region.id,
                                        label: region.name,
                                    }))}
                                />
                            </Field>

                            <Field label="Metropolitan District">
                                <Select
                                    value={form.districtId}
                                    onChange={(v) => update("districtId", v)}
                                    placeholder="Select Metropolitan District"
                                    options={districts.map((district) => ({
                                        value: district.id,
                                        label: district.name,
                                    }))}
                                />
                            </Field>

                            {isLoadingRegions && (
                                <p className="text-xs text-neutral-500">Loading regions...</p>
                            )}
                            {isLoadingDistricts && form.regionId && (
                                <p className="text-xs text-neutral-500">Loading districts...</p>
                            )}

                        </div>
                    </Section>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-neutral-100 pt-6">
                        <button
                            type="button"
                            onClick={() => setForm(initialState)}
                            className="rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingListing}
                            className="rounded-lg bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCreatingListing ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}