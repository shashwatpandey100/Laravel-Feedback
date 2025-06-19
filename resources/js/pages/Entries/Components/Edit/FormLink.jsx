import { CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';

export default function FormLink({ entry, isPublished }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${window.location.origin}/f/${entry.slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-10 rounded-lg bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Link</h3>
                {!isPublished && (
                    <span className="inline-flex items-center rounded-sm bg-amber-100/70 px-2 py-1 text-xs font-medium text-amber-700">
                        Draft Mode
                    </span>
                )}
            </div>

            <div className="mt-2 flex items-center rounded-md bg-white p-2 shadow-sm dark:bg-gray-700">
                <code className="flex-1 overflow-x-auto px-2 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {window.location.origin}/f/{entry.slug}
                </code>
                <button
                    onClick={copyToClipboard}
                    className="ml-2 flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                >
                    {copied ? (
                        <>
                            <CheckCircle size={14} className="text-green-500" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Share this link with people you want to collect feedback from.
                {!isPublished && " Note: The form is currently in draft mode and won't be accessible until published."}
            </p>
        </div>
    );
}
