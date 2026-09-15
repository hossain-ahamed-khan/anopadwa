"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";

interface Category {
    id: string;
    name: string;
    subCategories: string[];
    isExpanded: boolean;
}

let subCategoryIdCounter = 0;

const MOCK_CATEGORIES: Category[] = [
    { id: "1", name: "Car", subCategories: ["Toyota", "Honda", "Nissan"], isExpanded: false },
    { id: "2", name: "Car", subCategories: ["Toyota", "Toyota", "Toyota", "Toyota", "Toyota"], isExpanded: true },
    { id: "3", name: "Car", subCategories: ["Toyota", "Honda", "Nissan"], isExpanded: false },
    { id: "4", name: "Car", subCategories: ["Toyota", "Honda", "Nissan"], isExpanded: false },
];

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [subCategoryDrafts, setSubCategoryDrafts] = useState<Record<string, string>>({});

    const toggleExpand = (id: string) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isExpanded: !c.isExpanded } : c))
        );
    };

    const handleDeleteCategory = (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    const handleDeleteSubCategory = (categoryId: string, index: number) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId
                    ? { ...c, subCategories: c.subCategories.filter((_, i) => i !== index) }
                    : c
            )
        );
    };

    const handleSubCategoryDraftChange = (categoryId: string, value: string) => {
        setSubCategoryDrafts((prev) => ({ ...prev, [categoryId]: value }));
    };

    const handleAddSubCategory = (categoryId: string) => {
        const value = subCategoryDrafts[categoryId]?.trim();
        if (!value) return;
        setCategories((prev) =>
            prev.map((c) =>
                c.id === categoryId ? { ...c, subCategories: [...c.subCategories, value] } : c
            )
        );
        setSubCategoryDrafts((prev) => ({ ...prev, [categoryId]: "" }));
        subCategoryIdCounter += 1;
    };

    const handleAddCategory = () => {
        const value = newCategoryName.trim();
        if (!value) return;
        const newCategory: Category = {
            id: `new-${Date.now()}`,
            name: value,
            subCategories: [],
            isExpanded: false,
        };
        setCategories((prev) => [...prev, newCategory]);
        setNewCategoryName("");
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-900">All Categories</h2>

                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="overflow-hidden rounded-lg bg-gray-100">
                            {/* Category row */}
                            <div className="flex items-center justify-between px-4 py-3.5">
                                <span className="text-sm font-semibold text-gray-800">
                                    {category.name} ({category.subCategories.length})
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleExpand(category.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-gray-700 transition hover:bg-gray-50"
                                        aria-label={category.isExpanded ? "Collapse" : "Expand"}
                                    >
                                        {category.isExpanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="flex h-8 w-8 items-center justify-center text-red-500 transition hover:text-red-600"
                                        aria-label="Delete category"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Sub categories */}
                            {category.isExpanded && (
                                <div className="px-4 pb-4">
                                    <div className="divide-y divide-gray-200/70">
                                        {category.subCategories.map((sub, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-3">
                                                <span className="text-sm text-gray-600">{sub}</span>
                                                <button
                                                    onClick={() => handleDeleteSubCategory(category.id, idx)}
                                                    className="text-red-500 transition hover:text-red-600"
                                                    aria-label="Delete sub category"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add sub category */}
                                    <div className="mt-3 flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-transparent px-4 py-2.5">
                                        <input
                                            type="text"
                                            value={subCategoryDrafts[category.id] ?? ""}
                                            onChange={(e) => handleSubCategoryDraftChange(category.id, e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddSubCategory(category.id)}
                                            placeholder="Enter Sub Category"
                                            className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleAddSubCategory(category.id)}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add Sub Category
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add new category */}
                <div className="mt-4 flex items-center gap-3">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                        placeholder="Enter Category Name"
                        className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Category
                    </button>
                </div>
            </div>
        </div>
    );
}