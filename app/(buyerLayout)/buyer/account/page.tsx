"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
    Heart,
    LayoutDashboard,
    LogOut,
    MessageSquare,
} from "lucide-react";
import productImage from "@/public/image/product-image.png";
import MessagesPage from "@/components/buyer/chat/Message";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import {
    useGetMyProfileApiQuery,
    useGetConversationListApiQuery,
    type UserProfile,
} from "@/redux/features/buyer/myAccount";
import {
    useGetFavouritesQuery,
    type Favourite,
} from "@/redux/features/addFavourite/getFavourite";
import { useDeleteFavouriteMutation } from "@/redux/features/addFavourite/deleteFavourite";

type FavouriteCardData = {
    id: string;
    listingId: string;
    title: string;
    details: string;
    seller: string;
    price: string;
    image: string | null;
};

const toFavouriteCard = (item: Favourite): FavouriteCardData => ({
    id: item.id,
    listingId: item.listing.id,
    title: item.listing.title,
    details: `${item.listing.condition} · ${item.listing.description}`,
    seller: item.listing.seller.fullName,
    price: item.listing.price
        ? `${item.listing.currency} ${item.listing.price}`
        : "",
    image: item.listing.images[0]?.imageUrl ?? null,
});

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

const formatProfileValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") {
        return "Not provided";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};

const formatProfileLabel = (key: string) =>
    key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (character) => character.toUpperCase());

