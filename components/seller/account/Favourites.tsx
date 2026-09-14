"use client";

import { useState } from "react";
import Image from "next/image";

type FavouriteItem = {
    id: string;
    thumbnail: string;
    title: string;
    details: string;
    seller: string;
    price: string;
};

const favourites: FavouriteItem[] = Array.from({ length: 3 }, (_, index) => ({
    id: `favourite-${index}`,
    thumbnail: "/image/product-image.png",
    title: "T-shirts with multiple colors, for men and lady",
    details: "Size: medium, Color: blue,  Material: Plastic",
    seller: "Artel Market",
    price: "₵78.99",
}));

export default function FavouritesView() {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
        setSelectedItems(allSelected ? [] : favourites.map((item) => item.id));
    };

    const handleDelete = () => {
        // TODO: call your remove-favourite mutation for selectedItems
        setSelectedItems([]);
    };

    return (
        <section className="rounded-xl bg-white px-5 shadow-sm">
            <div className="flex min-h-13 items-center justify-between border-b border-slate-200 gap-4">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="h-4 w-4 accent-emerald-600"
                        aria-label="Select all favourites"
                    />
                    Select All ({selectedItems.length} Items)
                </label>

                {selectedItems.length > 0 && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-md bg-red-50 px-5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                    >
                        Delete
                    </button>
                )}
            </div>

            <div>
                {favourites.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-400">
                        You haven&apos;t saved any favourites yet.
                    </p>
                ) : (
                    favourites.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-b-0 sm:gap-5"
                        >
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItem(item.id)}
                                className="h-4 w-4 shrink-0 accent-emerald-600"
                                aria-label={`Select ${item.title}`}
                            />
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                                <Image
                                    src={item.thumbnail}
                                    alt={item.title}
                                    fill
                                    sizes="80px"
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="min-w-0 flex-1 text-sm">
                                <h2 className="truncate font-semibold text-slate-800">
                                    {item.title}
                                </h2>
                                <p className="mt-1 truncate text-slate-400">{item.details}</p>
                                <p className="mt-1 text-slate-400">Seller: {item.seller}</p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-slate-800">
                                {item.price}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}