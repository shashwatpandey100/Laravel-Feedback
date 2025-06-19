import { router } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../../../contexts/ToastContext';
import Popup from '../Index/Popup';

export default function DangerZone({ entry }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const { showToast } = useToast();

    const handleDelete = () => {
        setIsDeleting(true);

        const pendingToast = showToast('Deleting form...', 'loading');

        router.delete(route('entries.destroy', entry.slug), {
            onSuccess: () => {
                showToast('Form deleted successfully', 'success');
                setShowDeletePopup(false);
            },
            onError: (errors) => {
                showToast('Failed to delete form', 'error');
                console.error(errors);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between">
                <h3 className="text-md px-2 font-bold text-gray-900 dark:text-white">Danger Zone</h3>
            </div>
            <div className="mt-2 rounded-lg bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-900/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Delete this form</h4>
                        <p className="mt-1 text-sm font-medium text-red-700 dark:text-red-300">
                            Once you delete a form, all of its data will be permanently removed. This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDeletePopup(true)}
                        disabled={isDeleting}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:opacity-80 disabled:opacity-50"
                    >
                        <Trash2 size={14} />
                        {isDeleting ? 'Deleting...' : 'Delete Form'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showDeletePopup && (
                    <DeleteConfirmationPopup
                        isDeleting={isDeleting}
                        onClose={() => setShowDeletePopup(false)}
                        onConfirm={handleDelete}
                        formTitle={entry.title}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function DeleteConfirmationPopup({ isDeleting, onClose, onConfirm, formTitle }) {
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
                            Are you sure you want to delete <span className="font-bold">"{formTitle}"</span>?
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
