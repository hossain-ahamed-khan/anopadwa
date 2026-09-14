"use client";

import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { ChevronRight, ChevronDown, Sparkles, Camera, X, MapPin } from "lucide-react";

// ---------- Types ----------

type PricingKind = "price" | "range" | "disabled";
type PricingTerms = "fixed" | "negotiable" | "on_call";

interface ProductFormState {
    category: string;
    subCategory: string;
    title: string;
    listingTitle: string;
    description: string;
    pricingKind: PricingKind;
    pricingTerms: PricingTerms;
    price: string;
    minPrice: string;
    maxPrice: string;
    images: File[];
    region: string;
    metropolitanDistrict: string;
    postCode: string;
    countryCode: string;
    phone: string;
    email: string;
    hideMap: boolean;
    agreedToTerms: boolean;
}

const CATEGORIES = ["Electronics", "Vehicles", "Real Estate", "Fashion", "Home & Garden"];
const SUB_CATEGORIES = ["Mobile Phones", "Laptops", "Cameras", "Accessories"];
const REGIONS = ["Greater Accra", "Ashanti", "Western", "Eastern", "Central"];
const DISTRICTS = ["Accra Metropolitan", "Tema Metropolitan", "Kumasi Metropolitan"];
const POST_CODES = ["GA-039-5028", "GA-184-3922", "GA-535-2010"];
const COUNTRY_CODES = [
    { code: "+233", flag: "🇬🇭", label: "Ghana" },
    { code: "+234", flag: "🇳🇬", label: "Nigeria" },
    { code: "+225", flag: "🇨🇮", label: "Côte d'Ivoire" },
];

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const initialState: ProductFormState = {
    category: "",
    subCategory: "",
    title: "",
    listingTitle: "",
    description: "",
    pricingKind: "price",
    pricingTerms: "fixed",
    price: "",
    minPrice: "",
    maxPrice: "",
    images: [],
    region: "",
    metropolitanDistrict: "",
    postCode: "",
    countryCode: "+233",
    phone: "",
    email: "",
    hideMap: false,
    agreedToTerms: false,
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
    options: string[];
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
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
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

function RadioPill({
    checked,
    onSelect,
    label,
}: {
    checked: boolean;
    onSelect: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="flex items-center gap-2 text-sm text-neutral-700"
        >
            <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${checked ? "border-emerald-600" : "border-neutral-300"
                    }`}
            >
                {checked && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
            </span>
            {label}
        </button>
    );
}

// ---------- Main component ----------

export default function UploadProductForm() {
    const [form, setForm] = useState<ProductFormState>(initialState);
    const [isDraggingImages, setIsDraggingImages] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

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

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!form.agreedToTerms) return;
        console.log("Submitting product listing:", form);
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
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Category">
                                <Select
                                    value={form.category}
                                    onChange={(v) => update("category", v)}
                                    placeholder="Select a category"
                                    options={CATEGORIES}
                                />
                            </Field>
                            <Field label="Sub Category">
                                <Select
                                    value={form.subCategory}
                                    onChange={(v) => update("subCategory", v)}
                                    placeholder="Select a sub category"
                                    options={SUB_CATEGORIES}
                                />
                            </Field>
                        </div>
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

                            <Field label="Listing Title" required>
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        value={form.listingTitle}
                                        onChange={(v) => update("listingTitle", v)}
                                        placeholder="Enter Listing Title"
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
                        </div>
                    </Section>

                    {/* Pricing */}
                    <Section title="PRICING">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <span className="mb-2 block text-sm font-medium text-neutral-800">
                                        Pricing Type
                                    </span>
                                    <div className="flex flex-wrap gap-4">
                                        <RadioPill
                                            checked={form.pricingKind === "price"}
                                            onSelect={() => update("pricingKind", "price")}
                                            label="Price"
                                        />
                                        <RadioPill
                                            checked={form.pricingKind === "range"}
                                            onSelect={() => update("pricingKind", "range")}
                                            label="Price Range"
                                        />
                                        <RadioPill
                                            checked={form.pricingKind === "disabled"}
                                            onSelect={() => update("pricingKind", "disabled")}
                                            label="Disabled"
                                        />
                                    </div>
                                </div>

                                {form.pricingKind === "price" && (
                                    <Field label="Price [¢]" required>
                                        <TextInput
                                            value={form.price}
                                            onChange={(v) => update("price", v)}
                                            placeholder="Enter Price"
                                            type="number"
                                        />
                                    </Field>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="mb-2 block text-sm font-medium text-neutral-800">
                                        Pricing Type
                                    </span>
                                    <div className="flex flex-wrap gap-4">
                                        <RadioPill
                                            checked={form.pricingTerms === "fixed"}
                                            onSelect={() => update("pricingTerms", "fixed")}
                                            label="Fixed"
                                        />
                                        <RadioPill
                                            checked={form.pricingTerms === "negotiable"}
                                            onSelect={() => update("pricingTerms", "negotiable")}
                                            label="Negotiable"
                                        />
                                        <RadioPill
                                            checked={form.pricingTerms === "on_call"}
                                            onSelect={() => update("pricingTerms", "on_call")}
                                            label="On Call"
                                        />
                                    </div>
                                </div>
                            </div>

                            {form.pricingKind === "range" && (
                                <>
                                    <Field label="Price [¢]" required>
                                        <TextInput
                                            value={form.minPrice}
                                            onChange={(v) => update("minPrice", v)}
                                            placeholder="Enter Min Price"
                                            type="number"
                                        />
                                    </Field>
                                    <Field label="Max Price [¢]" required>
                                        <TextInput
                                            value={form.maxPrice}
                                            onChange={(v) => update("maxPrice", v)}
                                            placeholder="Enter Max Price"
                                            type="number"
                                        />
                                    </Field>
                                </>
                            )}
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
                                    value={form.region}
                                    onChange={(v) => update("region", v)}
                                    placeholder="Select Region"
                                    options={REGIONS}
                                />
                            </Field>

                            <Field label="Metropolitan District">
                                <Select
                                    value={form.metropolitanDistrict}
                                    onChange={(v) => update("metropolitanDistrict", v)}
                                    placeholder="Select Metropolitan District"
                                    options={DISTRICTS}
                                />
                            </Field>

                            <Field label="Post Code">
                                <Select
                                    value={form.postCode}
                                    onChange={(v) => update("postCode", v)}
                                    placeholder="Enter Postal Code"
                                    options={POST_CODES}
                                />
                            </Field>

                            <Field label="Phone" required>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <select
                                            value={form.countryCode}
                                            onChange={(e) => update("countryCode", e.target.value)}
                                            className="h-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pl-3 pr-8 text-sm text-neutral-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        >
                                            {COUNTRY_CODES.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.flag} {c.code}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                                    </div>
                                    <TextInput
                                        value={form.phone}
                                        onChange={(v) => update("phone", v)}
                                        placeholder="201 555 999"
                                        type="tel"
                                    />
                                </div>
                            </Field>

                            <Field label="Email">
                                <TextInput
                                    value={form.email}
                                    onChange={(v) => update("email", v)}
                                    placeholder="Enter Email"
                                    type="email"
                                />
                            </Field>

                            {!form.hideMap && (
                                <div>
                                    <span className="mb-1.5 block text-sm font-medium text-neutral-800">Map</span>
                                    <div className="relative mx-auto flex h-52 max-w-md items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                                        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(0,0,0,.04)_25%,rgba(0,0,0,.04)_26%,transparent_27%,transparent_74%,rgba(0,0,0,.04)_75%,rgba(0,0,0,.04)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,0,0,.04)_25%,rgba(0,0,0,.04)_26%,transparent_27%,transparent_74%,rgba(0,0,0,.04)_75%,rgba(0,0,0,.04)_76%,transparent_77%,transparent)] bg-[length:24px_24px]" />
                                        <div className="relative flex flex-col items-center gap-1 text-emerald-700">
                                            <MapPin className="h-6 w-6 fill-emerald-600 text-emerald-700" />
                                            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs text-neutral-700 shadow-sm">
                                                {form.region || "Accra Metropolitan, Greater Accra"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <label className="flex items-center gap-2 text-sm text-neutral-600">
                                <input
                                    type="checkbox"
                                    checked={form.hideMap}
                                    onChange={(e) => update("hideMap", e.target.checked)}
                                    className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500/30"
                                />
                                Don&apos;t show the Map
                            </label>
                        </div>
                    </Section>

                    {/* Terms & Conditions */}
                    <Section title="TERMS &amp; CONDITIONS">
                        <label className="flex items-start gap-2 text-sm text-neutral-600">
                            <input
                                type="checkbox"
                                checked={form.agreedToTerms}
                                onChange={(e) => update("agreedToTerms", e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500/30"
                            />
                            <span>
                                I have read and agree to the{" "}
                                <a href="#" className="text-emerald-700 underline underline-offset-2">
                                    Terms and Conditions
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-emerald-700 underline underline-offset-2">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
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
                            disabled={!form.agreedToTerms}
                            className="rounded-lg bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}