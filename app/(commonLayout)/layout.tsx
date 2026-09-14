import Footer from "@/components/sheared/Footer";
import Navbar from "@/components/sheared/Navbar";


const CommonLayout = ({ children }: { children: React.ReactNode }) => {
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

export default CommonLayout;