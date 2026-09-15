"use client";

import { useState } from "react";
import { Mail, Check, Eye, Ban, Trash2 } from "lucide-react";

interface Product {
    id: string;
    slNo: string;
    productName: string;
    sellerName: string;
    sellerEmail: string;
    photos: string[];
    price: string;
    isVerified: boolean;
}

const MOCK_PRODUCTS: Product[] = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    slNo: "#1233",
    productName: i % 2 === 0 ? "Syden car 2026" : "Iphone 16 Plus",
    sellerName: "Kawser Yumm",
    sellerEmail: "kawser@gmail.com",
    photos: Array.from({ length: 5 }, (_, p) => `https://picsum.photos/seed/product-${i}-${p}/80/80`),
    price: "22",
    isVerified: [1, 2, 5, 7].includes(i),
}));

export default function ProductVerificationTable() {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

    const handleVerify = (id: string) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
        );
    };

    const handleView = (id: string) => {
        // eslint-disable-next-line no-console
        console.log("View product", id);
    };

    const handleBan = (id: string) => {
        // eslint-disable-next-line no-console
        console.log("Suspend product", id);
    };

    const handleDelete = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                            <tr className="text-left text-sm text-gray-700">
                                <th className="px-6 py-5 font-semibold">SL no.</th>
                                <th className="px-6 py-5 font-semibold">Product Name</th>
                                <th className="px-6 py-5 font-semibold">Seller Info</th>
                                <th className="px-6 py-5 font-semibold">Photo</th>
                                <th className="px-6 py-5 font-semibold">Price</th>
                                <th className="px-6 py-5 font-semibold">More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t border-gray-50 text-sm text-gray-700">
                                    <td className="px-6 py-4 align-top">{product.slNo}</td>
                                    <td className="px-6 py-4 align-top">{product.productName}</td>

                                    {/* Seller info */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-medium text-gray-800">{product.sellerName}</div>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                            <Mail className="h-3 w-3" />
                                            {product.sellerEmail}
                                        </div>
                                    </td>

                                    {/* Photos */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex gap-1.5">
                                            {product.photos.map((src, idx) => (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    key={idx}
                                                    src={src}
                                                    alt={`${product.productName} photo ${idx + 1}`}
                                                    className="h-10 w-10 rounded-md object-cover"
                                                />
                                            ))}
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4 align-top">₵{product.price}</td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVerify(product.id)}
                                                className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition ${product.isVerified
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                {product.isVerified ? "Verified" : "Verify"}
                                            </button>
                                            <button
                                                onClick={() => handleView(product.id)}
                                                className="inline-flex items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50"
                                                aria-label="View product"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleBan(product.id)}
                                                className="inline-flex items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-400 transition hover:bg-gray-50"
                                                aria-label="Suspend product"
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="inline-flex items-center justify-center rounded-md border border-red-100 bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                                                aria-label="Delete product"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}