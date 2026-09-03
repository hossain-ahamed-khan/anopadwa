import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface HeroProps {
    badge?: string;
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    discountedPrice?: string;
    originalPrice?: string;
    offerNote?: string;
    imageSrc?: string;
    imageAlt?: string;
}

export default function Hero({
    badge = "Weekend Discount",
    title = "Get the best quality products at the lowest prices",
    description = "We have prepared special discounts for you on organic breakfast products.",
    ctaLabel = "Shop Now",
    ctaHref = "/products",
    discountedPrice = "$21.67",
    originalPrice = "$59.99",
    offerNote = "Don't miss this limited time offer.",
    imageSrc = "/hero/hero-headphones.jpg",
    imageAlt = "Wireless headphones resting on a laptop",
}: HeroProps) {
    return (
        <section className="mx-4 mt-4 overflow-hidden rounded-3xl bg-[#8FE8CE] md:mx-6">
            <div className="grid grid-cols-1 items-center md:grid-cols-2">
                {/* Text content */}
                <div className="flex flex-col gap-4 px-8 py-12 md:px-14 lg:py-20">
                    <span className="w-fit rounded-md bg-[#6C63FF] px-3 py-1 text-xs font-semibold text-white">
                        {badge}
                    </span>

                    <h1 className="max-w-md text-3xl font-extrabold leading-tight text-[#1F2A44] sm:text-4xl lg:text-[2.75rem]">
                        {title}
                    </h1>

                    <p className="max-w-sm text-sm text-gray-600">{description}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-4">
                        <Link
                            href={ctaHref}
                            className="flex items-center gap-2 rounded-md bg-[#6C63FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5b53e6]"
                        >
                            <ShoppingBag size={16} />
                            {ctaLabel}
                        </Link>

                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-red-600">
                                    {discountedPrice}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {originalPrice}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{offerNote}</p>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="relative h-64 w-full md:h-[420px]">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </section>
    );
}