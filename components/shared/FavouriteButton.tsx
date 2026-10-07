"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddFavouriteMutation } from "@/redux/features/addFavourite/addFavourite";

type FavouriteButtonProps = {
    listingId: string;
    className?: string;
    size?: "small" | "large";
};

function getErrorMessage(error: unknown): string {
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

    return "Unable to add this listing to favourites. Please try again.";
}

export default function FavouriteButton({
    listingId,
    className = "",
    size = "small",
}: FavouriteButtonProps) {
    const [addFavourite, { isLoading }] = useAddFavouriteMutation();
    const [isFavourited, setIsFavourited] = useState(false);
    const isLarge = size === "large";

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (isLoading) return;

        try {
            const response = await addFavourite(listingId).unwrap();
            setIsFavourited(true);
            toast.success(response.data.message || "Added to favourites");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            aria-label={
                isLoading
                    ? "Adding to favourites"
                    : isFavourited
                      ? "Added to favourites"
                      : "Add to favourites"
            }
            aria-pressed={isFavourited}
            className={`flex items-center justify-center rounded-full bg-white/95 shadow-sm transition disabled:cursor-wait disabled:opacity-60 ${isFavourited ? "text-red-500 hover:text-red-600" : "text-emerald-800 hover:text-emerald-600"} ${isLarge ? "h-11 w-11" : "h-9 w-9"} ${className}`}
        >
            <Heart
                className={`${isLarge ? "h-5 w-5" : "h-4 w-4"} ${isFavourited ? "fill-current" : ""}`}
                aria-hidden
            />
        </button>
    );
}
