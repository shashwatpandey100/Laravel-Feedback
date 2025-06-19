export default function FormStatusToggle({ status, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Form Status</label>
            <div className="mt-3 flex space-x-4">
                <div
                    className={`flex-1 cursor-pointer rounded-md border p-4 transition-all ${
                        status === 'draft' ? 'border-amber-300 bg-amber-50' : 'border-transparent bg-white shadow-sm'
                    }`}
                    onClick={() => onChange('draft')}
                >
                    <div className="flex items-center">
                        <input
                            id="status-draft"
                            name="status"
                            type="radio"
                            checked={status === 'draft'}
                            onChange={() => onChange('draft')}
                            className="h-4 w-4 border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="status-draft" className="ml-3 flex cursor-pointer flex-col">
                            <span className="text-sm font-medium text-gray-900">Draft</span>
                            <span className="text-xs text-gray-500">Not visible to others</span>
                        </label>
                    </div>
                </div>

                <div
                    className={`flex-1 cursor-pointer rounded-md border p-4 transition-all ${
                        status === 'published' ? 'border-green-300 bg-green-50' : 'border-transparent bg-white shadow-sm'
                    }`}
                    onClick={() => onChange('published')}
                >
                    <div className="flex items-center">
                        <input
                            id="status-published"
                            name="status"
                            type="radio"
                            checked={status === 'published'}
                            onChange={() => onChange('published')}
                            className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="status-published" className="ml-3 flex cursor-pointer flex-col">
                            <span className="text-sm font-medium text-gray-900">Published</span>
                            <span className="text-xs text-gray-500">Available for feedback</span>
                        </label>
                    </div>
                </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
