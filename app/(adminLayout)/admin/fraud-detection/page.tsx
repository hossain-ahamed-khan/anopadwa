"use client";

import { useMemo, useState } from "react";
import { Search, Eye, X, Check, Trash2, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";

type RiskLevel = "high" | "medium" | "low";
type ActionState = "pending" | "verified" | "rejected";

interface FlaggedListing {
    id: string;
    caseId: string;
    sellerName: string;
    sellerContact: string;
    sellerTag: { label: string; tone: "red" | "amber" | "green" };
    listingTitle: string;
    listingSubtitle: string;
    detectionSignal: string;
    detectionTone: "red" | "amber" | "green";
    riskScore: number;
    riskLevel: RiskLevel;
    actionState: ActionState;
}

interface StatCard {
    label: string;
    value: string;
    sublabel?: string;
    sublabelTone?: "amber" | "red" | "green" | "gray" | "blue";
    badge?: { text: string; tone: "red" };
}

const STATS: StatCard[] = [
    { label: "TOTAL FLAGGED", value: "1,428", sublabel: "+14 today", sublabelTone: "amber" },
    { label: "HIGH RISK CRITICAL", value: "184", badge: { text: "Requires Ban", tone: "red" } },
    { label: "UNDER REVIEW", value: "412", sublabel: "Queue time ~12m", sublabelTone: "gray" },
    { label: "FALSE POSITIVES CLEARED", value: "832", sublabel: "58.2%", sublabelTone: "green" },
    { label: "MODEL PRECISION", value: "98.4%", sublabel: "Model v4.2", sublabelTone: "blue" },
];

const QUICK_FILTERS = [
    "External Telegram/WhatsApp Leads",
    "All Flagged (1,428)",
    "Abnormal Prices (-80%)",
    "Duplicate Content Ring",
    "Image Reverse Mismatch",
    "Velocity Spikes",
];

const MOCK_LISTINGS: FlaggedListing[] = [
    {
        id: "1",
        caseId: "#SC-9042",
        sellerName: "Kathryn Murp",
        sellerContact: "bockely@att.com",
        sellerTag: { label: "Multiple IPs (4)", tone: "red" },
        listingTitle: "Apple iPhone 15 Pro Max 1TB",
        listingSubtitle: "Brand new sealed, contact on Telegram @sales99 for discount",
        detectionSignal: "Off-platform telegram link & -82% price drop",
        detectionTone: "red",
        riskScore: 98,
        riskLevel: "high",
        actionState: "pending",
    },
    {
        id: "2",
        caseId: "#SC-9043",
        sellerName: "Devon Lane",
        sellerContact: "csilvers@rizon.com",
        sellerTag: { label: "Verified Merchant", tone: "green" },
        listingTitle: "Aiwibi Baby Diapers Pack of 6",
        listingSubtitle: "Standard manufacturer bundle with legitimate barcode",
        detectionSignal: "Barcode matches verified distributor catalog",
        detectionTone: "green",
        riskScore: 12,
        riskLevel: "low",
        actionState: "verified",
    },
    {
        id: "3",
        caseId: "#SC-9044",
        sellerName: "Foysal Rahman",
        sellerContact: "qamaho@mail.com",
        sellerTag: { label: "New Account (3h)", tone: "amber" },
        listingTitle: "Sony PlayStation 5 Disc Edition",
        listingSubtitle: "Identical 48 listings detected within 12 minutes",
        detectionSignal: "High velocity listing flood: 48 posts/hr",
        detectionTone: "amber",
        riskScore: 74,
        riskLevel: "medium",
        actionState: "rejected",
    },
    {
        id: "4",
        caseId: "#SC-9045",
        sellerName: "Hari Danang",
        sellerContact: "xterris@gmail.com",
        sellerTag: { label: "Stolen Imagery Flag", tone: "red" },
        listingTitle: "Rolex Submariner Date 41mm",
        listingSubtitle: "Listing price ₵1,200 (Market ₵13,500)",
        detectionSignal: "Reverse image match: Pinterest scraped photo",
        detectionTone: "red",
        riskScore: 95,
        riskLevel: "high",
        actionState: "rejected",
    },
    {
        id: "5",
        caseId: "#SC-9046",
        sellerName: "Eleanor Pena",
        sellerContact: "xterris@gmail.com",
        sellerTag: { label: "KYC Passed", tone: "green" },
        listingTitle: "Aiwibi Baby Diapers",
        listingSubtitle: "You are looking at a lot of 6 packs",
        detectionSignal: "Legitimate price & trusted seller history",
        detectionTone: "green",
        riskScore: 5,
        riskLevel: "low",
        actionState: "verified",
    },
];

const TOTAL_PAGES = 3;

const toneClasses: Record<"red" | "amber" | "green" | "blue" | "gray", string> = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    gray: "text-gray-500",
};