function ProfileDetails({ profile }: { profile: UserProfile }) {
    const profileFields = Object.entries(profile).filter(
        ([key]) => key !== "profilePhotoUrl" && key !== "sellerProfile",
    );
    const sellerFields = profile.sellerProfile
        ? Object.entries(profile.sellerProfile)
        : [];

    return (
        <div className="mt-5 rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold">Profile information</h2>
            <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {profileFields.map(([key, value]) => (
                    <div key={key} className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {formatProfileLabel(key)}
                        </p>
                        <p className="mt-1 wrap-break-word text-sm text-slate-700">
                            {formatProfileValue(value)}
                        </p>
                    </div>
                ))}
            </div>

            {sellerFields.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                    <h3 className="text-sm font-bold text-slate-800">Seller profile</h3>
                    <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                        {sellerFields.map(([key, value]) => (
                            <div key={key} className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    {formatProfileLabel(key)}
                                </p>
                                <p className="mt-1 wrap-break-word text-sm text-slate-700">
                                    {formatProfileValue(value)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function FavouritesView() {
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useGetFavouritesQuery(
        undefined,
        { refetchOnMountOrArgChange: true },
    );
    const [deleteFavourite, { isLoading: isDeleting }] =
        useDeleteFavouriteMutation();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const favourites = (data?.data.favourites ?? []).map(toFavouriteCard);
    const allSelected =
        favourites.length > 0 && selectedItems.length === favourites.length;

    const toggleItem = (id: string) => {
        setSelectedItems((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id],
        );
    };

    const toggleAll = () => {
        setSelectedItems(
            allSelected ? [] : favourites.map((item) => item.listingId),
        );
    };

    const handleDelete = async () => {
        if (selectedItems.length === 0 || isDeleting) {
            return;
        }

        try {
            await Promise.all(
                selectedItems.map((listingId) =>
                    deleteFavourite(listingId).unwrap(),
                ),
            );
            setSelectedItems([]);
            await refetch();
            toast.success("Removed from favourites");
        } catch {
            toast.error("Unable to remove the selected favourites. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <section className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm sm:px-5">
                {Array.from({ length: 3 }, (_, index) => (
                    <div
                        key={index}
                        className="flex animate-pulse items-center gap-4 border-b border-slate-100 py-4 last:border-b-0"
                    >
                        <div className="h-4 w-4 rounded bg-slate-200" />
                        <div className="h-20 w-20 rounded-md bg-slate-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 rounded bg-slate-200" />
                            <div className="h-3 w-1/2 rounded bg-slate-100" />
                            <div className="h-3 w-1/3 rounded bg-slate-100" />
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    if (isError) {
        return (
            <section className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-16 text-center shadow-sm">
                <p className="text-sm text-slate-500">Failed to load your favourites.</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="rounded-md bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                    Try again
                </button>
            </section>
        );
    }

    if (favourites.length === 0) {
        return (
            <section className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-16 text-center shadow-sm">
                <Heart className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-700">No favourites yet</p>
                <p className="text-xs text-slate-400">
                    Items you save will show up here.
                </p>
            </section>
        );
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm sm:px-5">
            <div className="flex min-h-13 items-center justify-between border-b border-slate-200 gap-4">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="h-4 w-4 accent-emerald-600"
                        aria-label="Select all favourites"
                    />
                    Select All ({data?.meta.total ?? favourites.length} Items)
                </label>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={selectedItems.length === 0 || isDeleting}
                    className="rounded-md bg-red-50 px-5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>

            <div>
                {favourites.map((item) => (
                    <div
                        key={item.id}
                        role="link"
                        tabIndex={0}
                        onClick={() => router.push(`/buyer/product/${item.listingId}`)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                router.push(`/buyer/product/${item.listingId}`);
                            }
                        }}
                        className="flex cursor-pointer items-center gap-3 border-b border-slate-100 py-4 last:border-b-0 hover:bg-slate-50 sm:gap-5"
                    >
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.listingId)}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggleItem(item.listingId)}
                            className="h-4 w-4 shrink-0 accent-emerald-600"
                            aria-label={`Select ${item.title}`}
                        />
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                            <Image
                                src={item.image ?? productImage}
                                alt={item.title}
                                fill
                                sizes="80px"
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="min-w-0 flex-1 text-sm">
                            <h2 className="truncate font-medium text-slate-800">{item.title}</h2>
                            {item.details && (
                                <p className="mt-1 truncate text-slate-400">{item.details}</p>
                            )}
                            <p className="mt-1 text-slate-400">Seller: {item.seller}</p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-slate-800">{item.price}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function AccountPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [activeView, setActiveView] = useState<"dashboard" | "favourites" | "chat">("dashboard");

    const {
        data: profile,
        isLoading: isProfileLoading,
        isError: isProfileError,
    } = useGetMyProfileApiQuery();
    const { data: conversations } = useGetConversationListApiQuery();

    const conversationCount = conversations?.meta.total ?? 0;

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Log out?",
            text: "Are you sure you want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
        router.replace("/login");
        toast.success("Logged out successfully");
    };

    return (
        <div className="flex min-h-screen flex-col">
            <main className="w-full flex-1 bg-[#f5f6f7] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <aside className="flex min-h-155 flex-col rounded-xl bg-white p-5 shadow-sm">
                        <h1 className="mb-8 text-base font-bold">Profile</h1>

                        <nav className="space-y-2" aria-label="Account navigation">
                            <button
                                type="button"
                                onClick={() => setActiveView("dashboard")}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${activeView === "dashboard"
                                    ? "bg-[#e7f1ed] text-emerald-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveView("favourites")}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${activeView === "favourites"
                                    ? "bg-[#e7f1ed] text-emerald-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <Heart className="h-4 w-4" />
                                Favourites
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveView("chat")}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${activeView === "chat"
                                    ? "bg-[#e7f1ed] text-emerald-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <MessageSquare className="h-4 w-4" />
                                    Chat
                                </span>
                                {conversationCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
                                        {conversationCount > 99 ? "99+" : conversationCount}
                                    </span>
                                )}
                            </button>
                        </nav>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-auto flex items-center gap-3 border-t border-slate-100 px-3 pt-6 text-sm font-semibold text-red-600 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </aside>

                    {activeView === "favourites" ? <FavouritesView /> : activeView === "chat" ? <MessagesPage /> : <section className="min-w-0">
                        <div className="flex items-center gap-4 rounded-xl bg-white px-5 py-5 shadow-sm sm:px-6">
                            {isProfileLoading ? (
                                <>
                                    <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                                        <div className="h-3 w-52 animate-pulse rounded bg-slate-100" />
                                    </div>
                                </>
                            ) : isProfileError || !profile ? (
                                <p className="text-sm text-slate-500">
                                    Couldn&apos;t load your profile. Please refresh the page.
                                </p>
                            ) : (
                                <>
                                    {profile.profilePhotoUrl ? (
                                        <Image
                                            src={profile.profilePhotoUrl}
                                            alt={profile.fullName}
                                            width={56}
                                            height={56}
                                            className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-[#e7f1ed] text-base font-bold text-emerald-700">
                                            {getInitials(profile.fullName)}
                                        </span>
                                    )}
                                    <div className="min-w-0">
                                        <h2 className="truncate text-base font-bold">{profile.fullName}</h2>
                                        <p className="mt-1 truncate text-sm text-slate-500">
                                            <span className="font-semibold text-slate-700">Email:</span>{" "}
                                            {profile.email}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {!isProfileLoading && !isProfileError && profile && (
                            <ProfileDetails profile={profile} />
                        )}

                    </section>}
                </div>
            </main>
        </div>
    );
}