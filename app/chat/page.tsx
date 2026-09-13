import Footer from "@/components/buyer/Footer";
import Navbar from "@/components/buyer/Navbar";
import MessagesPage from "@/components/chat/Message";

export default function ChatPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="w-full flex-1">
                <MessagesPage />
            </main>
            <Footer />
        </div>
    );
}