function StatCardView({ stat }: { stat: StatCard }) {
    return (
        <div className="flex-1 rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-[11px] font-semibold tracking-wide text-gray-400">{stat.label}</p>
            <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                {stat.badge && (
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold text-white bg-red-500`}>
                        {stat.badge.text}
                    </span>
                )}
            </div>
            {stat.sublabel && (
                <span
                    className={`mt-1 inline-block text-xs font-medium ${stat.sublabelTone === "amber"
                            ? "text-amber-500"
                            : stat.sublabelTone === "green"
                                ? "text-emerald-500"
                                : stat.sublabelTone === "blue"
                                    ? "rounded bg-blue-50 px-1.5 py-0.5 text-blue-600"
                                    : "text-gray-400"
                        }`}
                >
                    {stat.sublabel}
                </span>
            )}
        </div>
    );
}

function RiskBadge({ score, level }: { score: number; level: RiskLevel }) {
    const label = level === "high" ? "High" : level === "medium" ? "Medium" : "Low";
    const classes =
        level === "high"
            ? "bg-red-50 text-red-600"
            : level === "medium"
                ? "bg-amber-50 text-amber-600"
                : "bg-emerald-50 text-emerald-600";
    return (
        <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${classes}`}>
            {score}% {label}
        </span>
    );
}

export default function ScamDetectionDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All Flagged (1,428)");
    const [listings, setListings] = useState<FlaggedListing[]>(MOCK_LISTINGS);
    const [selectedCaseId, setSelectedCaseId] = useState<string>(MOCK_LISTINGS[0].caseId);
    const [currentPage, setCurrentPage] = useState(3);

    const filteredListings = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return listings;
        return listings.filter(
            (l) =>
                l.caseId.toLowerCase().includes(q) ||
                l.sellerName.toLowerCase().includes(q) ||
                l.listingTitle.toLowerCase().includes(q)
        );
    }, [listings, searchQuery]);

    const selectedCase = listings.find((l) => l.caseId === selectedCaseId) ?? listings[0];

    const handleSearch = () => setSearchQuery(searchTerm);

    const handleVerify = (id: string) => {
        setListings((prev) =>
            prev.map((l) => (l.id === id ? { ...l, actionState: "verified" } : l))
        );
    };

    const handleRejectOrBan = (id: string) => {
        setListings((prev) =>
            prev.map((l) => (l.id === id ? { ...l, actionState: "rejected" } : l))
        );
    };

    const handleView = (id: string) => {
        const target = listings.find((l) => l.id === id);
        if (target) setSelectedCaseId(target.caseId);
    };

    const handleDelete = (id: string) => {
        setListings((prev) => prev.filter((l) => l.id !== id));
    };

    const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            {/* Stat cards */}
            <div className="mb-4 flex flex-wrap gap-3">
                {STATS.map((stat) => (
                    <StatCardView key={stat.label} stat={stat} />
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm">
                {/* Search */}
                <div className="flex items-center gap-3 p-4">
                    <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search by listing ID, seller name, keyword or scam pattern..."
                            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                        Search
                    </button>
                </div>

                {/* Quick filters */}
                <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
                    <span className="text-xs font-medium text-gray-400">Quick Filters:</span>
                    {QUICK_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${activeFilter === filter
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto border-t border-gray-100">
                    <table className="w-full min-w-[1100px] border-collapse">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-500">
                                <th className="px-6 py-4">SL no.</th>
                                <th className="px-6 py-4">Seller Name and Risk</th>
                                <th className="px-6 py-4">Flagged Listing</th>
                                <th className="px-6 py-4">AI Detection Signal</th>
                                <th className="px-6 py-4">Risk Score</th>
                                <th className="px-6 py-4">More Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredListings.map((listing) => (
                                <tr key={listing.id} className="border-t border-gray-50 align-top text-sm">
                                    <td className="px-6 py-4 font-medium text-gray-800">{listing.caseId}</td>

                                    {/* Seller */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">{listing.sellerName}</div>
                                        <div className="text-xs text-gray-400">{listing.sellerContact}</div>
                                        <span
                                            className={`mt-1 inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${toneClasses[listing.sellerTag.tone]}`}
                                        >
                                            {listing.sellerTag.label}
                                        </span>
                                    </td>

                                    {/* Listing */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">{listing.listingTitle}</div>
                                        <div className="text-xs text-gray-400">{listing.listingSubtitle}</div>
                                    </td>

                                    {/* Detection signal */}
                                    <td className="px-6 py-4">
                                        <div
                                            className={`inline-block rounded-md px-3 py-2 text-xs font-medium ${toneClasses[listing.detectionTone]}`}
                                        >
                                            • {listing.detectionSignal}
                                        </div>
                                    </td>

                                    {/* Risk score */}
                                    <td className="px-6 py-4">
                                        <RiskBadge score={listing.riskScore} level={listing.riskLevel} />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(listing.id)}
                                                className="inline-flex items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50"
                                                aria-label="View case"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>

                                            {listing.actionState === "verified" ? (
                                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                                                    <Check className="h-3.5 w-3.5" />
                                                    Verified
                                                </span>
                                            ) : listing.riskLevel === "high" ? (
                                                <button
                                                    onClick={() => handleRejectOrBan(listing.id)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                    Reject &amp; Ban
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleVerify(listing.id)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                    Not Verify
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                className="inline-flex items-center justify-center rounded-md border border-red-100 bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                                                aria-label="Delete case"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredListings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                                        No flagged listings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Inspection snapshot */}
                {selectedCase && (
                    <div className="mx-4 mb-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                            <div>
                                <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                                    INSPECTION SNAPSHOT FOR SELECTED CASE
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {selectedCase.caseId} · Content Duplicate (92%) · Abnormal Price (98%) · Velocity Spike (88%)
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                                Request ID Verification
                            </button>
                            <button className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50">
                                Reject Flag (False Positive)
                            </button>
                            <button className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700">
                                Confirm Scam &amp; Ban Seller
                            </button>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 p-5">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="flex items-center gap-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                    </button>

                    {pageNumbers.map((num) => (
                        <button
                            key={num}
                            onClick={() => setCurrentPage(num)}
                            className={`h-9 w-9 rounded-md border text-sm font-medium transition ${currentPage === num
                                    ? "border-amber-500 bg-amber-500 text-white"
                                    : "border-amber-300 text-amber-500 hover:bg-amber-50"
                                }`}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                        className="flex items-center gap-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}