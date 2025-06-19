import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links, onPageChange, currentPage, lastPage }) {
    if (lastPage <= 1) return null;

    const renderPageNumbers = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <button key="1" onClick={() => onPageChange(1)} className="mx-1 rounded px-3 py-1 text-sm hover:bg-gray-200">
                    1
                </button>,
            );

            if (startPage > 2) {
                items.push(
                    <span key="start-ellipsis" className="mx-1">
                        ...
                    </span>,
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`mx-1 rounded px-3 py-1 text-sm ${currentPage === i ? 'bg-gray-800 text-white' : 'hover:bg-gray-200'}`}
                >
                    {i}
                </button>,
            );
        }

        if (endPage < lastPage) {
            if (endPage < lastPage - 1) {
                items.push(
                    <span key="end-ellipsis" className="mx-1">
                        ...
                    </span>,
                );
            }

            items.push(
                <button key={lastPage} onClick={() => onPageChange(lastPage)} className="mx-1 rounded px-3 py-1 text-sm hover:bg-gray-200">
                    {lastPage}
                </button>,
            );
        }

        return items;
    };

    return (
        <div className="flex items-center justify-center space-x-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded p-1 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center">{renderPageNumbers()}</div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className={`rounded p-1 ${currentPage === lastPage ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
