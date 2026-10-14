"use client";

import { useState } from "react";
import { Ban, Check, Eye, Loader2, Mail, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
    type AdminListing,
    type AdminListingDetails,
    useApproveAdminListingMutation,
    useDeactivateAdminListingMutation,
    useGetAdminListingsQuery,
    useLazyGetAdminListingQuery,
    useRejectAdminListingMutation,
    useRemoveAdminListingMutation,
} from "@/redux/features/admin/adminApi";

function getErrorMessage(error: unknown, fallback: string) {
    if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
    ) {
        return error.data.message;
    }

    return fallback;
}

const statusClasses: Record<AdminListing["status"], string> = {
    pending: "bg-amber-50 text-amber-600",
    approved: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
    deactivated: "bg-gray-100 text-gray-600",
    draft: "bg-gray-100 text-gray-600",
    sold: "bg-blue-50 text-blue-600",
    expired: "bg-orange-50 text-orange-600",
};

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getListingDetailsHtml(listing: AdminListingDetails) {
    const images = [...listing.images]
        .sort((first, second) => first.sortOrder - second.sortOrder)
        .map(
            (image) =>
                `<img src="${escapeHtml(image.thumbnailUrl || image.imageUrl)}" alt="${escapeHtml(
                    listing.title,
                )}" style="width: 96px; height: 72px; object-fit: cover; border-radius: 8px;" />`,
        )
        .join("");
    const attributes = listing.attributeValues
        .map((attribute) => {
            const name = attribute.categoryAttribute?.name;
            const value = attribute.valueText ?? attribute.valueNumber;
            return name && value
                ? `<div><strong>${escapeHtml(name)}:</strong> ${escapeHtml(value)}</div>`
                : "";
        })
        .join("");
    const location = [listing.town?.name, listing.district?.name, listing.region?.name]
        .filter(Boolean)
        .join(", ");

    return `
        <div style="text-align: left; max-height: 65vh; overflow-y: auto;">
            <div style="display: flex; gap: 8px; overflow-x: auto; margin-bottom: 16px;">${images}</div>
            <h3 style="margin: 0 0 8px; font-size: 18px;">${escapeHtml(listing.title)}</h3>
            <p style="margin: 0 0 14px; color: #4b5563;">${escapeHtml(listing.description)}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                <div><strong>Price:</strong> ${escapeHtml(listing.currency)} ${escapeHtml(listing.price)}</div>
                <div><strong>Status:</strong> ${escapeHtml(listing.status)}</div>
                <div><strong>Condition:</strong> ${escapeHtml(listing.condition)}</div>
                <div><strong>Category:</strong> ${escapeHtml(listing.category.name)}</div>
                ${location ? `<div><strong>Location:</strong> ${escapeHtml(location)}</div>` : ""}
                <div><strong>Seller:</strong> ${escapeHtml(listing.seller.fullName)}</div>
                ${listing.seller.sellerProfile?.storeName
            ? `<div><strong>Store:</strong> ${escapeHtml(listing.seller.sellerProfile.storeName)}</div>`
            : ""}
                <div><strong>Views:</strong> ${listing.viewsCount}</div>
                <div><strong>Favorites:</strong> ${listing.favoritesCount}</div>
            </div>
            ${attributes ? `<div style="margin-top: 14px;"><strong>Attributes</strong><div style="margin-top: 6px;">${attributes}</div></div>` : ""}
        </div>
    `;
}

