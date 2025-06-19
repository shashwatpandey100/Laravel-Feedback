import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const showToast = (message, type = 'default') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'loading':
                return toast.loading(message);
            default:
                toast(message);
        }
    };

    const dismissToast = (toastId) => {
        toast.dismiss(toastId);
    };

    const updateToast = (toastId, message, type) => {
        switch (type) {
            case 'success':
                toast.success(message, { id: toastId });
                break;
            case 'error':
                toast.error(message, { id: toastId });
                break;
            default:
                toast(message, { id: toastId });
        }
    };

    const showConfirmation = (message, onConfirm, onCancel) => {
        toast(
            (t) => (
                <div className="flex items-center gap-3">
                    <p>{message}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                onConfirm();
                            }}
                            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                if (onCancel) onCancel();
                            }}
                            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            { duration: 10000, position: 'top-center' },
        );
    };

    return (
        <ToastContext.Provider value={{ showToast, dismissToast, updateToast, showConfirmation }}>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        borderRadius: '8px',
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#10B981',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                        },
                    },
                }}
            />
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
