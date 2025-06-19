import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function FormHeader({ entry }) {
    return (
        <div className="flex flex-col justify-center gap-2 py-3">
            <Link href={`/f/${entry.slug}`} className="flex items-center px-6 text-[14px] font-medium text-gray-500 hover:text-gray-700">
                <ArrowLeft size={16} className="mr-1" /> Back to Form Details
            </Link>
            <div className="h-full">
                <h1 className="mt-4 px-8 text-lg font-semibold">Edit Form</h1>
            </div>
        </div>
    );
}
