"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
    reportReasons,
    type ReportReason,
} from "@/redux/features/reportListing/reportListing";
import { useReportListingMutation } from "@/redux/features/reportListing/reportListing";

type ReportListingModalProps = {
    listingId: string;
    listingTitle: string;
    onClose: () => void;
};

type ReportApiError = {
    data?: {
        error?: {
            message?: string;
        };
        message?: string;
    };
};

function getReportErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const apiError = error as ReportApiError;
        return (
            apiError.data?.error?.message ??
            apiError.data?.message ??
            "Unable to submit the report. Please try again."
        );
    }

    return "Unable to submit the report. Please try again.";
}

export default function ReportListingModal({
    listingId,
    listingTitle,
    onClose,
}: ReportListingModalProps) {
    const titleId = useId();
    const detailsId = useId();
    const [reason, setReason] = useState<ReportReason | "">("");
    const [details, setDetails] = useState("");
    const [reportListing, { isLoading }] = useReportListingMutation();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isLoading) onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isLoading, onClose]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!reason) {
            toast.error("Please select a reason for your report.");
            return;
        }

        try {
            await reportListing({
                listingId,
                reason,
                details: details.trim() || undefined,
            }).unwrap();
            toast.success("Listing report submitted for moderation review.");
            onClose();
        } catch (error) {
            toast.error(getReportErrorMessage(error));
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isLoading) onClose();
            }}
        >
            <section className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                            Report listing
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{listingTitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label="Close report dialog"
                        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor={`${titleId}-reason`} className="mb-2 block text-sm font-medium text-slate-800">
                            Reason <span className="text-red-600">*</span>
                        </label>
                        <select
                            id={`${titleId}-reason`}
                            value={reason}
                            onChange={(event) => setReason(event.target.value as ReportReason | "")}
                            disabled={isLoading}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-50"
                        >
                            <option value="">Select a reason</option>
                            {reportReasons.map((reportReason) => (
                                <option key={reportReason.value} value={reportReason.value}>
                                    {reportReason.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor={detailsId} className="mb-2 block text-sm font-medium text-slate-800">
                            More details <span className="font-normal text-slate-500">(optional)</span>
                        </label>
                        <textarea
                            id={detailsId}
                            value={details}
                            onChange={(event) => setDetails(event.target.value)}
                            maxLength={1000}
                            rows={5}
                            placeholder="Tell us what is wrong with this listing..."
                            disabled={isLoading}
                            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                        <p className="mt-1 text-right text-xs text-slate-400">{details.length}/1000</p>
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Submitting..." : "Submit report"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
