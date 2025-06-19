import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DraggableList from './DraggableList';
import QuestionCreate from './QuestionCreate';

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
        title: 'Questions',
        href: '#',
    },
];

const QuestionTypes = [
    { id: 'text', name: 'Text Input', description: 'Free-form text response' },
    { id: 'multiple_choice', name: 'Multiple Choice', description: 'Choose from options' },
    { id: 'rating', name: 'Rating', description: '1-5 star rating' },
    { id: 'name', name: 'Name', description: 'Respondent name' },
    { id: 'email', name: 'Email', description: 'Email address' },
];

export default function Index({ entry, questions: initialQuestions, feedbackCount = 0 }) {
    const [questions, setQuestions] = useState(initialQuestions);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const openCreateModal = () => {
        setEditingQuestion(null);
        setShowQuestionForm(true);
    };

    const openEditModal = (question) => {
        setEditingQuestion(question);
        setShowQuestionForm(true);
    };

    const confirmDelete = (questionId) => {
        if (confirm('Are you sure you want to delete this question?')) {
            router.delete(route('entries.questions.destroy', [entry.slug, questionId]));
        }
    };

    const handleQuestionsOrderChange = (newOrder) => {
        router.post(route('entries.questions.order', entry.slug), { questions: newOrder }, { preserveState: true });
    };

    const renderQuestionItem = (question, isDragging = false) => (
        <div className={`relative rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${isDragging ? 'opacity-80' : ''}`}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium">{question.label}</h3>
                        {question.is_required && (
                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                Required
                            </span>
                        )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {QuestionTypes.find((t) => t.id === question.type)?.name || question.type}
                        </span>

                        {question.type === 'multiple_choice' && question.options && <span>({question.options.length} options)</span>}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => openEditModal(question)}
                        disabled={!canModifyQuestions}
                        className={`rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700 ${
                            !canModifyQuestions ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        title={!canModifyQuestions ? 'Cannot edit after receiving feedback' : 'Edit question'}
                    >
                        <Edit size={16} />
                    </button>

                    <button
                        onClick={() => confirmDelete(question.id)}
                        disabled={!canModifyQuestions}
                        className={`rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 ${
                            !canModifyQuestions ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        title={!canModifyQuestions ? 'Cannot delete after receiving feedback' : 'Delete question'}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    const canModifyQuestions = feedbackCount === 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Questions - ${entry.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="relative overflow-hidden">
                    <div className="mb-6 flex items-center">
                        <div className="w-full">
                            <Link
                                href={route('entries.index')}
                                className="px4 mb-4 flex items-center text-[14px] font-medium text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Back to Forms
                            </Link>
                            <div className="flex w-full items-center justify-between">
                                <div className="flex gap-3">
                                    <h1 className="text-xl font-semibold">{entry.title}</h1>
                                    <span className="inline-flex items-center justify-center rounded-sm bg-purple-100/70 px-2 py-1 text-xs font-medium text-purple-700">
                                        {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                                    </span>
                                </div>

                                <div className="flex h-full cursor-pointer items-center rounded-md bg-black px-6 py-[0.4rem] text-white hover:bg-black/80">
                                    <button
                                        onClick={openCreateModal}
                                        disabled={!canModifyQuestions}
                                        className={`flex items-center gap-2 rounded-2xl text-[13px] font-[500] text-white/90 ${
                                            !canModifyQuestions ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        title={!canModifyQuestions ? 'Cannot modify questions after receiving feedback' : ''}
                                    >
                                        <Plus size={16} />
                                        <span>Add Question</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!canModifyQuestions && (
                        <div className="mb-6 rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            <p className="text-sm">
                                This form has received responses. To maintain data integrity, questions cannot be added, edited or reordered. Create a
                                new form if you need to modify questions.
                            </p>
                        </div>
                    )}

                    {questions.length === 0 ? (
                        <div className="mt-8 rounded-md bg-gray-50 px-8 py-14 text-center dark:border-gray-700 dark:bg-gray-800/50">
                            <p className="mb-1 text-[16px] font-[500] text-gray-700">No questions yet</p>
                            <p className="mb-6 text-[14px] font-[400] text-gray-500">
                                Add questions to start collecting feedback. Your form will remain in draft mode until you add at least one question.
                            </p>
                            <div className="mx-auto flex h-full w-max cursor-pointer items-center rounded-md bg-black px-6 py-[0.4rem] text-white hover:bg-black/80">
                                <button
                                    onClick={openCreateModal}
                                    className="flex cursor-pointer items-center gap-2 rounded-2xl text-[13px] font-[500] text-white/90"
                                >
                                    <Plus size={16} />
                                    <span>Add First Question</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <DraggableList
                            items={questions}
                            onChange={setQuestions}
                            onOrderChange={handleQuestionsOrderChange}
                            renderItem={renderQuestionItem}
                            disabled={!canModifyQuestions}
                        />
                    )}
                </div>
            </div>

            <QuestionCreate
                showQuestionForm={showQuestionForm}
                setShowQuestionForm={setShowQuestionForm}
                entrySlug={entry.slug}
                editingQuestion={editingQuestion}
            />
        </AppLayout>
    );
}
