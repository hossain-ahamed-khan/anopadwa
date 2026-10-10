// hooks/useChat.ts
"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/features/auth/authSlice";
import { connectSocket } from "@/services/socket";
import {
    useGetConversationQuery,
    useGetConversationsQuery,
    useGetMessagesQuery,
    useGetUnreadCountQuery,
    useMarkConversationReadMutation,
    useSendMessageMutation,
    useStartConversationMutation,
} from "@/redux/api/chatApi";
import type {
    ChatMessage,
    PaginationParams,
    StartedConversation,
} from "@/types/chat.types";

interface PollingOptions {
    /** Poll interval in ms. 0 / undefined disables polling. */
    pollingInterval?: number;
    skip?: boolean;
}

/**
 * Buyer -> seller: start a conversation from a listing.
 *
 *   const { startConversation, isStarting } = useStartConversation();
 *   const conv = await startConversation("8", "Is this still available?");
 *   router.push(`/messages/${conv.id}`);
 */
export function useStartConversation() {
    const [trigger, { isLoading, error, reset }] =
        useStartConversationMutation();

    const startConversation = useCallback(
        async (
            listingId: string,
            initialMessage: string,
        ): Promise<StartedConversation> =>
            trigger({ listingId, initialMessage }).unwrap(),
        [trigger],
    );

    return { startConversation, isStarting: isLoading, error, reset };
}

/** Inbox list for both buyer and seller. */
export function useConversations(
    params?: PaginationParams,
    { pollingInterval, skip }: PollingOptions = {},
) {
    const query = useGetConversationsQuery(params, {
        pollingInterval,
        skip,
    });

    return {
        conversations: query.data?.conversations ?? [],
        meta: query.data?.meta,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}

/** Single conversation header info (counterpart + listing). */
export function useConversation(conversationId?: string) {
    const query = useGetConversationQuery(conversationId ?? "", {
        skip: !conversationId,
    });

    return {
        conversation: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

/** Paginated messages for a conversation. */
export function useMessages(
    conversationId?: string,
    params?: PaginationParams,
    { pollingInterval, skip }: PollingOptions = {},
) {
    const query = useGetMessagesQuery(
        { conversationId: conversationId ?? "", ...params },
        { skip: !conversationId || skip, pollingInterval },
    );

    return {
        messages: query.data?.messages ?? ([] as ChatMessage[]),
        meta: query.data?.meta,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}

/** Global unread badge count (navbar, etc.). */
export function useUnreadCount({ pollingInterval, skip }: PollingOptions = {}) {
    const query = useGetUnreadCountQuery(undefined, { pollingInterval, skip });

    return {
        unreadCount: query.data ?? 0,
        isLoading: query.isLoading,
        refetch: query.refetch,
    };
}

/** Send a message in an existing conversation. */
export function useSendMessage(conversationId?: string) {
    const [trigger, { isLoading, error }] = useSendMessageMutation();

    const sendMessage = useCallback(
        async (content: string): Promise<ChatMessage | null> => {
            const trimmed = content.trim();
            if (!conversationId || !trimmed) return null;
            return trigger({ conversationId, content: trimmed }).unwrap();
        },
        [conversationId, trigger],
    );

    return { sendMessage, isSending: isLoading, error };
}

/** Mark a conversation as read. */
export function useMarkConversationRead() {
    const [trigger, { isLoading }] = useMarkConversationReadMutation();

    const markRead = useCallback(
        (conversationId: string) => trigger(conversationId).unwrap(),
        [trigger],
    );

    return { markRead, isMarking: isLoading };
}

/**
 * All-in-one hook for a chat screen (conversation page).
 * - loads header info + messages (with optional polling)
 * - marks the conversation as read on open and when new messages arrive
 *   from the other person
 * - exposes sendMessage
 *
 *   const { conversation, messages, sendMessage, isSending } =
 *     useChatRoom(id, { currentUserId, pollingInterval: 5000 });
 */
export function useChatRoom(
    conversationId: string | undefined,
    options: PollingOptions & {
        currentUserId?: string;
        messagesLimit?: number;
    } = {},
) {
    const { currentUserId, messagesLimit = 50, pollingInterval, skip } = options;

    const { conversation, isLoading: isConversationLoading } =
        useConversation(skip ? undefined : conversationId);

    const messagesState = useMessages(
        skip ? undefined : conversationId,
        { page: 1, limit: messagesLimit },
        { pollingInterval },
    );
    const refetchMessages = messagesState.refetch;

    const { sendMessage, isSending } = useSendMessage(conversationId);
    const { markRead } = useMarkConversationRead();
    const token = useAppSelector(selectToken);
    const socket = token ? connectSocket(token) : null;

    // Mark as read whenever an unread message from the counterpart appears.
    const lastMarkedRef = useRef<string | null>(null);
    const { messages } = messagesState;

    useEffect(() => {
        if (!conversationId || !currentUserId || messages.length === 0) return;

        const latestIncomingUnread = [...messages]
            .reverse()
            .find((m) => m.senderId !== currentUserId && !m.readAt);

        if (!latestIncomingUnread) return;
        if (lastMarkedRef.current === latestIncomingUnread.id) return;

        lastMarkedRef.current = latestIncomingUnread.id;
        markRead(conversationId).catch(() => {
            lastMarkedRef.current = null; // allow retry on next update
        });
    }, [conversationId, currentUserId, messages, markRead]);

    useEffect(() => {
        if (!socket || !conversationId) return;

        socket.emit("join_conversation", { conversationId });
        socket.emit("mark_read", { conversationId });

        const handleNewMessage = (data: { conversationId: string }) => {
            if (data.conversationId === conversationId) {
                refetchMessages();
            }
        };
        const handleRead = (data: { conversationId: string }) => {
            if (data.conversationId === conversationId) refetchMessages();
        };

        socket.on("new_message", handleNewMessage);
        socket.on("messages_read", handleRead);
        return () => {
            socket.emit("leave_conversation", { conversationId });
            socket.off("new_message", handleNewMessage);
            socket.off("messages_read", handleRead);
        };
    }, [conversationId, refetchMessages, socket]);

    const emitTyping = useCallback(
        (isTyping: boolean) => {
            if (socket && conversationId) {
                socket.emit("typing", { conversationId, isTyping });
            }
        },
        [conversationId, socket],
    );

    const sendRealtimeMessage = useCallback(
        async (content: string) => {
            const trimmed = content.trim();
            if (!conversationId || !trimmed) return null;

            if (socket?.connected) {
                return new Promise<ChatMessage>((resolve, reject) => {
                    socket.emit(
                        "send_message",
                        { conversationId, content: trimmed },
                        (response: { success?: boolean; message?: ChatMessage; error?: string }) => {
                            if (response?.success && response.message) {
                                refetchMessages();
                                resolve(response.message);
                                return;
                            }
                            reject(new Error(response?.error || "Socket message delivery failed"));
                        },
                    );
                }).catch(() => sendMessage(trimmed));
            }

            return sendMessage(trimmed);
        },
        [conversationId, refetchMessages, sendMessage, socket],
    );

    return {
        conversation,
        messages,
        meta: messagesState.meta,
        isLoading: isConversationLoading || messagesState.isLoading,
        isFetching: messagesState.isFetching,
        error: messagesState.error,
        sendMessage: sendRealtimeMessage,
        isSending,
        emitTyping,
        refetch: messagesState.refetch,
    };
}