import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const popupVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

const Popup = ({ onClose, children }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                exit: { opacity: 0 },
            }}
        >
            <motion.div
                ref={modalRef}
                className="relative w-max rounded-[14px] bg-white p-6 shadow-lg"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={popupVariants}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default Popup;
