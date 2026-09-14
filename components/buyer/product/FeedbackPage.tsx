'use client';

import {
    ChevronRight,
    Frown,
    Meh,
    Paperclip,
    Smile,
    UserCircle,
} from 'lucide-react';

interface FeedbackComment {
    author: string;
    date: string;
    message: string;
    likes?: number;
    reply?: string;
}

interface FeedbackPageProps {
    sellerName: string;
    onBack: () => void;
}

const COMMENTS: FeedbackComment[] = [
    {
        author: 'Bobby Umez',
        date: '29/11/19',
        message: 'very rude seller, too insultive',
        likes: 10,
        reply: 'Why so? What happened?\nMake Una tell me before I enter',
    },
    {
        author: 'Ojo Olatomiwa',
        date: '15/11/19',
        message: 'very rude and aroagant seller. impatient',
        likes: 9,
    },
    {
        author: 'Ojo Olatomiwa',
        date: '15/11/19',
        message: 'very rude and aroagant seller. impatient',
        likes: 9,
    },
];

function FeedbackCount({ icon: Icon, value, label, className }: { icon: typeof Smile; value: number; label: string; className: string }) {
    return (
        <div className={`flex flex-col items-center gap-0.5 ${className}`}>
            <span className="flex items-center gap-1 text-sm"><Icon className="h-4 w-4" />{value}</span>
            <span>{label}</span>
        </div>
    );
}

function FeedbackComment({ comment, sellerReply = false }: { comment: FeedbackComment; sellerReply?: boolean }) {
    return (
        <article className="rounded-lg bg-[#edf3f8] px-3.5 py-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
                <UserCircle className={`h-5 w-5 ${sellerReply ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span>{comment.author}</span>
            </div>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{comment.message}</p>
            {!sellerReply && (
                <div className="mt-4 flex items-center gap-3 text-[10px] text-slate-500">
                    <span>{comment.date}</span>
                    <button type="button" className="hover:text-slate-700">Like</button>
                    <button type="button" className="hover:text-slate-700">Reply</button>
                    {comment.likes !== undefined && <span className="font-semibold text-emerald-600">● {comment.likes}</span>}
                </div>
            )}
        </article>
    );
}

export default function FeedbackPage({ sellerName, onBack }: FeedbackPageProps) {
    return (
        <div className="min-h-screen bg-[#f4f4f4]">
            <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                    <button type="button" onClick={onBack} className="hover:text-slate-700">Home</button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <button type="button" onClick={onBack} className="hover:text-slate-700">Sedan Car</button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-violet-500">Feedback</span>
                </nav>

                <section className="rounded-md border border-slate-200 bg-white shadow-sm">
                    <header className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-lg font-semibold text-slate-900">
                            Feedback about <button type="button" onClick={onBack} className="text-emerald-600 underline decoration-emerald-600 underline-offset-2">{sellerName}</button>
                        </h1>
                        <div className="flex items-center gap-7 text-xs font-medium">
                            <FeedbackCount icon={Smile} value={0} label="Positive" className="text-emerald-500" />
                            <FeedbackCount icon={Meh} value={0} label="Neutral" className="text-orange-400" />
                            <FeedbackCount icon={Frown} value={2} label="Negative" className="text-red-400" />
                        </div>
                    </header>

                    <div className="space-y-6 px-6 py-5">
                        {COMMENTS.map((comment, index) => (
                            <div key={`${comment.author}-${index}`} className={comment.reply ? 'space-y-2' : ''}>
                                <FeedbackComment comment={comment} />
                                {comment.reply && (
                                    <div className="ml-auto max-w-[52%]">
                                        <FeedbackComment
                                            comment={{ author: sellerName, date: '07/05/26', message: comment.reply }}
                                            sellerReply
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center gap-2">
                            <UserCircle className="h-7 w-7 shrink-0 text-emerald-200" />
                            <div className="flex h-8 min-w-0 flex-1 items-center justify-between rounded-md bg-slate-100 px-3 text-xs text-slate-400">
                                <span>Write a reply...</span>
                                <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}