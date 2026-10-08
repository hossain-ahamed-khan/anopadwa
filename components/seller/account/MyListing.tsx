"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
    Clock3,
    Tag,
    BarChart3,
    MoreHorizontal,
    Eye,
    X,
} from "lucide-react";
import {
    useDeleteListingMutation,
    useGetMyListingsQuery,
    useUpdateListingMutation,
    type ListingStatus as ApiListingStatus,
    type MyListing,
} from "@/redux/features/seller/createListing/listingApi";

type ListingStatus = ApiListingStatus;

const STATUS_STYLES: Record<ListingStatus, string> = {
    pending: "bg-orange-50 text-orange-500",
    approved: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-500",
    sold: "bg-blue-50 text-blue-500",
    expired: "bg-slate-100 text-slate-500",
};

const STATUS_LABELS: Record<ListingStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    sold: "Sold",
    expired: "Expired",
};

type EditForm = {
    title: string;
    description: string;
    condition: string;
    pricingType: string;
    price: string;
    currency: string;
};

const formatDate = (date: string | null) =>
    date
        ? new Intl.DateTimeFormat("en", {
              day: "numeric",
              month: "short",
              year: "numeric",
          }).format(new Date(date))
        : "-";

const formatError = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null && "data" in error) {
        const data = (error as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return fallback;
};

function EditListingModal({
    listing,
    isSaving,
    onClose,
    onSave,
}: {
    listing: MyListing;
    isSaving: boolean;
    onClose: () => void;
    onSave: (form: EditForm) => void;
}) {
    const [form, setForm] = useState<EditForm>({
        title: listing.title,
        description: listing.description,
        condition: listing.condition,
        pricingType: listing.pricingType,
        price: listing.price,
        currency: listing.currency,
    });

    const update = (key: keyof EditForm, value: string) =>
        setForm((current) => ({ ...current, [key]: value }));

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-800">Edit listing</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
                        aria-label="Close edit listing"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Title
                        <input
                            value={form.title}
                            onChange={(event) => update("title", event.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Description
                        <textarea
                            value={form.description}
                            onChange={(event) => update("description", event.target.value)}
                            rows={4}
                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                        />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-medium text-slate-700">
                            Price
                            <input
                                type="number"
                                value={form.price}
                                onChange={(event) => update("price", event.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Currency
                            <input
                                value={form.currency}
                                onChange={(event) => update("currency", event.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Condition
                            <input
                                value={form.condition}
                                onChange={(event) => update("condition", event.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                            Pricing type
                            <input
                                value={form.pricingType}
                                onChange={(event) => update("pricingType", event.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => onSave(form)}
                        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ListingsView() {
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editingListing, setEditingListing] = useState<MyListing | null>(null);
    const { data, isLoading, isError } = useGetMyListingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();
    const [deleteListing, { isLoading: isDeleting }] = useDeleteListingMutation();

    const listings = data?.data.listings ?? [];

    const handleDelete = async (listing: MyListing) => {
        if (isDeleting) return;
        const result = await Swal.fire({
            title: "Delete this listing?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            confirmButtonText: "Delete",
        });
        if (!result.isConfirmed) return;

        try {
            await deleteListing(listing.id).unwrap();
            setOpenMenuId(null);
            toast.success("Listing deleted successfully.");
        } catch (error) {
            toast.error(formatError(error, "Unable to delete this listing."));
        }
    };

    const handleUpdate = async (form: EditForm) => {
        if (!editingListing || isUpdating) return;
        if (!form.title.trim() || !form.description.trim() || !form.price.trim()) {
            toast.error("Title, description, and price are required.");
            return;
        }

        try {
            await updateListing({
                id: editingListing.id,
                body: {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    condition: form.condition.trim(),
                    pricingType: form.pricingType.trim(),
                    price: form.price.trim(),
                    currency: form.currency.trim(),
                },
            }).unwrap();
            setEditingListing(null);
            setOpenMenuId(null);
            toast.success("Listing updated successfully.");
        } catch (error) {
            toast.error(formatError(error, "Unable to update this listing."));
        }
    };

    return (
        <>
            <section className="h-full min-h-full min-w-0 overflow-visible rounded-xl bg-white shadow-sm">
                <div className="px-5">
                    <div className="min-w-[650px]">
                        <div className="grid grid-cols-[80px_minmax(0,1fr)_90px_110px_100px_50px] gap-4 border-b border-slate-100 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            <span>Thumbnail</span>
                            <span>Title</span>
                            <span>Price</span>
                            <span>Expires On</span>
                            <span>Status</span>
                            <span>Action</span>
                        </div>

                        {isLoading ? (
                            <p className="py-10 text-center text-sm text-slate-400">
                                Loading listings...
                            </p>
                        ) : isError ? (
                            <p className="py-10 text-center text-sm text-red-500">
                                Unable to load your listings. Please try again.
                            </p>
                        ) : listings.length === 0 ? (
                            <p className="py-10 text-center text-sm text-slate-400">
                                No listings found.
                            </p>
                        ) : (
                            listings.map((listing) => {
                                const image = listing.images[0];
                                return (
                                    <div
                                        key={listing.id}
                                        className="grid grid-cols-[80px_minmax(0,1fr)_90px_110px_100px_50px] items-center gap-4 border-b border-slate-100 py-4 last:border-b-0"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/seller/product/${listing.id}`)}
                                            className="relative h-16 w-16 overflow-hidden rounded-md border border-slate-200 bg-white"
                                            aria-label={`View ${listing.title}`}
                                        >
                                            {image ? (
                                                <Image
                                                    src={image.thumbnailUrl || image.imageUrl}
                                                    alt={listing.title}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain p-1"
                                                />
                                            ) : (
                                                <Eye className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                                            )}
                                        </button>

                                        <div className="min-w-0">
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/seller/product/${listing.id}`)}
                                                className="truncate text-left text-sm font-semibold text-slate-800 hover:text-emerald-700"
                                            >
                                                {listing.title}
                                            </button>
                                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                {formatDate(listing.createdAt)}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                                                <Tag className="h-3.5 w-3.5" />
                                                <span className="truncate">{listing.category.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/seller/product/${listing.id}`)}
                                                className="mt-1.5 flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                aria-label={`View ${listing.title}`}
                                            >
                                                <BarChart3 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <p className="text-sm font-semibold text-slate-800">
                                            {listing.currency} {listing.price}
                                        </p>
                                        <p className="text-sm text-slate-400">{formatDate(listing.expiresAt)}</p>
                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[listing.status]}`}
                                        >
                                            {STATUS_LABELS[listing.status]}
                                        </span>

                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenMenuId((current) =>
                                                        current === listing.id ? null : listing.id,
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50"
                                                aria-label={`Actions for ${listing.title}`}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                            {openMenuId === listing.id && (
                                                <div className="absolute right-0 top-9 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-md">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.push(`/seller/product/${listing.id}`)}
                                                        className="block w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingListing(listing)}
                                                        className="block w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => void handleDelete(listing)}
                                                        className="block w-full px-3 py-1.5 text-left text-red-600 hover:bg-slate-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {editingListing && (
                <EditListingModal
                    listing={editingListing}
                    isSaving={isUpdating}
                    onClose={() => setEditingListing(null)}
                    onSave={(form) => void handleUpdate(form)}
                />
            )}
        </>
    );
}
