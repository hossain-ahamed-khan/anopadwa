import Navbar from "@/components/buyer/Navbar";
import MessagesPage from "@/components/chat/Message";
import Footer from "@/components/sheared/Footer";

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