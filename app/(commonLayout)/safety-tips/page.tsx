import Link from 'next/link';
import { ChevronLeft, Flag, HandCoins, MapPin, ShieldCheck, SearchCheck } from 'lucide-react';

const safetyTips = [
    {
        title: 'Meet in a safe place',
        description: 'Choose a busy public location for meetings and let someone you trust know where you are going.',
        icon: MapPin,
    },
    {
        title: 'Inspect before you pay',
        description: 'Check the item carefully and make sure it matches the listing before completing the transaction.',
        icon: SearchCheck,
    },
    {
        title: 'Avoid advance payments',
        description: 'Do not send money to unknown sellers before you have seen and verified the item.',
        icon: HandCoins,
    },
    {
        title: 'Report suspicious activity',
        description: 'Help keep the marketplace safe by reporting suspicious listings or sellers to our team.',
        icon: Flag,
    },
];

export default function SafetyTipsPage() {
    return (
        <main className="min-h-[60vh] bg-[#f4f4f4] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                            <ShieldCheck className="h-5 w-5" />
                        </span>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Safety Tips</h1>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                Follow these simple steps to help keep every Anopadwa transaction safe.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        {safetyTips.map(({ title, description, icon: Icon }) => (
                            <section key={title} className="rounded-lg bg-slate-50 p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <Icon className="h-4 w-4 text-emerald-600" />
                                    {title}
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {description}
                                </p>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
