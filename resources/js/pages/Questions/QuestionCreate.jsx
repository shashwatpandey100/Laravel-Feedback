import { router, useForm } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Popup from '../Entries/Components/Index/Popup';

const QuestionCreate = ({ showQuestionForm, setShowQuestionForm, entrySlug, editingQuestion }) => {
    const { showToast } = useToast();
    const { data, setData, post, put, processing, reset, errors } = useForm({
        label: '',
        type: 'text',
        is_required: true,
        options: null,
    });

    useEffect(() => {
        if (editingQuestion) {
            setData({
                label: editingQuestion.label || '',
                type: editingQuestion.type || 'text',
                is_required: editingQuestion.is_required || false,
                options: editingQuestion.type === 'multiple_choice' ? (editingQuestion.options?.length ? editingQuestion.options : ['']) : null,
            });
        } else {
            reset({
                label: '',
                type: 'text',
                is_required: true,
                options: null,
            });
        }
    }, [editingQuestion, setData, reset]);

    useEffect(() => {
        if (data.type === 'multiple_choice') {
            if (!data.options || !Array.isArray(data.options) || data.options.length === 0) {
                setData('options', ['']);
            }
        } else {
            setData('options', null);
        }
    }, [data.type, setData]);

    const handleAddOption = () => {
        if (!data.options || !Array.isArray(data.options)) {
            setData('options', ['']);
            return;
        }

        setData('options', [...data.options, '']);
    };

    const handleOptionChange = (index, value) => {
        if (!data.options || !Array.isArray(data.options)) {
            return;
        }

        const updatedOptions = [...data.options];
        updatedOptions[index] = value;
        setData('options', updatedOptions);
    };

    const handleRemoveOption = (index) => {
        if (!data.options || !Array.isArray(data.options) || data.options.length <= 1) {
            return;
        }

        const updatedOptions = [...data.options];
        updatedOptions.splice(index, 1);
        setData('options', updatedOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submissionData = {
            label: data.label,
            type: data.type,
            is_required: data.is_required,
        };

        if (data.type === 'multiple_choice' && Array.isArray(data.options) && data.options.length > 0) {
            submissionData.options = data.options.filter((option) => option.trim() !== '');

            if (submissionData.options.length === 0) {
                submissionData.options = [''];
            }
        }

        setShowQuestionForm(false);

        if (editingQuestion) {
            put(route('entries.questions.update', [entrySlug, editingQuestion.id]), submissionData, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    showToast('Question updated successfully', 'success');

                    router.reload({ only: ['questions'] });
                },
                onError: (errors) => {
                    showToast('Failed to update question', 'error');
                    console.error('Error updating question:', errors);
                    setShowQuestionForm(true);
                },
            });
        } else {
            post(route('entries.questions.store', entrySlug), submissionData, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    showToast('Question added successfully', 'success');

                    router.reload({ only: ['questions'] });
                },
                onError: (errors) => {
                    showToast('Failed to add question', 'error');
                    console.error('Error creating question:', errors);
                    setShowQuestionForm(true);
                },
            });
        }
    };

    if (!showQuestionForm) return null;

    return (
        <AnimatePresence>
            <Popup onClose={() => setShowQuestionForm(false)}>
                <div className="mx-auto w-[500px] overflow-hidden bg-white">
                    <form onSubmit={handleSubmit}>
                        <header className="mb-5">
                            <h3 className="text-center text-[18px] font-semibold text-gray-900 dark:text-gray-100">
                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                            </h3>
                        </header>

                        {errors && Object.keys(errors).length > 0 && (
                            <div className="mb-4 rounded-md bg-red-50 p-3 text-red-500">
                                <p className="font-medium">Please correct the following errors:</p>
                                <ul className="mt-1 list-inside list-disc text-sm">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <li key={field}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="label" className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">
                                    Question Label
                                </label>
                                <input
                                    type="text"
                                    id="label"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="Enter your question"
                                    className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-[14px] text-gray-900 placeholder:text-gray-500 focus:underline focus:outline-none"
                                />
                                {errors.label && <p className="mt-1 text-sm text-red-500">{errors.label}</p>}
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">
                                    Question Type
                                </label>
                                <div className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-[14px] text-gray-900 placeholder:text-gray-500 focus:underline focus:outline-none">
                                    <select
                                        id="type"
                                        className="w-full bg-transparent focus:outline-none"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value="text">Text Input</option>
                                        <option value="multiple_choice">Multiple Choice</option>
                                        <option value="rating">Rating</option>
                                        <option value="name">Name</option>
                                        <option value="email">Email</option>
                                    </select>
                                </div>
                                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                            </div>

                            {/* Options for multiple choice */}
                            {data.type === 'multiple_choice' && (
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300">Options</label>

                                    {Array.isArray(data.options) &&
                                        data.options.map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[14px] text-gray-900 placeholder-gray-400 shadow-sm focus:underline focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(index)}
                                                    disabled={!Array.isArray(data.options) || data.options.length <= 1}
                                                    className="rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}

                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="mt-2 flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 py-2 text-[13px] text-gray-600 hover:border-gray-400 hover:text-gray-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Option
                                    </button>

                                    {errors.options && <p className="mt-1 text-sm text-red-500">{errors.options}</p>}
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_required"
                                    checked={data.is_required}
                                    onChange={(e) => setData('is_required', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0"
                                />
                                <label htmlFor="is_required" className="ml-2 text-[13px] text-gray-700 dark:text-gray-300">
                                    Required question
                                </label>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-3 pt-4 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setShowQuestionForm(false)}
                                className="flex cursor-pointer items-center gap-1 rounded-[7px] bg-gray-100 px-4 py-1.5 text-[13px] font-[500] hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <div className="flex cursor-pointer items-center rounded-[7px] bg-black px-4 py-1.5 text-white hover:bg-black/80">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex cursor-pointer items-center gap-1 text-[13px] font-[500] text-white/90"
                                >
                                    <span>
                                        {processing
                                            ? editingQuestion
                                                ? 'Saving...'
                                                : 'Adding...'
                                            : editingQuestion
                                              ? 'Save Changes'
                                              : 'Add Question'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Popup>
        </AnimatePresence>
    );
};

export default QuestionCreate;
