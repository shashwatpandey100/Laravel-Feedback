import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Feedback Forms',
        href: '/entries',
    },
    {
        title: 'Feedback',
        href: route('entries.feedback.index', window.location.pathname.split('/')[2]),
    },
    {
        title: 'Details',
        href: '#',
    },
];

export default function Show({ entry, feedback, answers }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
            setIsDeleting(true);
            router.delete(route('entries.feedback.destroy', [entry.slug, feedback.id]), {
                onSuccess: () => router.visit(route('entries.feedback.index', entry.slug)),
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const ratingEmojis = {
        1: '😔',
        2: '🙁',
        3: '😐',
        4: '🙂',
        5: '😄',
    };

    const renderAnswerValue = (answer) => {
        const { question, value } = answer;

        switch (question.type) {
            case 'multiple_choice':
                return <span className="font-medium">{value}</span>;

            case 'rating':
                const rating = parseInt(value, 10);
                return (
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xl">{ratingEmojis[rating]}</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{rating}/5</span>
                    </div>
                );

            case 'email':
                return (
                    <a href={`mailto:${value}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        {value}
                    </a>
                );

            default:
                return value;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Feedback Details - ${entry.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="relative">
                    <div className="mb-6 flex items-center">
                        <div className="w-full px-2">
                            <Link
                                href={route('entries.feedback.index', entry.slug)}
                                className="mb-4 flex items-center text-[14px] font-medium text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Back to Feedback List
                            </Link>
                            <div className="flex w-full items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-semibold">Feedback #{feedback.id}</h1>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <Calendar size={14} className="mr-1.5" />
                                        Submitted on {formatDate(feedback.submitted_at)}
                                    </div>
                                </div>

                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex cursor-pointer items-center gap-1.5 rounded-md bg-red-50 px-4 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                >
                                    <Trash2 size={16} />
                                    Delete Feedback
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg shadow-sm">
                            <div className="px-6 py-4">
                                <h2 className="text-lg font-medium">Responses</h2>
                                <div className="divide-y divide-gray-100">
                                    {answers.map((answer) => (
                                        <div key={answer.id} className="py-4">
                                            <h3 className="text-[14px] font-medium text-gray-500">
                                                {answer.question.label}
                                                {answer.question.is_required && <span className="ml-1 text-red-500">*</span>}
                                            </h3>
                                            <div className="mt-1 text-[15px] font-medium text-gray-900">{renderAnswerValue(answer)}</div>
                                        </div>
                                    ))}

                                    {answers.length === 0 && (
                                        <div className="py-4 text-center text-gray-500">No responses recorded for this feedback.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
