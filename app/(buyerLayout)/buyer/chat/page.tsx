import MessagesPage from "@/components/buyer/chat/Message";

export default function ChatPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="w-full flex-1">
                <MessagesPage />
            </main>
        </div>
    );
}