import { Head, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Create({ entry, questions }) {
    const { data, setData, post, processing, errors } = useForm({
        answers: {},
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [ratingHover, setRatingHover] = useState({});
    const [completed, setCompleted] = useState(new Set());
    const [clientErrors, setClientErrors] = useState({});

    useEffect(() => {
        const newCompleted = new Set();
        Object.entries(data.answers).forEach(([questionId, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                newCompleted.add(parseInt(questionId));
            }
        });
        setCompleted(newCompleted);
    }, [data.answers]);

    const handleInputChange = (questionId, value) => {
        if (clientErrors[questionId]) {
            setClientErrors({
                ...clientErrors,
                [questionId]: null,
            });
        }

        setData('answers', {
            ...data.answers,
            [questionId]: value,
        });
    };

    const validateCurrentQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return true;

        if (
            currentQuestion.is_required &&
            (data.answers[currentQuestion.id] === undefined || data.answers[currentQuestion.id] === null || data.answers[currentQuestion.id] === '')
        ) {
            setClientErrors({
                ...clientErrors,
                [currentQuestion.id]: 'This question is required',
            });

            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateCurrentQuestion()) {
            post(route('feedback.store', entry.slug));
        }
    };

    const goToNextQuestion = () => {
        if (validateCurrentQuestion() && currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const currentQuestion = questions[currentQuestionIndex];
    const progress = (completed.size / questions.length) * 100;

    const isCurrentQuestionAnswered =
        !currentQuestion?.is_required ||
        (data.answers[currentQuestion?.id] !== undefined && data.answers[currentQuestion?.id] !== null && data.answers[currentQuestion?.id] !== '');

    const ratingEmojis = {
        1: { emoji: '😔', label: 'Never' },
        2: { emoji: '🙁', label: 'Rarely' },
        3: { emoji: '😐', label: 'Sometimes' },
        4: { emoji: '🙂', label: 'Often' },
        5: { emoji: '😄', label: 'Always' },
    };

    const renderQuestion = (question) => {
        switch (question.type) {
            case 'text':
                return (
                    <textarea
                        id={`question-${question.id}`}
                        value={data.answers[question.id] || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        className="mt-6 block w-full resize-none rounded-md bg-gray-100 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none"
                        rows={6}
                        placeholder="Type your answer here..."
                    />
                );

            case 'multiple_choice':
                return (
                    <div className="mt-6 space-y-4">
                        {question.options?.map((option, index) => (
                            <motion.div
                                key={index}
                                className="flex cursor-pointer items-center"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <input
                                    id={`question-${question.id}-option-${index}`}
                                    type="radio"
                                    value={option}
                                    checked={data.answers[question.id] === option}
                                    onChange={() => handleInputChange(question.id, option)}
                                    className="h-5 w-5 cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`question-${question.id}-option-${index}`}
                                    className="ml-3 block cursor-pointer text-base font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {option}
                                </label>
                            </motion.div>
                        ))}
                    </div>
                );

            case 'rating':
                return (
                    <div className="mt-10">
                        <div className="flex justify-center space-x-8">
                            {Object.entries(ratingEmojis).map(([value, { emoji, label }]) => {
                                const isSelected = data.answers[question.id] === parseInt(value);
                                const isHovered = ratingHover[question.id] === parseInt(value);

                                return (
                                    <div key={value} className="flex flex-col items-center">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleInputChange(question.id, parseInt(value))}
                                            onMouseEnter={() => setRatingHover({ ...ratingHover, [question.id]: parseInt(value) })}
                                            onMouseLeave={() => setRatingHover({ ...ratingHover, [question.id]: null })}
                                            className={`relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg ${
                                                isSelected ? 'border-2 border-amber-400 bg-amber-100' : isHovered ? 'bg-gray-100' : 'bg-gray-50'
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            )}
                                            <span className="text-4xl">{emoji}</span>
                                        </motion.button>
                                        <span className="mt-2 text-sm font-medium text-gray-800">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <input
                        type="email"
                        id={`question-${question.id}`}
                        value={data.answers[question.id] || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        className="mt-6 block w-full rounded-md bg-gray-100 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none"
                        placeholder="Enter your email"
                    />
                );

            case 'name':
                return (
                    <input
                        type="text"
                        id={`question-${question.id}`}
                        value={data.answers[question.id] || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        className="mt-6 block w-full rounded-md bg-gray-100 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none"
                        placeholder="Enter your name"
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        id={`question-${question.id}`}
                        value={data.answers[question.id] || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        className="mt-6 block w-full rounded-md bg-gray-100 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none"
                        placeholder="Type your answer here..."
                    />
                );
        }
    };

    return (
        <>
            <Head title={`submit a Feedback - ${entry.title}`} />
            <div className="flex min-h-screen w-full flex-col bg-white">
                <div className="flex w-full items-center justify-center">
                    <div className="w-full">
                        <div className="flex w-full">
                            {questions.map((_, idx) => (
                                <div key={idx} className={`h-2 flex-1 ${idx < completed.size ? 'bg-green-500/70' : 'bg-gray-400'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
                    <div className="w-full max-w-2xl">
                        <form onSubmit={handleSubmit} className="w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestionIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="py-4"
                                >
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1}</h3>
                                        <h2 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                            {currentQuestion.label}
                                            {currentQuestion.is_required && <span className="ml-1 text-red-500">*</span>}
                                        </h2>
                                    </div>

                                    {renderQuestion(currentQuestion)}

                                    {(clientErrors[currentQuestion.id] || errors[`answers.${currentQuestion.id}`]) && (
                                        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                                            {clientErrors[currentQuestion.id] || errors[`answers.${currentQuestion.id}`]}
                                        </p>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-16 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={goToPrevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className={`cursor-pointer rounded-full border px-8 py-3 text-base font-medium ${
                                        currentQuestionIndex === 0
                                            ? 'cursor-not-allowed border-gray-300 text-gray-400 opacity-50'
                                            : 'border-gray-300 text-gray-800 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>

                                <button
                                    type={isLastQuestion ? 'submit' : 'button'}
                                    onClick={isLastQuestion ? undefined : goToNextQuestion}
                                    disabled={processing || (currentQuestion?.is_required && !isCurrentQuestionAnswered)}
                                    className={`cursor-pointer rounded-full px-8 py-3 text-base font-medium ${
                                        currentQuestion?.is_required && !isCurrentQuestionAnswered
                                            ? 'cursor-not-allowed bg-gray-400'
                                            : 'bg-black text-white hover:bg-gray-800'
                                    } disabled:opacity-70`}
                                >
                                    {isLastQuestion ? (processing ? 'Submitting...' : 'Submit Feedback') : 'Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mb-2 text-center text-[12px] text-gray-500 dark:text-gray-400">Powered by Feedback Forms</div>
            </div>
        </>
    );
}
