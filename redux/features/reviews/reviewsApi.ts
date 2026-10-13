import { baseApi } from "@/redux/api/baseApi";

export type SellerReview = {
    id: string;
    sellerId: string;
    reviewerId: string;
    rating: number;
    comment: string;
    sellerReply: string | null;
    createdAt: string;
    reviewer: {
        id: string;
        fullName: string;
        profilePhotoUrl: string | null;
    };
};

export type SellerReviewsResponse = {
    success: boolean;
    data: {
        avgRating: number;
        reviewCount: number;
        breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
        reviews: SellerReview[];
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type CreateReviewRequest = {
    sellerId: string;
    comment: string;
};

export type ReplyToReviewRequest = {
    reviewId: string;
    reply: string;
};

const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSellerReviews: builder.query<SellerReviewsResponse, string>({
            query: (sellerId) => `/sellers/${sellerId}/reviews`,
            providesTags: (_result, _error, sellerId) => [
                { type: "Profile", id: `REVIEWS-${sellerId}` },
            ],
        }),
        createReview: builder.mutation<unknown, CreateReviewRequest>({
            query: ({ sellerId, comment }) => ({
                url: `/sellers/${sellerId}/reviews`,
                method: "POST",
                body: { comment },
            }),
            invalidatesTags: (_result, _error, { sellerId }) => [
                { type: "Profile", id: `REVIEWS-${sellerId}` },
            ],
        }),
        replyToReview: builder.mutation<unknown, ReplyToReviewRequest>({
            query: ({ reviewId, reply }) => ({
                url: `/reviews/${reviewId}/reply`,
                method: "POST",
                body: { reply },
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useGetSellerReviewsQuery,
    useCreateReviewMutation,
    useReplyToReviewMutation,
} = reviewsApi;
