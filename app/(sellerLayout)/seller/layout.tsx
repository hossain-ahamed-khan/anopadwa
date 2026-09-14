import Navbar from "@/components/seller/Navbar";
import Footer from "@/components/sheared/Footer";

const BuyerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default BuyerLayout;