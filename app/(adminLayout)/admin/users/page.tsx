"use client";

import { useState } from "react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Loader2,
    Search,
    ShieldCheck,
    ShieldOff,
    X,
} from "lucide-react";
import { toast } from "sonner";
import {
    AdminUser,
    useActivateAdminUserMutation,
    useDeactivateAdminUserMutation,
    useGetAdminUserDocumentsQuery,
    useGetAdminUserQuery,
    useGetAdminUsersQuery,
    useRejectAdminUserDocumentMutation,
    useReactivateAdminSellerMutation,
    useSuspendAdminSellerMutation,
    useVerifyAdminUserDocumentMutation,
} from "@/redux/features/admin/adminApi";

type UserType = "buyer" | "seller";

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
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

export default function UserManagementTable() {
    const [activeTab, setActiveTab] = useState<UserType>("seller");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [actionUserId, setActionUserId] = useState<string | null>(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetAdminUsersQuery({ page: currentPage, limit: 20, search: searchQuery });
    const { data: selectedUser, isLoading: isLoadingDetails } = useGetAdminUserQuery(
        selectedUserId ?? "",
        { skip: !selectedUserId },
    );
    const [activateUser] = useActivateAdminUserMutation();
    const [deactivateUser] = useDeactivateAdminUserMutation();
    const [suspendSeller] = useSuspendAdminSellerMutation();
    const [reactivateSeller] = useReactivateAdminSellerMutation();

    const users = (data?.data.users ?? []).filter((user) =>
        activeTab === "seller" ? user.isSeller : !user.isSeller,
    );
    const totalPages = data?.meta.totalPages ?? 1;

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchQuery(searchTerm.trim());
    };

    const runAction = async (
        user: AdminUser,
        action: () => Promise<{ data: { message: string } }>,
    ) => {
        if (actionUserId) return;

        setActionUserId(user.id);
        try {
            const response = await action();
            toast.success(response.data.message);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to update this account."));
        } finally {
            setActionUserId(null);
        }
    };

    const handleAccountStatus = (user: AdminUser) => {
        return runAction(user, () =>
            user.isActive ? deactivateUser(user.id).unwrap() : activateUser(user.id).unwrap(),
        );
    };

    const handleSellerStatus = (user: AdminUser) => {
        const sellerProfile = user.sellerProfile;
        if (!sellerProfile) return;

        return runAction(user, () =>
            sellerProfile.accountStatus === "suspended"
                ? reactivateSeller(user.id).unwrap()
                : suspendSeller(user.id).unwrap(),
        );
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                    <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                            placeholder="Search by email or name"
                            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                        Search
                    </button>
                </div>

                <div className="grid grid-cols-2 border-b border-gray-100">
                    {(["buyer", "seller"] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`py-4 text-sm font-semibold capitalize transition ${
                                activeTab === tab
                                    ? "bg-gray-100 text-gray-900"
                                    : "bg-white text-gray-400 hover:bg-gray-50"
                            }`}
                        >
                            {tab}s
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="px-6 py-16 text-center text-sm text-gray-500">
                        Loading users...
                    </div>
                ) : isError ? (
                    <div className="px-6 py-16 text-center">
                        <p className="text-sm font-medium text-red-600">Unable to load users.</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] border-collapse">
                            <thead>
                                <tr className="text-left text-sm text-gray-700">
                                    <th className="px-6 py-4 font-semibold">SL no.</th>
                                    <th className="px-6 py-4 font-semibold">Full Name</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Registration Date</th>
                                    <th className="px-6 py-4 font-semibold">Account</th>
                                    {activeTab === "seller" && (
                                        <th className="px-6 py-4 font-semibold">Seller account</th>
                                    )}
                                    {activeTab === "seller" && (
                                        <th className="px-6 py-4 font-semibold">Document</th>
                                    )}
                                    <th className="px-6 py-4 font-semibold">More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    const isActing = actionUserId === user.id;
                                    return (
                                        <tr
                                            key={user.id}
                                            className="border-t border-gray-50 text-sm text-gray-700"
                                        >
                                            <td className="px-6 py-4">
                                                {(currentPage - 1) * (data?.meta.limit ?? 20) + index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium">{user.fullName}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{formatDate(user.createdAt)}                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.isActive ? "active" : "inactive"}
                                                    disabled={isActing}
                                                    onChange={() => handleAccountStatus(user)}
                                                    aria-label={`Change account status for ${user.fullName}`}
                                                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-wait disabled:opacity-60 ${
                                                        user.isActive
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                            : "border-red-200 bg-red-50 text-red-600"
                                                    }`}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </td>
                                            {activeTab === "seller" && (
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={
                                                            user.sellerProfile?.accountStatus === "suspended"
                                                                ? "suspended"
                                                                : "active"
                                                        }
                                                        disabled={isActing || !user.sellerProfile}
                                                        onChange={() => handleSellerStatus(user)}
                                                        aria-label={`Change seller status for ${user.fullName}`}
                                                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                                                            user.sellerProfile?.accountStatus === "suspended"
                                                                ? "border-red-200 bg-red-50 text-red-600"
                                                                : "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                        }`}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                </td>
                                            )}
                                            {activeTab === "seller" && (
                                                <td className="px-6 py-4">
                                                    <DocumentCell userId={user.id} />
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedUserId(user.id)}
                                                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        View
                                                    </button>
                                                    {user.isEmailVerified && (
                                                        <Check
                                                            className="h-4 w-4 text-emerald-500"
                                                            aria-label="Email verified"
                                                        />
                                                    )}
                                                    {user.sellerProfile?.accountStatus === "suspended" ? (
                                                        <ShieldOff
                                                            className="h-4 w-4 text-red-500"
                                                            aria-label="Seller suspended"
                                                        />
                                                    ) : (
                                                        <ShieldCheck
                                                            className="h-4 w-4 text-emerald-500"
                                                            aria-label="Seller active"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={activeTab === "seller" ? 8 : 6} className="px-6 py-10 text-center text-sm text-gray-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 p-5">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        className="flex items-center gap-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                    </button>
                    <span className="px-3 text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        className="flex items-center gap-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {selectedUserId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">User details</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Detailed information from the admin user endpoint.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedUserId(null)}
                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                                aria-label="Close user details"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {isLoadingDetails || !selectedUser ? (
                            <p className="py-12 text-center text-sm text-gray-500">
                                Loading user details...
                            </p>
                        ) : (
                            <div className="mt-6 space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Detail label="Full name" value={selectedUser.fullName} />
                                    <Detail label="Email" value={selectedUser.email} />
                                    <Detail label="Phone" value={selectedUser.phone} />
                                    <Detail label="Registered" value={formatDate(selectedUser.createdAt)} />
                                    <Detail
                                        label="Account status"
                                        value={selectedUser.isActive ? "Active" : "Inactive"}
                                    />
                                    <Detail
                                        label="Listings"
                                        value={String(selectedUser._count.listings)}
                                    />
                                </div>
                                {selectedUser.sellerProfile && (
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <h3 className="font-semibold text-gray-900">Seller profile</h3>
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            <Detail label="Store" value={selectedUser.sellerProfile.storeName} />
                                            <Detail label="Type" value={selectedUser.sellerProfile.sellerType} />
                                            <Detail
                                                label="Status"
                                                value={selectedUser.sellerProfile.accountStatus}
                                            />
                                            <Detail
                                                label="Verified"
                                                value={selectedUser.sellerProfile.isVerified ? "Yes" : "No"}
                                            />
                                        </div>
                                    </div>
                                )}
                                {selectedUser.businessDocuments.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Business documents</h3>
                                        <div className="mt-2 space-y-2">
                                            {selectedUser.businessDocuments.map((document) => (
                                                <a
                                                    key={document.id}
                                                    href={document.documentUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm text-amber-600 hover:bg-amber-50"
                                                >
                                                    <span>Document ({document.status})</span>
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-1 text-sm text-gray-800">{value}</p>
        </div>
    );
}

function DocumentCell({ userId }: { userId: string }) {
    const { data: documents, isLoading, isError } = useGetAdminUserDocumentsQuery(userId);
    const [verifyDocument, { isLoading: isVerifying }] = useVerifyAdminUserDocumentMutation();
    const [rejectDocument, { isLoading: isRejecting }] = useRejectAdminUserDocumentMutation();
    const [isActioning, setIsActioning] = useState(false);
    const document = documents?.[0];

    const handleVerify = async () => {
        if (isActioning) return;

        setIsActioning(true);
        try {
            const response = await verifyDocument(userId).unwrap();
            toast.success(response.data.message);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to verify this document."));
        } finally {
            setIsActioning(false);
        }
    };

    const handleReject = async () => {
        if (isActioning) return;

        const reason = window.prompt("Why is this document being rejected?");
        if (!reason?.trim()) return;

        setIsActioning(true);
        try {
            const response = await rejectDocument({
                id: userId,
                reason: reason.trim(),
            }).unwrap();
            toast.success(response.data.message);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to reject this document."));
        } finally {
            setIsActioning(false);
        }
    };

    if (isLoading) {
        return <Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-label="Loading document" />;
    }

    if (isError) {
        return <span className="text-xs text-red-500">Unable to load</span>;
    }

    if (!document) {
        return <span className="text-xs text-gray-400">Not submitted</span>;
    }

    const statusClass =
        document.status === "verified"
            ? "bg-emerald-50 text-emerald-600"
            : document.status === "rejected"
              ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-600";

    return (
        <div className="flex min-w-[190px] flex-col items-start gap-2">
            <a
                href={document.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700"
            >
                <FileText className="h-3.5 w-3.5" />
                View document
            </a>
            <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${statusClass}`}>
                {document.status}
            </span>
            {document.status === "submitted" && (
                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={isActioning || isVerifying || isRejecting}
                        onClick={handleVerify}
                        className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                    >
                        Verify
                    </button>
                    <button
                        type="button"
                        disabled={isActioning || isVerifying || isRejecting}
                        onClick={handleReject}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}
