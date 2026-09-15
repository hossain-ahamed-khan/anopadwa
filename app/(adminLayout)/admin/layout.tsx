import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

const ADMIN_AVATAR = "/avatars/moni-roy.jpg";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#FBF6EE]">
            <Sidebar />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <Header name="Moni Roy" role="Super Admin" avatarUrl={ADMIN_AVATAR} />
                <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}