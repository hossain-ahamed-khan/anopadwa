import EarningsChart from "@/components/admin/Earningschart";
import OverviewSection from "@/components/admin/Overviewsection";
import SalesOverviewChart from "@/components/admin/Salesoverviewchart";
import TopProductsChart from "@/components/admin/Topproductschart";

const AVATAR_A = "/avatars/user-1.jpg";
const AVATAR_B = "/avatars/user-2.jpg";
export default function AdminDashboardPage() {
    return (
        <div className="space-y-6 p-8">
            {/* Greeting */}
            <div className="rounded-2xl bg-white px-6 py-5">
                <p className="text-sm text-gray-500">Hi, 👋 Good Morning</p>
                <p className="text-xl font-bold text-gray-900">Moni Roy</p>
            </div>

            {/* Users overview + Earnings */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <OverviewSection
                    title="User's Overview"
                    totalLabel="Total Users"
                    totalValue="4,55,666"
                    newLabel="Today New User's"
                    newValue="1320"
                    activeLabel="Active User"
                    activeValue="1320"
                    groupAvatarUrls={[AVATAR_A, AVATAR_B]}
                />
                <EarningsChart />
            </div>

            {/* Sellers overview + Buyers overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <OverviewSection
                    title="Seller's Overview"
                    totalLabel="Total Sellers"
                    totalValue="4,55,666"
                    newLabel="Today New Sellers"
                    newValue="1320"
                    activeLabel="Active Sellers"
                    activeValue="1320"
                    groupAvatarUrls={[AVATAR_A, AVATAR_B]}
                />
                <OverviewSection
                    title="Buyer's Overview"
                    totalLabel="Total Buyers"
                    totalValue="4,55,666"
                    newLabel="Today New Buyers"
                    newValue="1320"
                    activeLabel="Active Buyers"
                    activeValue="1320"
                    groupAvatarUrls={[AVATAR_A, AVATAR_B]}
                />
            </div>

            {/* Sales + Top products */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SalesOverviewChart />
                <TopProductsChart />
            </div>
        </div>
    );
}