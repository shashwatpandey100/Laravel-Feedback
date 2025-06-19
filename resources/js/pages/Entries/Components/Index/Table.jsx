import { Link, router } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle, Copy, Edit, Eye, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../../../contexts/ToastContext';
import Popup from './Popup';

const Table = ({ entries }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const [deleting, setDeleting] = useState(null);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const { showToast } = useToast();

    const handleDeleteClick = (entry) => {
        setEntryToDelete(entry);
    };

    const handleDelete = () => {
        if (!entryToDelete) return;

        setDeleting(entryToDelete.slug);

        router.delete(route('entries.destroy', entryToDelete.slug), {
            onSuccess: () => {
                showToast('Form deleted successfully', 'success');
                setEntryToDelete(null);
            },
            onError: (errors) => {
                showToast('Failed to delete form', 'error');
                console.error(errors);
            },
            onFinish: () => setDeleting(null),
        });
    };

    const copyToClipboard = (slug) => {
        const url = `${window.location.origin}/f/${slug}`;
        navigator.clipboard.writeText(url);
        showToast('Form link copied to clipboard!', 'success');
    };

    return (
        <>
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">Created</th>
                        <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">Title</th>
                        <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">Description</th>
                        <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-2.5 text-left text-[11px] font-medium text-gray-700 uppercase">Responses</th>
                        <th className="px-6 py-2.5 text-right text-[11px] font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {entries.map((entry) => (
                        <tr key={entry.id}>
                            <td className="px-6 py-2 text-[13px] text-gray-600">{formatDate(entry.created_at)}</td>
                            <td className="px-6 py-2 text-[14px] text-purple-700">
                                <Link href={'entries/' + entry.slug + '/feedback'} className="hover:underline">
                                    {entry.title}
                                </Link>
                            </td>
                            <td className="max-w-xs truncate px-6 py-2 text-[14px] text-gray-600">{entry.description || '-'}</td>
                            <td className="px-6 py-2">
                                {entry.status === 'published' ? (
                                    <span className="inline-flex items-center rounded-sm bg-purple-100/70 px-2 py-1 text-xs font-medium text-purple-700">
                                        Published
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-sm bg-amber-100/70 px-2 py-1 text-xs font-medium text-amber-700">
                                        Draft
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-2 text-[14px]">
                                <Link
                                    href={route('entries.feedback.index', entry.slug)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-indigo-600"
                                >
                                    <FileText size={16} />
                                    {entry.feedbacks_count || 0}
                                </Link>
                            </td>
                            <td className="px-6 py-2 text-right">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => copyToClipboard(entry.slug)}
                                        className="cursor-pointer text-gray-500 hover:text-indigo-600"
                                        title="Copy form link"
                                    >
                                        <Copy size={16} />
                                    </button>

                                    <Link
                                        href={route('entries.questions.index', entry.slug)}
                                        className="text-gray-500 hover:text-indigo-600"
                                        title="View form"
                                    >
                                        <Eye size={16} />
                                    </Link>

                                    <Link href={route('entries.edit', entry.slug)} className="text-gray-500 hover:text-green-600" title="Edit form">
                                        <Edit size={16} />
                                    </Link>

                                    <button
                                        onClick={() => handleDeleteClick(entry)}
                                        disabled={deleting === entry.slug}
                                        className="cursor-pointer text-gray-500 hover:text-red-600 disabled:opacity-50"
                                        title="Delete form"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AnimatePresence>
                {entryToDelete && (
                    <DeleteConfirmationPopup
                        entry={entryToDelete}
                        isDeleting={deleting === entryToDelete.slug}
                        onClose={() => setEntryToDelete(null)}
                        onConfirm={handleDelete}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

function DeleteConfirmationPopup({ entry, isDeleting, onClose, onConfirm }) {
    return (
        <Popup onClose={onClose}>
            <div className="mx-auto w-full max-w-md overflow-hidden bg-white">
                <header className="mb-4">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle size={24} className="text-red-600" />
                        </div>
                    </div>
                    <h3 className="text-center text-[18px] font-semibold text-gray-900">Delete Form</h3>
                </header>

                <div className="space-y-4">
                    <div className="rounded-xl bg-red-50 p-4">
                        <p className="text-center text-sm text-red-700">
                            Are you sure you want to delete <span className="font-bold">"{entry.title}"</span>?
                        </p>
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
                        {isDeleting ? 'Deleting...' : 'Delete Form'}
                    </button>
                </div>
            </div>
        </Popup>
    );
}

export default Table;
