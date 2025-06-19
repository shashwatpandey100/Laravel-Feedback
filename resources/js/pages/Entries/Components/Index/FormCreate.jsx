import { useForm } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import Popup from './Popup';

const FormCreate = ({ showCreateForm, setCreateForm }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('entries.store'), {
            onSuccess: () => {
                console.log('fired');
                reset();
                setCreateForm(false);
            },
        });
    };

    if (!showCreateForm) return null;

    return (
        <AnimatePresence>
            <Popup onClose={() => setCreateForm(false)}>
                <div className="mx-auto w-full max-w-md overflow-hidden bg-white">
                    <form onSubmit={handleSubmit}>
                        <header className="mb-5">
                            <h3 className="text-center text-[18px] font-semibold text-gray-900">Create New Form</h3>
                            <p className="mt-3 rounded-xl bg-purple-50/70 p-4 text-sm text-purple-700">
                                Your feedback form will remain a draft if no questions have been added!
                            </p>
                        </header>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">
                                    Form Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter form title"
                                    className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-[14px] text-gray-900 placeholder:text-gray-500 focus:underline focus:outline-none"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="mt-1">
                                <label htmlFor="description" className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">
                                    Description (optional)
                                </label>
                                <textarea
                                    id="description"
                                    rows={7}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Briefly explain your form"
                                    className="mt-1 block w-full resize-none rounded-md bg-gray-100 px-3 py-2 text-[14px] text-gray-900 placeholder-gray-500 focus:underline focus:outline-none"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-3 pt-4 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setCreateForm(false)}
                                className="flex cursor-pointer items-center gap-1 rounded-[7px] bg-gray-100 px-4 py-1.5 text-[13px] font-[500] hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <div className="flex cursor-pointer items-center rounded-[7px] bg-black px-4 py-1.5 text-white hover:bg-black/80">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    onClick={() => setCreateForm(true)}
                                    className="flex cursor-pointer items-center gap-1 text-[13px] font-[500] text-white/90"
                                >
                                    <span>{processing ? 'Creating...' : 'Create Form'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Popup>
        </AnimatePresence>
    );
};

export default FormCreate;
