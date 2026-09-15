"use client";

import { useState } from "react";

export default function ApiKeySettings() {
    const [apiKey, setApiKey] = useState("");
    const [hubletApiKey, setHubletApiKey] = useState("");
    const [hubletEnabled, setHubletEnabled] = useState(false);

    const handleSaveApiKey = () => {
        // eslint-disable-next-line no-console
        console.log("Save API key", apiKey);
    };

    const handleSaveHubletKey = () => {
        // eslint-disable-next-line no-console
        console.log("Save Hublet Connect API key", hubletApiKey);
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
                {/* API Key */}
                <h2 className="mb-4 text-base font-semibold text-gray-900">Update Your Api Key</h2>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your api key here"
                        className="w-full rounded-lg bg-blue-50/60 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                    />
                    <button
                        onClick={handleSaveApiKey}
                        className="shrink-0 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                        Save
                    </button>
                </div>

                {/* Hublet Connect */}
                <div className="mb-4 mt-8 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Hublet Connect</h2>
                    <button
                        onClick={() => setHubletEnabled((v) => !v)}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${hubletEnabled ? "bg-amber-500" : "bg-gray-300"
                            }`}
                        aria-pressed={hubletEnabled}
                        aria-label="Toggle Hublet Connect"
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${hubletEnabled ? "translate-x-5" : "translate-x-0.5"
                                }`}
                        />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={hubletApiKey}
                        onChange={(e) => setHubletApiKey(e.target.value)}
                        disabled={!hubletEnabled}
                        placeholder="Enter your api key here"
                        className="w-full rounded-lg bg-blue-50/60 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200 disabled:opacity-60"
                    />
                    <button
                        onClick={handleSaveHubletKey}
                        disabled={!hubletEnabled}
                        className="shrink-0 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}