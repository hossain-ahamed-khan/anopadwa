"use client";

import { ChevronRight } from "lucide-react";

// ---------- Types ----------

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    image: string;
}

// ---------- Mock data ----------

const BLOG_POSTS: BlogPost[] = [
    {
        id: "smart-shopping-1",
        title: "Smart Shopping",
        excerpt: "Discover practical products that can make your daily routine easier and more convenient.",
        image: "/blog/smart-shopping.jpg",
    },
    {
        id: "top-picks-1",
        title: "Top Picks This Month",
        excerpt: "Explore the latest products and trends that are getting attention from shoppers.",
        image: "/blog/top-picks.jpg",
    },
    {
        id: "smart-ways-1",
        title: "Smart Ways to Save",
        excerpt: "Tips for secure payments, trusted sellers, product reviews, and protecting personal information.",
        image: "/blog/smart-ways-to-save.jpg",
    },
    {
        id: "smart-ways-2",
        title: "Smart Ways to Save",
        excerpt: "Tips for secure payments, trusted sellers, product reviews, and protecting personal information.",
        image: "/blog/smart-ways-to-save.jpg",
    },
    {
        id: "smart-shopping-2",
        title: "Smart Shopping",
        excerpt: "Discover practical products that can make your daily routine easier and more convenient.",
        image: "/blog/smart-shopping.jpg",
    },
    {
        id: "top-picks-2",
        title: "Top Picks This Month",
        excerpt: "Explore the latest products and trends that are getting attention from shoppers.",
        image: "/blog/top-picks.jpg",
    },
    {
        id: "smart-shopping-3",
        title: "Smart Shopping",
        excerpt: "Discover practical products that can make your daily routine easier and more convenient.",
        image: "/blog/smart-shopping.jpg",
    },
    {
        id: "smart-ways-3",
        title: "Smart Ways to Save",
        excerpt: "Tips for secure payments, trusted sellers, product reviews, and protecting personal information.",
        image: "/blog/smart-ways-to-save.jpg",
    },
    {
        id: "top-picks-3",
        title: "Top Picks This Month",
        excerpt: "Explore the latest products and trends that are getting attention from shoppers.",
        image: "/blog/top-picks.jpg",
    },
];

// ---------- Small building blocks ----------

function Breadcrumb() {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-indigo-600">Blog</span>
        </nav>
    );
}

function BlogCard({ post }: { post: BlogPost }) {
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
                <h3 className="mb-2 text-lg font-bold text-gray-900">{post.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{post.excerpt}</p>
            </div>
        </article>
    );
}

// ---------- Main page component ----------

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-6 md:px-10">
            <div className="mx-auto max-w-7xl">
                <Breadcrumb />

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {BLOG_POSTS.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}