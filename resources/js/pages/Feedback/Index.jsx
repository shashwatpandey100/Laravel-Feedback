import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, Clock, Copy, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useToast } from '../../contexts/ToastContext';
import Pagination from '../Entries/Components/Index/Pagination';
import Popup from '../Entries/Components/Index/Popup';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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
        href: '#',
    },
];

export default function Index({ entry, feedbacks }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [showCopyPopup, setShowCopyPopup] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (feedbacks.data && feedbacks.data.length > 0) {
            generateChartData(feedbacks.data);
        }
    }, [feedbacks]);

    const generateChartData = (feedbackData) => {
        const feedbacksByDate = {};

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 29);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            feedbacksByDate[dateStr] = 0;
        }

        feedbackData.forEach((feedback) => {
            const date = new Date(feedback.submitted_at);
            const dateStr = date.toISOString().split('T')[0];

            if (dateStr in feedbacksByDate) {
                feedbacksByDate[dateStr]++;
            }
        });

        const labels = Object.keys(feedbacksByDate).sort();
        const counts = labels.map((date) => feedbacksByDate[date]);

        const formattedLabels = labels.map((dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        setChartData({
            labels: formattedLabels,
            datasets: [
                {
                    label: 'Responses',
                    data: counts,
                    fill: true,
                    backgroundColor: 'rgba(130, 0, 219, 0.1)',
                    borderColor: 'rgb(130, 0, 219)',
                    tension: 0.4,
                },
            ],
        });
    };

    const handleDeleteClick = (feedback) => {
        setFeedbackToDelete(feedback);
    };

    const handleDelete = () => {
        if (!feedbackToDelete) return;

        setIsDeleting(true);

        router.delete(route('entries.feedback.destroy', [entry.slug, feedbackToDelete.id]), {
            onSuccess: () => {
                showToast('Feedback deleted successfully', 'success');
                setFeedbackToDelete(null);
            },
            onError: (errors) => {
                showToast('Failed to delete feedback', 'error');
                console.error(errors);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleCopyClick = () => {
        setShowCopyPopup(true);
    };

    const handleCopy = () => {
        const url = `${window.location.origin}/f/${entry.slug}`;
        navigator.clipboard.writeText(url);
        setShowCopyPopup(false);
        showToast('Form link copied to clipboard!', 'success');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Feedback - ${entry.title}`} />

            <div className="flex h-full flex-1 flex-col">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-full w-full overflow-hidden">
                    <div className="flex items-center justify-between gap-2 pt-4">
                        <Link
                            href={route('entries.index')}
                            className="flex items-center px-4 text-[14px] font-medium text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft size={16} className="mr-1" /> Back to Forms
                        </Link>
                    </div>

                    <div className="overflow-x-auto px-6 pt-4 pb-6">
                        <div className="mb-6">
                            <div className="flex w-full items-center justify-between">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex gap-3">
                                        <h1 className="text-xl font-semibold">{entry.title}</h1>
                                        <span className="inline-flex items-center rounded-sm bg-purple-100/70 px-2 py-1 text-xs font-medium text-purple-700">
                                            {feedbacks.data.length} {feedbacks.data.length === 1 ? 'response' : 'responses'}
                                        </span>
                                    </div>
                                    <div className="flex h-full cursor-pointer items-center rounded-md bg-gray-100 px-6 py-[0.4rem] hover:bg-gray-200">
                                        <button
                                            onClick={handleCopyClick}
                                            className="flex cursor-pointer items-center gap-2 rounded-2xl text-[13px] font-[500] text-gray-700"
                                        >
                                            <Copy size={14} />
                                            <span>Copy Form Link</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {feedbacks.data.length === 0 ? (
                            <div className="-mt-2 flex h-full flex-col items-center justify-center rounded-2xl py-12 text-center">
                                <p className="mb-1 text-[15px] font-[500] text-gray-700">No feedback responses yet</p>
                                <p className="mb-5 text-[15px] font-[400] text-gray-500">Share your form to start collecting feedback.</p>
                                <div className="flex cursor-pointer items-center rounded-[7px] bg-black px-6 py-1.5 text-white hover:bg-black/80">
                                    <button
                                        onClick={handleCopyClick}
                                        className="flex cursor-pointer items-center gap-1 rounded-2xl text-[13px] font-[500] text-white/90"
                                    >
                                        <Copy size={14} />
                                        <span>Copy form link</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chart Section */}
                                <div className="mb-8 overflow-hidden rounded-[7px] bg-white p-4 shadow-sm">
                                    <h2 className="mb-4 font-medium text-gray-700">Responses Over Time (Last 30 Days)</h2>
                                    <div className="h-64">
                                        {chartData ? (
                                            <Line
                                                data={chartData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                stepSize: 1,
                                                                precision: 0,
                                                            },
                                                            grid: {
                                                                display: true,
                                                                color: 'rgba(0, 0, 0, 0.05)',
                                                            },
                                                        },
                                                        x: {
                                                            grid: {
                                                                display: false,
                                                            },
                                                        },
                                                    },
                                                    plugins: {
                                                        legend: {
                                                            display: false,
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                title: (context) => {
                                                                    return `Date: ${context[0].label}`;
                                                                },
                                                                label: (context) => {
                                                                    return `Responses: ${context.raw}`;
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="overflow-hidden rounded-[7px] shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">ID</th>
                                                <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">Date</th>
                                                <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">Time</th>
                                                <th className="px-6 py-2.5 text-right text-[11px] font-medium text-gray-700 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {feedbacks.data.map((feedback) => (
                                                <tr key={feedback.id}>
                                                    <td className="px-6 py-2 text-[13px] text-gray-600">#{feedback.id}</td>
                                                    <td className="px-6 py-2 text-[13px] text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            {formatDate(feedback.submitted_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-2 text-[13px] text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} className="text-gray-400" />
                                                            {formatTime(feedback.submitted_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-2 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <Link
                                                                href={route('entries.feedback.show', [entry.slug, feedback.id])}
                                                                title="View details"
                                                            >
                                                                <span className="inline-flex items-center rounded-sm bg-purple-100/70 px-2 py-1 text-xs font-medium text-purple-700">
                                                                    View
                                                                </span>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteClick(feedback)}
                                                                disabled={isDeleting}
                                                                className="cursor-pointer text-gray-500 hover:text-red-600 disabled:opacity-50"
                                                                title="Delete feedback"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        {feedbacks.data.length > 0 && feedbacks.links && feedbacks.links.length > 3 && (
                            <div className="mt-4 flex justify-center">
                                <Pagination
                                    links={feedbacks.links}
                                    onPageChange={(page) => router.get(page)}
                                    currentPage={feedbacks.current_page}
                                    lastPage={feedbacks.last_page}
                                    disabled={isDeleting}
                                />
                                {isDeleting && (
                                    <div className="mt-4 flex justify-center">
                                        <Loader2 className="animate-spin text-gray-500" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Copy to Clipboard Popup */}
            <AnimatePresence>
                {showCopyPopup && <CopyLinkPopup entry={entry} onClose={() => setShowCopyPopup(false)} onCopy={handleCopy} />}
            </AnimatePresence>

            {/* Delete Confirmation Popup */}
            <AnimatePresence>
                {feedbackToDelete && (
                    <DeleteFeedbackPopup
                        feedback={feedbackToDelete}
                        isDeleting={isDeleting}
                        onClose={() => setFeedbackToDelete(null)}
                        onConfirm={handleDelete}
                    />
                )}
            </AnimatePresence>
        </AppLayout>
    );
}

// Popup for copying form link
function CopyLinkPopup({ entry, onClose, onCopy }) {
    return (
        <Popup onClose={onClose}>
            <div className="mx-auto w-full max-w-md overflow-hidden bg-white">
                <header className="mb-4">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                            <Copy size={24} className="text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-center text-[18px] font-semibold text-gray-900">Copy Form Link</h3>
                </header>

                <div className="space-y-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-center text-sm text-gray-700">
                            Share this link to collect feedback for <span className="font-bold">"{entry.title}"</span>
                        </p>
                        <div className="mt-3 flex items-center overflow-hidden rounded-md border border-gray-200 bg-white">
                            <code className="flex-1 overflow-hidden px-3 py-2 text-sm overflow-ellipsis whitespace-nowrap text-gray-600">
                                {`${window.location.origin}/f/${entry.slug}`}
                            </code>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-between space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex cursor-pointer items-center gap-1 rounded-[7px] bg-gray-100 px-4 py-1.5 text-[13px] font-[500] hover:bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onCopy}
                        className="flex cursor-pointer items-center gap-1.5 rounded-[7px] bg-purple-600 px-4 py-1.5 text-[13px] font-[500] text-white hover:bg-purple-700"
                    >
                        <CheckCircle size={14} />
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        </Popup>
    );
}

// Popup for deleting feedback
function DeleteFeedbackPopup({ feedback, isDeleting, onClose, onConfirm }) {
    return (
        <Popup onClose={onClose}>
            <div className="mx-auto w-full max-w-md overflow-hidden bg-white">
                <header className="mb-4">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle size={24} className="text-red-600" />
                        </div>
                    </div>
                    <h3 className="text-center text-[18px] font-semibold text-gray-900">Delete Feedback</h3>
                </header>

                <div className="space-y-4">
                    <div className="rounded-xl bg-red-50 p-4">
                        <p className="text-center text-sm text-red-700">Are you sure you want to delete feedback #{feedback.id}?</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-between space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex cursor-pointer items-center gap-1 rounded-[7px] bg-gray-100 px-4 py-1.5 text-[13px] font-[500] hover:bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex cursor-pointer items-center gap-1.5 rounded-[7px] bg-red-500 px-4 py-1.5 text-[13px] font-[500] text-white hover:bg-red-600 disabled:opacity-50"
                    >
                        <Trash2 size={14} />
                        {isDeleting ? 'Deleting...' : 'Delete Feedback'}
                    </button>
                </div>
            </div>
        </Popup>
    );
}
