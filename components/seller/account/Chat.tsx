"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Paperclip, Send } from "lucide-react";

type Sender = "them" | "me";

type Message = {
    id: string;
    sender: Sender;
    text: string;
};

type Conversation = {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    tags: string[];
    isOnline?: boolean;
    messages: Message[];
};

const conversations: Conversation[] = [
    {
        id: "elmer",
        name: "Elmer Laverty",
        avatar: "https://i.pravatar.cc/64?img=13",
        lastMessage: "Haha oh man 🔥",
        time: "12m",
        tags: ["Car"],
        messages: [{ id: "m1", sender: "them", text: "Haha oh man 🔥" }],
    },
    {
        id: "florencio",
        name: "Florencio Dorrance",
        avatar: "https://i.pravatar.cc/64?img=14",
        lastMessage: "woohoooo",
        time: "24m",
        tags: ["Some content"],
        isOnline: true,
        messages: [
            { id: "m1", sender: "them", text: "omg, this is amazing" },
            { id: "m2", sender: "them", text: "perfect! ✅" },
            { id: "m3", sender: "them", text: "Wow, this is really epic" },
            { id: "m4", sender: "me", text: "How are you?" },
            { id: "m5", sender: "them", text: "just ideas for next time" },
            { id: "m6", sender: "them", text: "I'll be there in 2 mins 💗" },
            { id: "m7", sender: "me", text: "woohoooo" },
            { id: "m8", sender: "me", text: "Haha oh man" },
            { id: "m9", sender: "me", text: "Haha that's terrifying 😅" },
            { id: "m10", sender: "them", text: "aww" },
            { id: "m11", sender: "them", text: "omg, this is amazing" },
            { id: "m12", sender: "them", text: "woohoooo 🔥" },
        ],
    },
    {
        id: "lavern",
        name: "Lavern Laboy",
        avatar: "https://i.pravatar.cc/64?img=15",
        lastMessage: "Haha that's terrifying 😅",
        time: "1h",
        tags: ["Car", "Some content"],
        messages: [{ id: "m1", sender: "them", text: "Haha that's terrifying 😅" }],
    },
    {
        id: "titus",
        name: "Titus Kitamura",
        avatar: "https://i.pravatar.cc/64?img=16",
        lastMessage: "omg, this is amazing",
        time: "5h",
        tags: ["Car", "Some content"],
        messages: [{ id: "m1", sender: "them", text: "omg, this is amazing" }],
    },
    {
        id: "geoffrey",
        name: "Geoffrey Mott",
        avatar: "https://i.pravatar.cc/64?img=17",
        lastMessage: "aww 😊",
        time: "2d",
        tags: ["Car"],
        messages: [{ id: "m1", sender: "them", text: "aww 😊" }],
    },
    {
        id: "alfonzo",
        name: "Alfonzo Schuessler",
        avatar: "https://i.pravatar.cc/64?img=18",
        lastMessage: "perfect!",
        time: "1m",
        tags: ["Car"],
        messages: [{ id: "m1", sender: "them", text: "perfect!" }],
    },
];

const TAG_STYLES: Record<string, string> = {
    Car: "bg-amber-50 text-amber-600",
    "Some content": "bg-slate-100 text-slate-500",
};

export default function MessagesPage() {
    const [activeId, setActiveId] = useState(conversations[1].id);
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");

    const activeConversation =
        conversations.find((c) => c.id === activeId) ?? conversations[0];

    const filteredConversations = conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
    );

    const handleSend = () => {
        if (!draft.trim()) return;
        // TODO: dispatch to your WebSocket/RTK Query send-message mutation
        setDraft("");
    };

    return (
        <section className="grid min-h-155 grid-cols-[280px_minmax(0,1fr)] overflow-hidden rounded-xl bg-white shadow-sm">
            {/* Conversation list */}
            <aside className="flex flex-col border-r border-slate-100">
                <div className="flex items-center gap-2 px-5 pt-5">
                    <h1 className="text-base font-bold text-slate-900">Messages</h1>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-semibold text-slate-600">
                        {conversations.length}
                    </span>
                </div>

                <div className="relative mx-5 mt-4">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search messages"
                        className="h-10 w-full rounded-lg bg-slate-50 pl-9 pr-3 text-sm text-slate-600 outline-none placeholder:text-slate-400"
                    />
                </div>

                <div className="mt-4 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
                    {filteredConversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            type="button"
                            onClick={() => setActiveId(conversation.id)}
                            className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${activeId === conversation.id
                                    ? "bg-indigo-50"
                                    : "hover:bg-slate-50"
                                }`}
                        >
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                                <Image
                                    src={conversation.avatar}
                                    alt={conversation.name}
                                    fill
                                    sizes="44px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="truncate text-sm font-semibold text-slate-800">
                                        {conversation.name}
                                    </h2>
                                    <span className="shrink-0 text-xs text-slate-400">
                                        {conversation.time}
                                    </span>
                                </div>
                                <p className="mt-0.5 truncate text-xs text-slate-400">
                                    {conversation.lastMessage}
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {conversation.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${TAG_STYLES[tag] ?? "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Thread */}
            <div className="flex flex-col">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image
                            src={activeConversation.avatar}
                            alt={activeConversation.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            {activeConversation.name}
                        </h2>
                        {activeConversation.isOnline && (
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Online
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                    {activeConversation.messages.map((message) =>
                        message.sender === "them" ? (
                            <div key={message.id} className="flex items-end gap-2">
                                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                    <Image
                                        src={activeConversation.avatar}
                                        alt={activeConversation.name}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="max-w-xs rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2 text-sm text-slate-700">
                                    {message.text}
                                </div>
                            </div>
                        ) : (
                            <div
                                key={message.id}
                                className="flex items-end justify-end gap-2"
                            >
                                <div className="max-w-xs rounded-2xl rounded-br-sm bg-emerald-800 px-4 py-2 text-sm text-white">
                                    {message.text}
                                </div>
                                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                    <Image
                                        src="https://i.pravatar.cc/64?img=12"
                                        alt="You"
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ),
                    )}
                </div>

                <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
                    <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50"
                        aria-label="Attach file"
                    >
                        <Paperclip className="h-4 w-4" />
                    </button>
                    <input
                        type="text"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && handleSend()}
                        placeholder="Type a message"
                        className="h-11 flex-1 rounded-full border border-slate-200 px-4 text-sm text-slate-600 outline-none placeholder:text-slate-400 focus:border-emerald-500"
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                        aria-label="Send message"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}