export default function ProductVerificationTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [actionListingId, setActionListingId] = useState<string | null>(null);
    const { data, isLoading, isError, refetch } = useGetAdminListingsQuery({
        page: currentPage,
        limit: 20,
    });
    const [approveListing] = useApproveAdminListingMutation();
    const [rejectListing] = useRejectAdminListingMutation();
    const [deactivateListing] = useDeactivateAdminListingMutation();
    const [removeListing] = useRemoveAdminListingMutation();
    const [getListing] = useLazyGetAdminListingQuery();

    const listings = data?.data.listings ?? [];
    const totalPages = data?.meta.totalPages ?? 1;

    const runAction = async (
        listing: AdminListing,
        action: () => Promise<{ data: { message: string } }>,
        fallback: string,
    ) => {
        if (actionListingId) return;

        setActionListingId(listing.id);
        try {
            const response = await action();
            toast.success(response.data.message);
        } catch (error) {
            toast.error(getErrorMessage(error, fallback));
        } finally {
            setActionListingId(null);
        }
    };

    const handleReject = async (listing: AdminListing) => {
        if (actionListingId) return;

        const result = await Swal.fire({
            title: "Reject this listing?",
            text: "Please provide a reason for rejecting this listing.",
            input: "textarea",
            inputPlaceholder: "Enter rejection reason",
            inputAttributes: {
                "aria-label": "Rejection reason",
            },
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Reject listing",
            cancelButtonText: "Cancel",
            inputValidator: (value) =>
                value.trim() ? undefined : "A rejection reason is required.",
        });
        if (!result.isConfirmed) return;

        return runAction(
            listing,
            () => rejectListing({ id: listing.id, reason: result.value.trim() }).unwrap(),
            "Unable to reject this listing.",
        );
    };

    const handleRemove = async (listing: AdminListing) => {
        if (actionListingId) return;

        const result = await Swal.fire({
            title: "Remove this listing?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Remove listing",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;

        return runAction(
            listing,
            () => removeListing(listing.id).unwrap(),
            "Unable to remove this listing.",
        );
    };

    const handleView = async (listing: AdminListing) => {
        if (actionListingId) return;

        try {
            const details = await getListing(listing.id).unwrap();
            await Swal.fire({
                title: "Listing details",
                html: getListingDetailsHtml(details),
                width: 700,
                confirmButtonColor: "#f59e0b",
                confirmButtonText: "Close",
            });
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to load listing details."));
        }
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-275 border-collapse">
                        <thead>
                            <tr className="text-left text-sm text-gray-700">
                                <th className="px-6 py-5 font-semibold">SL no.</th>
                                <th className="px-6 py-5 font-semibold">Product Name</th>
                                <th className="px-6 py-5 font-semibold">Seller Info</th>
                                <th className="px-6 py-5 font-semibold">Photo</th>
                                <th className="px-6 py-5 font-semibold">Price</th>
                                <th className="px-6 py-5 font-semibold">Status</th>
                                <th className="px-6 py-5 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.map((listing, index) => (
                                <tr key={listing.id} className="border-t border-gray-50 text-sm text-gray-700">
                                    <td className="px-6 py-4 align-top">{(currentPage - 1) * 20 + index + 1}</td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-medium text-gray-800">{listing.title}</div>
                                    </td>

                                    {/* Seller info */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-medium text-gray-800">{listing.seller.fullName}</div>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                            <Mail className="h-3 w-3" />
                                            {listing.seller.email}
                                        </div>
                                    </td>

                                    {/* Photos */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex gap-1.5">
                                            {listing.images.map((image) => (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    key={image.id}
                                                    src={image.thumbnailUrl || image.imageUrl}
                                                    alt={`${listing.title} photo`}
                                                    className="h-10 w-10 rounded-md object-cover"
                                                />
                                            ))}
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4 align-top">{listing.currency} {listing.price}</td>

                                    {/* Status */}
                                    <td className="px-6 py-4 align-top">
                                        <span
                                            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium capitalize ${statusClasses[listing.status]
                                                }`}
                                        >
                                            {listing.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    listing.status !== "approved" &&
                                                    runAction(
                                                        listing,
                                                        () => approveListing(listing.id).unwrap(),
                                                        "Unable to approve this listing.",
                                                    )
                                                }
                                                disabled={actionListingId !== null || listing.status === "approved"}
                                                className={`inline-flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${listing.status === "approved"
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                    : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                    }`}
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                {listing.status === "approved" ? "Approved" : "Approve"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleView(listing)}
                                                className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50"
                                                aria-label="View product"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleReject(listing)}
                                                disabled={actionListingId !== null}
                                                className="inline-flex cursor-pointer items-center justify-center rounded-md border border-red-100 bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                                                aria-label="Reject product"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    runAction(
                                                        listing,
                                                        () => deactivateListing(listing.id).unwrap(),
                                                        "Unable to deactivate this listing.",
                                                    )
                                                }
                                                disabled={actionListingId !== null}
                                                className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-400 transition hover:bg-gray-50"
                                                aria-label="Suspend product"
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(listing)}
                                                disabled={actionListingId !== null}
                                                className="inline-flex cursor-pointer items-center justify-center rounded-md border border-red-100 bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                                                aria-label="Delete product"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {listings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {isLoading && (
                    <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-8 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading listings...
                    </div>
                )}
                {isError && (
                    <div className="border-t border-gray-100 px-6 py-8 text-center">
                        <p className="text-sm font-medium text-red-600">Unable to load listings.</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                        >
                            Try again
                        </button>
                    </div>
                )}
                {!isLoading && !isError && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((page) => page - 1)}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((page) => page + 1)}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}