import ChatScreen from "@/components/buyer/chat/ChatScreen";

export default function ChatPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="w-full flex-1">
                <ChatScreen />
            </main>
        </div>
    );
}