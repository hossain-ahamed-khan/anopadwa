"use client";

import { ChevronRight } from "lucide-react";

// ---------- Types ----------

interface ContentSection {
    heading: string;
    body: string;
}

interface BlogArticle {
    breadcrumb: string[];
    heroImage: string;
    title: string;
    lead: string;
    intro: string;
    sections: ContentSection[];
}

interface RelatedPost {
    id: string;
    title: string;
    excerpt: string;
    image: string;
}

// ---------- Mock data ----------

const ARTICLE: BlogArticle = {
    breadcrumb: ["Home", "Blog", "Buy a gadget in 2026"],
    heroImage: "/blog/hero-shopping.jpg",
    title: "Smart Shopping",
    lead: "Shop with confidence, choose wisely, and get more value from every purchase.",
    intro:
        "Online shopping gives you access to thousands of products, but finding the right one can sometimes be overwhelming. With a few simple strategies, you can make better decisions and enjoy a smoother shopping experience.",
    sections: [
        {
            heading: "Know What You Need",
            body: "Before making a purchase, clearly understand what you are looking for. Consider the product's purpose, size, features, and quality. Having a clear idea of your needs can help you avoid unnecessary purchases.",
        },
        {
            heading: "Compare Before You Buy",
            body: "Don't settle for the first product you find. Compare prices, features, specifications, and customer reviews to find the option that offers the best value.",
        },
        {
            heading: "Check Customer Reviews",
            body: "Reviews can provide useful insights into product quality and real-world experiences. Look for reviews from verified customers and pay attention to common feedback.",
        },
    ],
};

const RELATED_POSTS: RelatedPost[] = [
    {
        id: "smart-shopping",
        title: "Smart Shopping",
        excerpt: "Discover practical products that can make your daily routine easier and more convenient.",
        image: "/blog/smart-shopping.jpg",
    },
    {
        id: "top-picks",
        title: "Top Picks This Month",
        excerpt: "Explore the latest products and trends that are getting attention from shoppers.",
        image: "/blog/top-picks.jpg",
    },
    {
        id: "smart-ways-to-save",
        title: "Smart Ways to Save",
        excerpt: "Tips for secure payments, trusted sellers, product reviews, and protecting personal information.",
        image: "/blog/smart-ways-to-save.jpg",
    },
];

// ---------- Small building blocks ----------

function Breadcrumb({ items }: { items: string[] }) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={item} className="flex items-center gap-1.5">
                        <span className={isLast ? "font-medium text-indigo-600" : "hover:text-gray-700 cursor-pointer"}>
                            {item}
                        </span>
                        {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                    </span>
                );
            })}
        </nav>
    );
}

function ContentSectionBlock({ section }: { section: ContentSection }) {
    return (
        <div>
            <h2 className="mb-1.5 text-lg font-bold text-gray-900">{section.heading}</h2>
            <p className="text-sm leading-relaxed text-gray-500">{section.body}</p>
        </div>
    );
}

function RelatedPostCard({ post }: { post: RelatedPost }) {
    return (
        <article className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            </div>
            <div className="p-5">
                <h3 className="mb-2 text-base font-bold text-gray-900">{post.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{post.excerpt}</p>
            </div>
        </article>
    );
}

// ---------- Main page component ----------

export default function BlogArticlePage() {
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-6 md:px-10">
            <div className="mx-auto max-w-5xl">
                <Breadcrumb items={ARTICLE.breadcrumb} />

                <div className="mt-4 aspect-[21/9] w-full overflow-hidden rounded-xl bg-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={ARTICLE.heroImage}
                        alt={ARTICLE.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>

                <h1 className="mb-4 mt-6 text-2xl font-bold text-gray-900">{ARTICLE.title}</h1>

                <div className="space-y-6">
                    <div>
                        <p className="mb-1.5 text-base font-bold text-gray-900">{ARTICLE.lead}</p>
                        <p className="text-sm leading-relaxed text-gray-500">{ARTICLE.intro}</p>
                    </div>

                    {ARTICLE.sections.map((section) => (
                        <ContentSectionBlock key={section.heading} section={section} />
                    ))}
                </div>

                <div className="mt-10">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">More Blogs</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {RELATED_POSTS.map((post) => (
                            <RelatedPostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}