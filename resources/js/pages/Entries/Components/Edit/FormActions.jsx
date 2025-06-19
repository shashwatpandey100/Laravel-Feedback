import { Link } from '@inertiajs/react';

export default function FormActions({ entry, isSaving }) {
    return (
        <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
            <div className="flex justify-between">
                <div>
                    <span></span>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href={`/f/${entry.slug}`}
                        target="_blank"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Preview Form
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex cursor-pointer items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-70"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
