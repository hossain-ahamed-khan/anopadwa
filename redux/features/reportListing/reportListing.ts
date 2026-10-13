import { baseApi } from "@/redux/api/baseApi";

export const reportReasons = [
    { value: "fraudulent", label: "Fraudulent listing or seller scam" },
    { value: "misleading", label: "Misleading description, condition, or price" },
    { value: "duplicate", label: "Duplicate listing" },
    { value: "prohibited", label: "Prohibited or illegal item" },
    { value: "item_unavailable", label: "Item no longer available or already sold" },
    { value: "other", label: "Other concern" },
] as const;

export type ReportReason = (typeof reportReasons)[number]["value"];

export type ReportListingRequest = {
    listingId: string;
    reason: ReportReason;
    details?: string;
};

export type ReportListingResponse = {
    success: boolean;
    data: {
        report: {
            id: string;
            listingId: string;
            reporterUserId: string;
            reason: ReportReason;
            details: string | null;
            status: string;
            createdAt: string;
        };
        message: string;
    };
};

const reportListingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        reportListing: builder.mutation<ReportListingResponse, ReportListingRequest>({
            query: ({ listingId, reason, details }) => ({
                url: `/listings/${listingId}/report`,
                method: "POST",
                body: { reason, ...(details ? { details } : {}) },
            }),
        }),
    }),
});

export const { useReportListingMutation } = reportListingApi;
