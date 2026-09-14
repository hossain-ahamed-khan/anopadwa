'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ReportFeedbackProps {
    onBack: () => void;
}

export default function ReportFeedback({ onBack }: ReportFeedbackProps) {
    const [feedback, setFeedback] = useState('');

    return (
        <div className="min-h-screen bg-[#f4f4f4]">
            <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
                    <button type="button" onClick={onBack} className="hover:text-slate-700">Home</button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <button type="button" onClick={onBack} className="hover:text-slate-700">Sedan Car</button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-violet-500">Report</span>
                </nav>

                <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h1 className="text-xl font-semibold text-slate-900">Report Feedback</h1>
                    <form className="mt-5" onSubmit={(event) => event.preventDefault()}>
                        <label htmlFor="report-feedback" className="mb-2 block text-sm font-medium text-slate-800">
                            Feedback
                        </label>
                        <textarea
                            id="report-feedback"
                            value={feedback}
                            onChange={(event) => setFeedback(event.target.value)}
                            placeholder="Enter your text....."
                            className="min-h-24 w-full resize-y rounded-md border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        />
                        <button
                            type="submit"
                            className="mt-3 w-full rounded-md bg-green-700 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                        >
                            Send Feedback
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}