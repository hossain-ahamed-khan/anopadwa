"use client";

import { useMemo, useState } from "react";
import { Search, Check, Ban, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

type UserType = "buyer" | "seller";

type DocStatus = "none" | "requested" | "sent";

interface ManagedUser {
    id: string;
    slNo: string;
    fullName: string;
    email: string;
    registrationDate: string;
    type: UserType;
    docStatus: DocStatus;
    documentUrl?: string;
    isVerified: boolean;
}

const MOCK_USERS: ManagedUser[] = [
    { id: "1", slNo: "#1233", fullName: "Kathryn Murp", email: "bockely@att.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "none", isVerified: false },
    { id: "2", slNo: "#1233", fullName: "Devon Lane", email: "csilvers@rizon.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "none", isVerified: true },
    { id: "3", slNo: "#1233", fullName: "Foysal Rahman", email: "qamaho@mail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "none", isVerified: true },
    { id: "4", slNo: "#1233", fullName: "Hari Danang", email: "xterris@gmail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "sent", documentUrl: "#", isVerified: false },
    { id: "5", slNo: "#1233", fullName: "Floyd Miles", email: "xterris@gmail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "sent", documentUrl: "#", isVerified: false },
    { id: "6", slNo: "#1233", fullName: "Eleanor Pena", email: "xterris@gmail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "sent", documentUrl: "#", isVerified: true },
    { id: "7", slNo: "#1233", fullName: "Devon Lane", email: "xterris@gmail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "sent", documentUrl: "#", isVerified: false },
    { id: "8", slNo: "#1233", fullName: "Hari Danang", email: "xterris@gmail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "sent", documentUrl: "#", isVerified: true },
    { id: "9", slNo: "#1233", fullName: "Devon Lane", email: "xterris@gmail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "sent", documentUrl: "#", isVerified: false },
    { id: "10", slNo: "#1233", fullName: "Hari Danang", email: "xterris@gmail.com", registrationDate: "22 Nov 2022", type: "seller", docStatus: "none", isVerified: false },
];

const PAGE_SIZE = 10;
const TOTAL_PAGES = 3;

export default function UserManagementTable() {
    const [activeTab, setActiveTab] = useState<UserType>("seller");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(3);
    const [users, setUsers] = useState<ManagedUser[]>(MOCK_USERS);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesTab = user.type === activeTab;
            const q = searchQuery.trim().toLowerCase();
            const matchesQuery =
                q === "" ||
                user.email.toLowerCase().includes(q) ||
                user.fullName.toLowerCase().includes(q);
            return matchesTab && matchesQuery;
        });
    }, [users, activeTab, searchQuery]);

    const handleSearch = () => setSearchQuery(searchTerm);

    const handleRequestDocs = (id: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, docStatus: "sent" } : u))
        );
    };

    const handleVerify = (id: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, isVerified: !u.isVerified } : u))
        );
    };

    const handleBan = (id: string) => {
        // eslint-disable-next-line no-console
        console.log("Ban/suspend user", id);
    };

    const handleDelete = (id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white shadow-sm">
                {/* Search bar */}
                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                    <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search by email or name"
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

                {/* Tabs */}
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <button
                        onClick={() => {
                            setActiveTab("buyer");
                            setCurrentPage(1);
                        }}
                        className={`py-4 text-sm font-medium transition ${activeTab === "buyer"
                                ? "bg-gray-100 text-gray-900"
                                : "bg-white text-gray-400 hover:bg-gray-50"
                            }`}
                    >
                        Buyers
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("seller");
                            setCurrentPage(1);
                        }}
                        className={`py-4 text-sm font-semibold transition ${activeTab === "seller"
                                ? "bg-gray-100 text-gray-900"
                                : "bg-white text-gray-400 hover:bg-gray-50"
                            }`}
                    >
                        Seller
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="text-left text-sm text-gray-700">
                                <th className="px-6 py-4 font-semibold">SL no.</th>
                                <th className="px-6 py-4 font-semibold">Full Name</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Registration Date</th>
                                <th className="px-6 py-4 font-semibold">Business Documentation</th>
                                <th className="px-6 py-4 font-semibold">View Documents</th>
                                <th className="px-6 py-4 font-semibold">More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-t border-gray-50 text-sm text-gray-700">
                                    <td className="px-6 py-4">{user.slNo}</td>
                                    <td className="px-6 py-4">{user.fullName}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.registrationDate}</td>

                                    {/* Business Documentation */}
                                    <td className="px-6 py-4">
                                        {user.docStatus === "sent" ? (
                                            <span className="inline-flex rounded-md bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-600">
                                                Request Sent
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleRequestDocs(user.id)}
                                                className="rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Request
                                            </button>
                                        )}
                                    </td>

                                    {/* View Documents */}
                                    <td className="px-6 py-4">
                                        {user.docStatus === "sent" && (
                                            <a
                                                href={user.documentUrl ?? "#"}
                                                className="inline-block rounded-md border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                            >
                                                View
                                            </a>
                                        )}
                                    </td>

                                    {/* More actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVerify(user.id)}
                                                className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition ${user.isVerified
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                {user.isVerified ? "Verified" : "Verify"}
                                            </button>
                                            <button
                                                onClick={() => handleBan(user.id)}
                                                className="inline-flex items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50"
                                                aria-label="Suspend user"
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="inline-flex items-center justify-center rounded-md border border-red-100 bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                                                aria-label="Delete user"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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