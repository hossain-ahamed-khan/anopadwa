"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Eye, Loader2, Mail, X } from "lucide-react";
import { toast } from "sonner";
import {
    type AdminListingReport,
    type AdminReportStatus,
} from "@/redux/features/admin/adminApi";

const ACTIONS = [
    { value: "dismissed", label: "Dismiss report" },
    { value: "listing_marked_sold", label: "Mark listing as sold" },
    { value: "listing_deactivated", label: "Deactivate listing" },
    { value: "listing_removed", label: "Remove listing permanently" },
] as const;

type AdminReportsResponse = {
    data: { reports: AdminListingReport[] };
    meta: { total: number; totalPages: number };
};

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

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function statusClasses(status: AdminReportStatus) {
    return {
        pending: "bg-amber-50 text-amber-700",
        reviewed: "bg-blue-50 text-blue-700",
        dismissed: "bg-gray-100 text-gray-600",
        action_taken: "bg-emerald-50 text-emerald-700",
    }[status];
}

export default function AdminReportsPage() {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<AdminReportsResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [isError, setIsError] = useState(false);
    const [activeReport, setActiveReport] = useState<AdminListingReport | null>(null);
    const [action, setAction] = useState<(typeof ACTIONS)[number]["value"]>("dismissed");
    const [notes, setNotes] = useState("");
    const [isResolving, setIsResolving] = useState(false);

    const refetch = useCallback(async () => {
        setIsFetching(true);
        setIsError(false);
        try {
            const response = await fetch(`/api/admin/reports?page=${page}&limit=10`);
            const payload = await response.json();
            if (!response.ok) throw new Error(payload?.message ?? "Unable to load reports.");
            setData(payload as AdminReportsResponse);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [page]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void refetch();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [refetch]);

    const reports = data?.data.reports ?? [];
    const totalPages = data?.meta.totalPages ?? 1;

    const handleResolve = async () => {
        if (!activeReport || isResolving) return;
        if (action === "listing_removed" && !window.confirm("Remove this listing permanently? This cannot be undone.")) {
            return;
        }

        setIsResolving(true);
        try {
            const response = await fetch(`/api/admin/reports/${activeReport.id}/resolve`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, notes }),
            });
            const payload = await response.json();
            if (!response.ok) throw { data: payload };

            toast.success(payload.data?.message ?? payload.message ?? "Report resolved successfully.");
            setActiveReport(null);
            setNotes("");
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to resolve this report."));
        } finally {
            setIsResolving(false);
        }
    };

    return (
        <section className="min-h-full bg-[#FBF6EE] p-5 sm:p-8">
            <div className="mx-auto max-w-[1500px]">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-amber-600">Admin moderation</p>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900">Listing reports</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Review user-submitted reports and take action on listings.
                        </p>
                    </div>
                    <div className="rounded-lg border border-orange-100 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                        <span className="font-semibold text-gray-900">{data?.meta.total ?? 0}</span> total reports
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                    {isLoading || (isFetching && reports.length === 0) ? (
                        <div className="flex min-h-64 items-center justify-center text-gray-500">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading reports...
                        </div>
                    ) : isError ? (
                        <div className="flex min-h-64 flex-col items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                            <p className="mt-3 text-sm font-medium text-red-600">Unable to load reports.</p>
                            <button type="button" onClick={() => refetch()} className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
                                Try again
                            </button>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="flex min-h-64 flex-col items-center justify-center text-gray-500">
                            <AlertTriangle className="h-8 w-8 text-gray-300" />
                            <p className="mt-3 text-sm">No reports have been submitted yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1050px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                                            <th className="px-5 py-4">Report</th>
                                            <th className="px-5 py-4">Listing</th>
                                            <th className="px-5 py-4">Reporter</th>
                                            <th className="px-5 py-4">Submitted</th>
                                            <th className="px-5 py-4">Status</th>
                                            <th className="px-5 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((report) => (
                                            <tr key={report.id} className="border-b border-gray-50 text-sm text-gray-700 last:border-0">
                                                <td className="px-5 py-4 align-top">
                                                    <p className="font-semibold text-gray-900">#{report.id}</p>
                                                    <p className="mt-1 text-xs text-amber-700">{report.reason.replaceAll("_", " ")}</p>
                                                </td>
                                                <td className="max-w-[260px] px-5 py-4 align-top">
                                                    <p className="truncate font-medium text-gray-900">{report.listing.title}</p>
                                                    <p className="mt-1 text-xs text-gray-500">ID: {report.listingId} · {report.listing.status}</p>
                                                </td>
                                                <td className="px-5 py-4 align-top">
                                                    <p className="font-medium text-gray-800">{report.reporter.fullName}</p>
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400"><Mail className="h-3 w-3" />{report.reporter.email}</p>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 align-top text-xs text-gray-500">{formatDate(report.createdAt)}</td>
                                                <td className="px-5 py-4 align-top">
                                                    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses(report.status)}`}>
                                                        {report.status.replace("_", " ")}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 align-top">
                                                    <button type="button" onClick={() => { setActiveReport(report); setAction("dismissed"); }} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
                                                        <Eye className="h-3.5 w-3.5" /> Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                                    <button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
                                    <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                                    <button type="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {activeReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="report-dialog-title">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-amber-600">Report #{activeReport.id}</p>
                                <h2 id="report-dialog-title" className="mt-1 text-lg font-bold text-gray-900">{activeReport.listing.title}</h2>
                            </div>
                            <button type="button" onClick={() => setActiveReport(null)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100" aria-label="Close report"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="space-y-5 px-6 py-5">
                            <div className="grid gap-4 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                                <div><p className="text-xs text-gray-500">Reason</p><p className="mt-1 font-semibold capitalize text-gray-900">{activeReport.reason.replaceAll("_", " ")}</p></div>
                                <div><p className="text-xs text-gray-500">Current status</p><p className="mt-1 font-semibold capitalize text-gray-900">{activeReport.listing.status}</p></div>
                                <div><p className="text-xs text-gray-500">Reporter</p><p className="mt-1 font-semibold text-gray-900">{activeReport.reporter.fullName}</p><p className="text-xs text-gray-500">{activeReport.reporter.email}</p></div>
                                <div><p className="text-xs text-gray-500">Seller</p><p className="mt-1 font-semibold text-gray-900">{activeReport.listing.seller.fullName}</p><p className="text-xs text-gray-500">{activeReport.listing.seller.email}</p></div>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Report details</p>
                                <p className="mt-2 rounded-lg border border-gray-100 p-3 text-sm leading-6 text-gray-700">{activeReport.details || "No additional details provided."}</p>
                            </div>
                            {activeReport.listing.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {activeReport.listing.images.map((image, index) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img key={`${image.imageUrl}-${index}`} src={image.imageUrl} alt="" className="h-20 w-24 rounded-lg object-cover" />
                                    ))}
                                </div>
                            )}
                            <div className="border-t border-gray-100 pt-5">
                                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                                    Resolution
                                    <select value={action} onChange={(event) => setAction(event.target.value as typeof action)} className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:border-amber-400">
                                        {ACTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                    </select>
                                </label>
                                <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-gray-700">
                                    Notes <span className="font-normal text-gray-400">(optional)</span>
                                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Explain the evidence or decision..." className="rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-amber-400" />
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                            <button type="button" onClick={() => setActiveReport(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">Cancel</button>
                            <button type="button" disabled={isResolving || activeReport.status !== "pending"} onClick={handleResolve} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
                                {isResolving && <Loader2 className="h-4 w-4 animate-spin" />} {activeReport.status === "pending" ? "Apply resolution" : "Already resolved"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
