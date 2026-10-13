"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Send, Star, UserCircle } from "lucide-react";
import { toast } from "sonner";
import {
    useCreateReviewMutation,
    useGetSellerReviewsQuery,
    useReplyToReviewMutation,
    type SellerReview,
} from "@/redux/features/reviews/reviewsApi";

type SellerFeedbackProps = {
    sellerId: string;
    sellerName: string;
    canReply: boolean;
    onBack: () => void;
};

type ApiError = {
    data?: {
        error?: { message?: string };
        message?: string;
    };
};

function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        return apiError.data?.error?.message ?? apiError.data?.message ?? fallback;
    }
    return fallback;
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function Stars({ rating }: { rating: number }) {
    return (
        <span className="flex items-center gap-0.5 text-amber-500" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    className={`h-4 w-4 ${index < rating ? "fill-current" : "text-slate-300"}`}
                />
            ))}
        </span>
    );
}

function ReviewCard({
    review,
    sellerName,
    canReply,
}: {
    review: SellerReview;
    sellerName: string;
    canReply: boolean;
}) {
    const [reply, setReply] = useState("");
    const [showReply, setShowReply] = useState(false);
    const [replyToReview, { isLoading }] = useReplyToReviewMutation();

    const handleReply = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = reply.trim();
        if (!value) {
            toast.error("Please write a reply.");
            return;
        }

        try {
            await replyToReview({ reviewId: review.id, reply: value }).unwrap();
            toast.success("Reply added successfully.");
            setReply("");
            setShowReply(false);
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to add your reply."));
        }
    };

    return (
        <article className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3">
                {review.reviewer.profilePhotoUrl ? (
                    <Image
                        src={review.reviewer.profilePhotoUrl}
                        alt={review.reviewer.fullName}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <UserCircle className="h-10 w-10 shrink-0 text-slate-300" />
                )}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">{review.reviewer.fullName}</p>
                        <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                    </div>
                    <Stars rating={review.rating} />
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                    {review.sellerReply && (
                        <div className="mt-3 rounded-lg bg-emerald-50 px-3.5 py-3">
                            <p className="text-xs font-semibold text-emerald-800">{sellerName}&apos;s reply</p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">{review.sellerReply}</p>
                        </div>
                    )}
                    {canReply && !review.sellerReply && (
                        <>
                            {!showReply && (
                                <button
                                    type="button"
                                    onClick={() => setShowReply(true)}
                                    className="mt-3 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                                >
                                    Reply to this review
                                </button>
                            )}
                            {showReply && (
                                <form onSubmit={handleReply} className="mt-3 flex gap-2">
                                    <input
                                        value={reply}
                                        onChange={(event) => setReply(event.target.value)}
                                        maxLength={1000}
                                        placeholder="Write a reply..."
                                        disabled={isLoading}
                                        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        aria-label="Send reply"
                                        className="rounded-lg bg-emerald-600 px-3 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function SellerFeedback({
    sellerId,
    sellerName,
    canReply,
    onBack,
}: SellerFeedbackProps) {
    const { data, isLoading, isError, refetch } = useGetSellerReviewsQuery(sellerId);
    const [comment, setComment] = useState("");
    const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
    const reviewData = data?.data;
    const breakdown = reviewData?.breakdown ?? { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = comment.trim();
        if (!value) {
            toast.error("Please write your feedback.");
            return;
        }

        try {
            await createReview({ sellerId, comment: value }).unwrap();
            toast.success("Your feedback was submitted successfully.");
            setComment("");
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to submit your feedback."));
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f4f4]">
            <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                    <button type="button" onClick={onBack} className="hover:text-slate-700">Home</button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <button type="button" onClick={onBack} className="hover:text-slate-700">Listing</button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-emerald-700">Feedback</span>
                </nav>

                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <header className="border-b border-slate-200 px-5 py-5 sm:px-6">
                        <h1 className="text-lg font-semibold text-slate-900">
                            Feedback about <span className="text-emerald-600">{sellerName}</span>
                        </h1>
                        {isLoading ? (
                            <p className="mt-2 text-sm text-slate-500">Loading feedback...</p>
                        ) : isError ? (
                            <div className="mt-2 flex items-center gap-3 text-sm text-red-600">
                                <span>Could not load feedback.</span>
                                <button type="button" onClick={refetch} className="font-semibold underline">Try again</button>
                            </div>
                        ) : (
                            <div className="mt-4 flex flex-wrap items-center gap-5">
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">{reviewData?.avgRating?.toFixed(1) ?? "0.0"}</p>
                                    <Stars rating={Math.round(reviewData?.avgRating ?? 0)} />
                                    <p className="mt-1 text-xs text-slate-500">{reviewData?.reviewCount ?? 0} reviews</p>
                                </div>
                                <div className="min-w-[220px] flex-1 space-y-1.5">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = breakdown[String(rating) as keyof typeof breakdown];
                                        const total = reviewData?.reviewCount ?? 0;
                                        const percentage = total ? (count / total) * 100 : 0;
                                        return (
                                            <div key={rating} className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="w-8">{rating} star</span>
                                                <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                                                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${percentage}%` }} />
                                                </div>
                                                <span className="w-5 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </header>

                    <div className="space-y-5 px-5 py-5 sm:px-6">
                        <form onSubmit={handleSubmit} className="rounded-lg bg-slate-50 p-4">
                            <label htmlFor="seller-feedback" className="block text-sm font-semibold text-slate-800">
                                Write your feedback
                            </label>
                            <textarea
                                id="seller-feedback"
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                maxLength={1000}
                                rows={3}
                                placeholder="Share your experience with this seller..."
                                disabled={isSubmitting}
                                className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-slate-100"
                            />
                            <div className="mt-2 flex items-center justify-between gap-3">
                                <span className="text-xs text-slate-400">{comment.length}/1000</span>
                                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isSubmitting ? "Submitting..." : "Submit feedback"}
                                </button>
                            </div>
                        </form>

                        <div>
                            <h2 className="mb-4 text-sm font-semibold text-slate-900">All feedback</h2>
                            {isLoading ? (
                                <p className="text-sm text-slate-500">Loading reviews...</p>
                            ) : reviewData?.reviews.length ? (
                                <div className="space-y-5">
                                    {reviewData.reviews.map((review) => (
                                        <ReviewCard key={review.id} review={review} sellerName={sellerName} canReply={canReply} />
                                    ))}
                                </div>
                            ) : (
                                <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                                    No feedback yet. Be the first to share your experience.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
