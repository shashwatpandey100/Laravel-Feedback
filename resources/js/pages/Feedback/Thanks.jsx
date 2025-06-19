import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Thanks({ entry }) {
    return (
        <>
            <Head title={`Feedback submitted - ${entry.title}`} />
            <div className="flex min-h-screen w-full flex-col bg-white dark:bg-gray-900">
                <div className="flex w-full items-center justify-center">
                    <div className="w-full">
                        <div className="flex w-full">
                            <div className="h-2 w-full flex-1 bg-green-500/70" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
                    <div className="w-full max-w-md">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                                delay: 0.1,
                            }}
                            className="flex justify-center"
                        >
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <Check size={40} className="text-green-600 dark:text-green-400" strokeWidth={2} />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h2 className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-white">Thank You!</h2>
                            <p className="text-md mt-1 text-center text-gray-600 dark:text-gray-400">
                                Your feedback has been submitted successfully.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 rounded-lg bg-gray-50 p-10 shadow-md dark:bg-gray-800"
                        >
                            <h3 className="text-md text-center font-medium text-gray-900 dark:text-white">Your response has been recorded</h3>
                            <p className="text-md mt-2 text-center text-gray-600 dark:text-gray-400">
                                Thank you for taking the time to provide feedback on <span className="font-medium">"{entry.title}"</span>.
                            </p>

                            <div className="mt-8 flex justify-center">
                                <Link
                                    href={route('feedback.create', entry.slug)}
                                    className="rounded-full bg-black px-6 py-2 text-[14px] font-medium text-white transition-colors hover:bg-gray-800"
                                >
                                    Submit another response
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mb-2 text-center text-[12px] text-gray-500 dark:text-gray-400">Powered by Feedback Forms</div>
            </div>
        </>
    );
}
