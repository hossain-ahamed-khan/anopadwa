// redux/api/chatApi.ts
import { baseApi } from "@/redux/api/baseApi"; // adjust to your baseApi path
import type {
    ApiResponse,
    ChatMessage,
    ConversationDetail,
    ConversationsResult,
    ConversationSummary,
    MarkReadResult,
    MessagesResult,
    PaginationMeta,
    PaginationParams,
    SendMessagePayload,
    StartConversationPayload,
    StartedConversation,
} from "@/types/chat.types";

/**
 * Make sure your baseApi `tagTypes` includes:
 * ["Conversations", "Conversation", "Messages", "UnreadCount"]
 */
export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /chat/conversations
        startConversation: builder.mutation<
            StartedConversation,
            StartConversationPayload
        >({
            query: (body) => ({
                url: "/chat/conversations",
                method: "POST",
                body,
            }),
            transformResponse: (
                res: ApiResponse<{ conversation: StartedConversation }>,
            ) => res.data.conversation,
            invalidatesTags: ["Conversations", "UnreadCount"],
        }),

        // GET /chat/conversations
        getConversations: builder.query<
            ConversationsResult,
            PaginationParams | void
        >({
            query: (params) => ({
                url: "/chat/conversations",
                params: params ?? undefined,
            }),
            transformResponse: (
                res: ApiResponse<{ conversations: ConversationSummary[] }> & {
                    meta: PaginationMeta;
                },
            ) => ({
                conversations: res.data.conversations,
                meta: res.meta,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.conversations.map((c) => ({
                            type: "Conversations" as const,
                            id: c.id,
                        })),
                        { type: "Conversations" as const, id: "LIST" },
                    ]
                    : [{ type: "Conversations" as const, id: "LIST" }],
        }),

        // GET /chat/conversations/:id
        getConversation: builder.query<ConversationDetail, string>({
            query: (conversationId) => `/chat/conversations/${conversationId}`,
            transformResponse: (
                res: ApiResponse<{ conversation: ConversationDetail }>,
            ) => res.data.conversation,
            providesTags: (_r, _e, id) => [{ type: "Conversation", id }],
        }),

        // GET /chat/conversations/:id/messages
        getMessages: builder.query<
            MessagesResult,
            { conversationId: string } & PaginationParams
        >({
            query: ({ conversationId, ...params }) => ({
                url: `/chat/conversations/${conversationId}/messages`,
                params,
            }),
            transformResponse: (
                res: ApiResponse<{ messages: ChatMessage[] }> & {
                    meta: PaginationMeta;
                },
            ) => ({
                messages: res.data.messages,
                meta: res.meta,
            }),
            providesTags: (_r, _e, { conversationId }) => [
                { type: "Messages", id: conversationId },
            ],
        }),

        // POST /chat/conversations/:id/messages
        sendMessage: builder.mutation<ChatMessage, SendMessagePayload>({
            query: ({ conversationId, content }) => ({
                url: `/chat/conversations/${conversationId}/messages`,
                method: "POST",
                body: { content },
            }),
            transformResponse: (res: ApiResponse<{ message: ChatMessage }>) =>
                res.data.message,
            invalidatesTags: (_r, _e, { conversationId }) => [
                { type: "Messages", id: conversationId },
                { type: "Conversations", id: "LIST" },
                { type: "Conversations", id: conversationId },
            ],
        }),

        // GET /chat/unread-count
        getUnreadCount: builder.query<number, void>({
            query: () => "/chat/unread-count",
            transformResponse: (res: ApiResponse<{ unreadCount: number }>) =>
                res.data.unreadCount,
            providesTags: ["UnreadCount"],
        }),

        // Mark conversation as read: /chat/conversations/:id/read
        // NOTE: change method to "POST" if your backend expects POST.
        markConversationRead: builder.mutation<MarkReadResult, string>({
            query: (conversationId) => ({
                url: `/chat/conversations/${conversationId}/read`,
                method: "PATCH",
            }),
            transformResponse: (res: ApiResponse<MarkReadResult>) => res.data,
            invalidatesTags: (_r, _e, conversationId) => [
                "UnreadCount",
                { type: "Conversations", id: "LIST" },
                { type: "Conversations", id: conversationId },
                { type: "Messages", id: conversationId },
            ],
        }),
    }),
});

export const {
    useStartConversationMutation,
    useGetConversationsQuery,
    useGetConversationQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useGetUnreadCountQuery,
    useMarkConversationReadMutation,
} = chatApi;