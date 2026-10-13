"use client";
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Circle, Paperclip, Search, Send } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectToken, selectUser } from "@/redux/features/auth/authSlice";
import {
    useConversations,
    useChatRoom,
} from "@/redux/features/chat/useChat";
import type { ConversationSummary, ChatMessage } from "@/types/chat.types";

function formatTime(value?: string | null) {
    if (!value) return "";
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function avatarUrl(url: string | null | undefined) {
    return url || "/default-avatar.png";
}

function ConversationItem({
    conversation,
    active,
    onSelect,
}: {
    conversation: ConversationSummary;
    active: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex w-full items-start gap-3 border-l-4 px-4 py-3 text-left transition ${
                active ? "border-emerald-600 bg-emerald-50" : "border-transparent hover:bg-gray-50"
            }`}
        >
            <div className="relative shrink-0">
                <img
                    src={avatarUrl(conversation.counterpart.profilePhotoUrl)}
                    alt=""
                    className="h-11 w-11 rounded-full bg-gray-100 object-cover"
                />
                {conversation.counterpart.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900">
                        {conversation.counterpart.fullName}
                    </p>
                    <span className="shrink-0 text-xs text-gray-400">
                        {formatTime(conversation.lastMessage?.sentAt)}
                    </span>
                </div>
                {conversation.listing && (
                    <p className="truncate text-xs font-medium text-emerald-700">
                        {conversation.listing.title}
                    </p>
                )}
                <p className="mt-0.5 truncate text-xs text-gray-500">
                    {conversation.lastMessage?.content || "No messages yet"}
                </p>
            </div>
            {conversation.unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {conversation.unreadCount}
                </span>
            )}
        </button>
    );
}

function MessageBubble({
    message,
    currentUserId,
    counterpartAvatar,
}: {
    message: ChatMessage;
    currentUserId: string;
    counterpartAvatar: string | null;
}) {
    const isMine = message.senderId === currentUserId;
    return (
        <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
            <img
                src={isMine ? "/default-avatar.png" : avatarUrl(counterpartAvatar)}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
            />
            <div
                className={`max-w-[min(75%,28rem)] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                        ? "rounded-br-sm bg-emerald-600 text-white"
                        : "rounded-bl-sm bg-gray-100 text-gray-800"
                }`}
            >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <span className={`mt-1 block text-[10px] ${isMine ? "text-emerald-100" : "text-gray-400"}`}>
                    {formatTime(message.sentAt)}
                    {isMine && message.status === "sending" && " · Sending"}
                    {isMine && message.status === "failed" && " · Failed"}
                </span>
            </div>
        </div>
    );
}

export default function ChatScreen() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);
    const selectedId = searchParams.get("conversationId") ?? undefined;
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { conversations, isLoading: conversationsLoading } = useConversations(
        { page: 1, limit: 50 },
        { pollingInterval: 5000, skip: !token },
    );
    const activeId = selectedId ?? conversations[0]?.id;
    const room = useChatRoom(activeId, {
        currentUserId: user?.id,
        pollingInterval: 5000,
        skip: !token,
    });

    useEffect(() => {
        if (!selectedId && conversations[0]) {
            router.replace(`${pathname}?conversationId=${conversations[0].id}`);
        }
    }, [conversations, pathname, router, selectedId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [room.messages]);

    const filteredConversations = useMemo(
        () =>
            conversations.filter((conversation) =>
                conversation.counterpart.fullName.toLowerCase().includes(search.toLowerCase()),
            ),
        [conversations, search],
    );
    const activeConversation =
        conversations.find((conversation) => conversation.id === activeId) ??
        (room.conversation
            ? {
                  id: room.conversation.id,
                  counterpart: room.conversation.counterpart,
                  listing: room.conversation.listing,
              }
            : undefined);

    const send = async (event?: FormEvent) => {
        event?.preventDefault();
        const content = draft.trim();
        if (!content || !activeId || room.isSending) return;
        setDraft("");
        await room.sendMessage(content);
    };

    if (!token || !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Sign in to view your messages</h1>
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="mt-4 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] min-h-[32rem] bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <aside className="flex w-full max-w-sm shrink-0 flex-col border-r border-gray-200">
                    <div className="border-b border-gray-200 p-5">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                {conversations.length}
                            </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search conversations"
                                className="w-full bg-transparent text-sm outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversationsLoading ? (
                            <p className="p-5 text-center text-sm text-gray-400">Loading chats...</p>
                        ) : filteredConversations.length === 0 ? (
                            <p className="p-5 text-center text-sm text-gray-400">No conversations yet</p>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    active={conversation.id === activeId}
                                    onSelect={() =>
                                        router.push(`${pathname}?conversationId=${conversation.id}`)
                                    }
                                />
                            ))
                        )}
                    </div>
                </aside>
                <section className="hidden min-w-0 flex-1 flex-col sm:flex">
                    {activeConversation ? (
                        <>
                            <header className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                                <img
                                    src={avatarUrl(activeConversation.counterpart.profilePhotoUrl)}
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {activeConversation.counterpart.fullName}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Circle
                                            className={`h-2 w-2 ${
                                                activeConversation.counterpart.isOnline
                                                    ? "fill-emerald-500 text-emerald-500"
                                                    : "fill-gray-300 text-gray-300"
                                            }`}
                                        />
                                        {activeConversation.counterpart.isOnline ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </header>
                            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                                {room.isLoading ? (
                                    <p className="text-center text-sm text-gray-400">Loading messages...</p>
                                ) : room.messages.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400">Start the conversation</p>
                                ) : (
                                    room.messages.map((message) => (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            currentUserId={user.id}
                                            counterpartAvatar={activeConversation.counterpart.profilePhotoUrl}
                                        />
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={send} className="flex items-center gap-3 border-t border-gray-200 px-6 py-4">
                                <Paperclip className="h-5 w-5 text-gray-300" aria-hidden="true" />
                                <input
                                    value={draft}
                                    onChange={(event) => {
                                        setDraft(event.target.value);
                                        room.emitTyping(event.target.value.length > 0);
                                    }}
                                    onBlur={() => room.emitTyping(false)}
                                    placeholder="Type a message"
                                    className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!draft.trim() || room.isSending}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Send message"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
                            Select a conversation to start chatting
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
