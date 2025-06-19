export default function FormBasicInfo({ data, setData, errors }) {
    return (
        <>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Form Title
                    <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-[14px] text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none"
                    placeholder="Enter form title"
                    required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                </label>
                <textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Briefly explain your form"
                    className="mt-1 block w-full resize-none rounded-md bg-white px-3 py-2 text-[14px] text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
        </>
    );
}
