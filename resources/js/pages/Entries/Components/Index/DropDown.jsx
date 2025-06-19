import { useEffect, useRef } from 'react';

export default function Dropdown({ children, onClose, positionRef }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                positionRef?.current &&
                !positionRef.current.contains(event.target)
            ) {
                onClose?.(); // trigger close
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, positionRef]);

    return (
        <div ref={dropdownRef} className="absolute top-full left-0 z-50 mt-2 rounded-md border border-gray-200 bg-white shadow-md">
            {children}
        </div>
    );
}
