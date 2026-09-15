"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";

interface Region {
    id: string;
    name: string;
    districts: string[];
    isExpanded: boolean;
}

const MOCK_REGIONS: Region[] = [
    { id: "1", name: "Ashanti", districts: ["Kumasi Metropolitan", "Obuasi Municipal", "Ejisu Municipal", "Bekwai Municipal"], isExpanded: false },
    {
        id: "2",
        name: "Western Region",
        districts: ["Sekondi-Takoradi Metropolitan", "Tarkwa-Nsuaem", "Ahanta West", "Ellembelle"],
        isExpanded: true,
    },
    { id: "3", name: "Northern Region", districts: ["Tamale Metropolitan", "Sagnarigu"], isExpanded: false },
    { id: "4", name: "Greater Accra Region", districts: [], isExpanded: false },
];

export default function CityManagement() {
    const [regions, setRegions] = useState<Region[]>(MOCK_REGIONS);
    const [newRegionName, setNewRegionName] = useState("");
    const [districtDrafts, setDistrictDrafts] = useState<Record<string, string>>({});

    const toggleExpand = (id: string) => {
        setRegions((prev) =>
            prev.map((r) => (r.id === id ? { ...r, isExpanded: !r.isExpanded } : r))
        );
    };

    const handleDeleteRegion = (id: string) => {
        setRegions((prev) => prev.filter((r) => r.id !== id));
    };

    const handleDeleteDistrict = (regionId: string, index: number) => {
        setRegions((prev) =>
            prev.map((r) =>
                r.id === regionId
                    ? { ...r, districts: r.districts.filter((_, i) => i !== index) }
                    : r
            )
        );
    };

    const handleDistrictDraftChange = (regionId: string, value: string) => {
        setDistrictDrafts((prev) => ({ ...prev, [regionId]: value }));
    };

    const handleAddDistrict = (regionId: string) => {
        const value = districtDrafts[regionId]?.trim();
        if (!value) return;
        setRegions((prev) =>
            prev.map((r) =>
                r.id === regionId ? { ...r, districts: [...r.districts, value] } : r
            )
        );
        setDistrictDrafts((prev) => ({ ...prev, [regionId]: "" }));
    };

    const handleAddRegion = () => {
        const value = newRegionName.trim();
        if (!value) return;
        const newRegion: Region = {
            id: `new-${Date.now()}`,
            name: value,
            districts: [],
            isExpanded: false,
        };
        setRegions((prev) => [...prev, newRegion]);
        setNewRegionName("");
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-900">All Cities</h2>

                <div className="space-y-3">
                    {regions.map((region) => (
                        <div key={region.id} className="overflow-hidden rounded-lg bg-gray-100">
                            {/* Region row */}
                            <div className="flex items-center justify-between px-4 py-3.5">
                                <span className="text-sm font-semibold text-gray-800">
                                    {region.name}
                                    {region.districts.length > 0 ? ` (${region.districts.length})` : ""}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleExpand(region.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-gray-700 transition hover:bg-gray-50"
                                        aria-label={region.isExpanded ? "Collapse" : "Expand"}
                                    >
                                        {region.isExpanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRegion(region.id)}
                                        className="flex h-8 w-8 items-center justify-center text-red-500 transition hover:text-red-600"
                                        aria-label="Delete region"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Districts */}
                            {region.isExpanded && (
                                <div className="px-4 pb-4">
                                    <div className="divide-y divide-gray-200/70">
                                        {region.districts.map((district, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-3">
                                                <span className="text-sm text-gray-600">{district}</span>
                                                <button
                                                    onClick={() => handleDeleteDistrict(region.id, idx)}
                                                    className="text-red-500 transition hover:text-red-600"
                                                    aria-label="Delete district"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add district */}
                                    <div className="mt-3 flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-transparent px-4 py-2.5">
                                        <input
                                            type="text"
                                            value={districtDrafts[region.id] ?? ""}
                                            onChange={(e) => handleDistrictDraftChange(region.id, e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddDistrict(region.id)}
                                            placeholder="Enter Metropolitan District Name"
                                            className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleAddDistrict(region.id)}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add new region */}
                <div className="mt-4 flex items-center gap-3">
                    <input
                        type="text"
                        value={newRegionName}
                        onChange={(e) => setNewRegionName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddRegion()}
                        placeholder="Enter Region Name"
                        className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                    <button
                        onClick={handleAddRegion}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}