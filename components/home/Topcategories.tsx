import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
    label: string;
    href: string;
    imageSrc: string;
}

const CATEGORIES: Category[] = [
    {
        label: "Vehicles",
        href: "/categories/vehicles",
        imageSrc: "/categories/vehicles.jpg",
    },
    {
        label: "Property",
        href: "/categories/property",
        imageSrc: "/categories/property.jpg",
    },
    {
        label: "Phone",
        href: "/categories/phone",
        imageSrc: "/categories/phone.jpg",
    },
];

export default function TopCategories() {
    return (
        <section className="mx-4 mt-8 md:mx-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-3">
                    <h2 className="text-lg font-extrabold tracking-wide text-[#1F2A44]">
                        TOP CATEGORIES
                    </h2>
                    <p className="text-sm text-gray-400">New products with updated stocks.</p>
                </div>

                <Link
                    href="/categories"
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1F2A44] shadow-sm transition-colors hover:bg-gray-50"
                >
                    View All
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Category cards */}
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES.map((category) => (
                    <Link
                        key={category.label}
                        href={category.href}
                        className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="relative h-52 w-full overflow-hidden">
                            <Image
                                src={category.imageSrc}
                                alt={category.label}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </div>
                        <p className="py-4 text-center text-base font-medium text-[#1F2A44]">
                            {category.label}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Promo banner */}
            <div className="relative mt-6 flex items-center justify-between overflow-hidden rounded-2xl bg-gray-100 px-6 py-6 sm:px-8">
                <div className="max-w-md">
                    <h3 className="text-lg font-extrabold text-red-600 sm:text-xl">
                        In store or online your health &amp; safety is our top priority
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        The only supermarket that makes your life easier, makes you enjoy life
                        and makes it better.
                    </p>
                </div>

                <div className="relative hidden h-24 w-64 shrink-0 sm:block">
                    <Image
                        src="/categories/health-safety-illustration.svg"
                        alt=""
                        fill
                        className="object-contain object-right"
                    />
                </div>
            </div>
        </section>
    );
}