"use client";

import { useState } from "react";
import { Search, Paperclip, Send, Circle } from "lucide-react";

// ---------- Types ----------

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    tags: string[];
    isOnline: boolean;
}

interface ChatMessage {
    id: string;
    sender: "me" | "them";
    text: string;
}

// ---------- Mock data ----------

const CONVERSATIONS: Conversation[] = [
    {
        id: "elmer-laverty",
        name: "Elmer Laverty",
        avatar: "https://i.pravatar.cc/80?img=12",
        lastMessage: "Haha oh man 🔥",
        timestamp: "12m",
        tags: ["Car"],
        isOnline: false,
    },
    {
        id: "florencio-dorrance",
        name: "Florencio Dorrance",
        avatar: "https://i.pravatar.cc/80?img=13",
        lastMessage: "woohoooo",
        timestamp: "24m",
        tags: ["Some content"],
        isOnline: true,
    },
    {
        id: "lavern-laboy",
        name: "Lavern Laboy",
        avatar: "https://i.pravatar.cc/80?img=14",
        lastMessage: "Haha that's terrifying 😅",
        timestamp: "1h",
        tags: ["Car", "Some content"],
        isOnline: false,
    },
    {
        id: "titus-kitamura",
        name: "Titus Kitamura",
        avatar: "https://i.pravatar.cc/80?img=15",
        lastMessage: "omg, this is amazing",
        timestamp: "5h",
        tags: ["Car", "Some content"],
        isOnline: false,
    },
    {
        id: "geoffrey-mott",
        name: "Geoffrey Mott",
        avatar: "https://i.pravatar.cc/80?img=16",
        lastMessage: "aww 😊",
        timestamp: "2d",
        tags: ["Car"],
        isOnline: false,
    },
    {
        id: "alfonzo-schuessler",
        name: "Alfonzo Schuessler",
        avatar: "https://i.pravatar.cc/80?img=17",
        lastMessage: "perfect!",
        timestamp: "1m",
        tags: ["Car"],
        isOnline: false,
    },
];

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: "1", sender: "them", text: "omg, this is amazing" },
    { id: "2", sender: "them", text: "perfect! ✅" },
    { id: "3", sender: "them", text: "Wow, this is really epic" },
    { id: "4", sender: "me", text: "How are you?" },
    { id: "5", sender: "them", text: "just ideas for next time" },
    { id: "6", sender: "them", text: "I'll be there in 2 mins 🍭" },
    { id: "7", sender: "me", text: "woohoooo" },
    { id: "8", sender: "me", text: "Haha oh man" },
    { id: "9", sender: "me", text: "Haha that's terrifying 😅" },
    { id: "10", sender: "them", text: "aww" },
    { id: "11", sender: "them", text: "omg, this is amazing" },
    { id: "12", sender: "them", text: "woohoooo 🔥" },
];

// ---------- Small building blocks ----------

function ConversationTag({ label }: { label: string }) {
    const isCar = label === "Car";
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${isCar ? "bg-amber-100 text-amber-700" : "border border-gray-200 text-gray-500"
                }`}
        >
            {label}
        </span>
    );
}

function ConversationListItem({
    conversation,
    isActive,
    onClick,
}: {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${isActive ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={conversation.avatar}
                alt={conversation.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-gray-900">{conversation.name}</span>
                    <span className="shrink-0 text-xs text-gray-400">{conversation.timestamp}</span>
                </div>
                <p className="truncate text-sm text-gray-500">{conversation.lastMessage}</p>
                <div className="mt-1.5 flex gap-1.5">
                    {conversation.tags.map((tag) => (
                        <ConversationTag key={tag} label={tag} />
                    ))}
                </div>
            </div>
        </button>
    );
}

function MessageBubble({ message, avatar }: { message: ChatMessage; avatar: string }) {
    const isMe = message.sender === "me";

    return (
        <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${isMe ? "rounded-br-sm bg-indigo-600 text-white" : "rounded-bl-sm bg-gray-100 text-gray-800"
                    }`}
            >
                {message.text}
            </div>
        </div>
    );
}

// ---------- Main chat component ----------

export default function MessagesPage() {
    const [conversations] = useState<Conversation[]>(CONVERSATIONS);
    const [activeId, setActiveId] = useState(conversations[1].id);
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [draft, setDraft] = useState("");
    const [search, setSearch] = useState("");

    const activeConversation = conversations.find((c) => c.id === activeId) ?? conversations[0];

    const filteredConversations = conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSend = () => {
        const trimmed = draft.trim();
        if (!trimmed) return;

        setMessages((prev) => [
            ...prev,
            { id: `${Date.now()}`, sender: "me", text: trimmed },
        ]);
        setDraft("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="flex h-screen bg-gray-50 p-6">
            <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Sidebar */}
                <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200">
                    <div className="flex items-center gap-2 px-5 pt-5">
                        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-semibold text-gray-600">
                            {conversations.length}
                        </span>
                    </div>

                    <div className="px-5 py-4">
                        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search messages"
                                className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map((conversation) => (
                            <ConversationListItem
                                key={conversation.id}
                                conversation={conversation}
                                isActive={conversation.id === activeId}
                                onClick={() => setActiveId(conversation.id)}
                            />
                        ))}
                    </div>
                </aside>

                {/* Chat panel */}
                <section className="flex flex-1 flex-col">
                    <header className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeConversation.avatar}
                            alt={activeConversation.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">{activeConversation.name}</p>
                            {activeConversation.isOnline && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                    Online
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                avatar={message.sender === "me" ? activeConversation.avatar : activeConversation.avatar}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-3 border-t border-gray-200 px-6 py-4">
                        <button className="text-gray-400 hover:text-gray-600" aria-label="Attach file">
                            <Paperclip className="h-5 w-5" />
                        </button>
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message"
                            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleSend}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                            aria-label="Send message"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}