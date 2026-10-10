// types/chat.types.ts

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface ChatUser {
    id: string;
    fullName: string;
    profilePhotoUrl: string | null;
}

export interface ChatCounterpart extends ChatUser {
    isOnline: boolean;
}

export interface ChatListing {
    id: string;
    title: string;
    price: string;
    currency: string;
    category: string;
    image: string;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    sentAt: string;
    readAt: string | null;
    sender: ChatUser;
    status?: "sending" | "sent" | "failed";
}

export interface LastMessage {
    id: string;
    content: string;
    sentAt: string;
    senderId: string;
    isRead: boolean;
}

/** Item returned by GET /chat/conversations */
export interface ConversationSummary {
    id: string;
    createdAt: string;
    lastMessageAt: string;
    counterpart: ChatCounterpart;
    listing: ChatListing | null;
    lastMessage: LastMessage | null;
    unreadCount: number;
}

/** Returned by GET /chat/conversations/:id */
export interface ConversationDetail {
    id: string;
    createdAt: string;
    lastMessageAt: string;
    counterpart: ChatCounterpart;
    listing: ChatListing | null;
}

/** Returned by POST /chat/conversations */
export interface StartedConversation {
    id: string;
    listingId: string;
    buyerId: string;
    sellerId: string;
    createdAt: string;
    lastMessageAt: string;
    seller: ChatUser;
    buyer: ChatUser;
    isNew: boolean;
    listing: ChatListing;
    counterpart: ChatCounterpart;
    firstMessage: ChatMessage;
}

/* ---------- Request payloads ---------- */

export interface StartConversationPayload {
    listingId: string;
    initialMessage: string;
}

export interface SendMessagePayload {
    conversationId: string;
    content: string;
}

/* ---------- Normalised query results ---------- */

export interface ConversationsResult {
    conversations: ConversationSummary[];
    meta: PaginationMeta;
}

export interface MessagesResult {
    messages: ChatMessage[];
    meta: PaginationMeta;
}

export interface MarkReadResult {
    markedRead: boolean;
    count: number;
}