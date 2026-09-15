import StatCard from "./Statcard";


interface OverviewSectionProps {
    title: string;
    totalLabel: string;
    totalValue: string;
    newLabel: string;
    newValue: string;
    activeLabel: string;
    activeValue: string;
    groupAvatarUrls: [string, string];
}

export default function OverviewSection({
    title,
    totalLabel,
    totalValue,
    newLabel,
    newValue,
    activeLabel,
    activeValue,
    groupAvatarUrls,
}: OverviewSectionProps) {
    return (
        <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-base font-bold text-gray-900">{title}</h3>
            <div className="grid grid-cols-3 gap-4">
                <StatCard
                    variant="group"
                    groupAvatarUrls={groupAvatarUrls}
                    value={totalValue}
                    label={totalLabel}
                />
                <StatCard variant="new" value={newValue} label={newLabel} />
                <StatCard variant="active" value={activeValue} label={activeLabel} />
            </div>
        </div>
    );
}