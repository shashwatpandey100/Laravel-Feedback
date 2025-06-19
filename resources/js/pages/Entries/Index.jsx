import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, FileText, Loader2, MessageSquare, Plus, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import FormCreate from './Components/Index/FormCreate';
import Pagination from './Components/Index/Pagination';
import Table from './Components/Index/Table';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Feedback Forms',
        href: '/entries',
    },
];

export default function Index({ entries }) {
    const data = entries.data || entries;
    const meta = entries.meta || null;
    const currentSort = entries.sort || 'newest';

    const prevSortRef = useRef(currentSort);
    const initialLoad = useRef(true);

    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [sortOption, setSortOption] = useState(currentSort);
    const [loading, setLoading] = useState(false);

    const setCreateForm = (action) => {
        setShowCreateForm(action);
        if (action) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
    };

    // New function to handle search submission
    const handleSearchSubmit = () => {
        setLoading(true);

        router.get(
            route('entries.index', {
                search: search,
                sort: sortOption,
            }),
            {},
            {
                preserveState: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            },
        );
    };

    // Handle key press for search input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleSortChange = (option) => {
        if (option === sortOption) return;

        setSortOption(option);
        setLoading(true);

        router.get(
            route('entries.index', {
                search: search,
                sort: option,
                page: meta?.current_page || 1,
            }),
            {},
            {
                preserveState: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            },
        );
    };

    const handlePageChange = (page) => {
        setLoading(true);

        router.get(
            route('entries.index', {
                search: search,
                sort: sortOption,
                page: page,
            }),
            {},
            {
                preserveState: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            },
        );
    };

    const getTotalPublishedForms = (entries) => {
        return entries.filter((entry) => entry.status === 'published').length;
    };

    const getTotalResponses = (entries) => {
        return entries.reduce((acc, entry) => acc + (entry.feedbacks_count || 0), 0);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Feedback Forms" />

            <div className="flex h-full flex-1 flex-col">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-full w-full overflow-hidden">
                    <div className="flex items-center justify-between gap-2 border-b border-black/5 p-2">
                        <div className="relative flex flex-1 items-center rounded-md bg-gray-100">
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                }}
                                onKeyDown={handleKeyDown}
                                className="h-full w-full rounded-md bg-gray-100 px-6 py-[0.5rem] text-[14px] focus:outline-none"
                                placeholder="Search"
                            />
                            {search && (
                                <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-2 px-6">
                                    <span className="text-[14px] font-[500] text-gray-500">press</span>
                                    <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                                        Enter
                                    </kbd>
                                    <span className="text-[14px] font-[500] text-gray-500">to search</span>
                                    <button onClick={handleSearchSubmit} className="ml-1 rounded-full p-1 text-gray-500 hover:bg-gray-200">
                                        <Search size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="h-full">
                            <div className="flex h-full cursor-pointer items-center rounded-md bg-black px-6 py-[0.4rem] text-white hover:bg-black/80">
                                <button
                                    onClick={() => setCreateForm(true)}
                                    className="flex cursor-pointer items-center gap-2 rounded-2xl text-[13px] font-[500] text-white/90"
                                >
                                    <span>Create New Form</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {data.length === 0 ? (
                        <div className="-mt-6 flex h-full flex-col items-center justify-center rounded-2xl py-12 text-center">
                            <p className="mb-1 text-[15px] font-[500] text-gray-700">
                                {search ? `We could not find any forms for '${search}'` : 'No forms yet'}
                            </p>
                            <p className="mb-5 text-[15px] font-[400] text-gray-500">{search ? '' : 'Get started and create your first form.'}</p>
                            <div className="flex cursor-pointer items-center rounded-[7px] bg-black px-6 py-1.5 text-white hover:bg-black/80">
                                <button
                                    onClick={() => setCreateForm(true)}
                                    className="flex cursor-pointer items-center gap-1 rounded-2xl text-[13px] font-[500] text-white/90"
                                >
                                    <Plus size={14} />
                                    <span>New form</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto px-6 pt-4 pb-6">
                            <div className="mt-2 grid h-18 grid-cols-3 rounded-xl border border-[rgba(0,0,0,0.025)] shadow-sm">
                                <div className="flex items-center gap-4 border-r border-black/5 px-8">
                                    <span className="inline-flex items-center rounded-sm bg-gray-100/70 px-4 py-2 text-xs font-medium text-purple-700">
                                        <FileText size={18} strokeWidth={2} className="text-gray-400" />
                                    </span>
                                    <p className="flex flex-col">
                                        <span className="text-[11px] font-[500] text-gray-400 uppercase">Total forms</span>
                                        <span className="text-[14px] text-gray-800">{meta?.total || data.length}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 border-r border-black/5 px-8">
                                    <span className="inline-flex items-center rounded-sm bg-gray-100/70 px-4 py-2 text-xs font-medium text-purple-700">
                                        <MessageSquare size={18} strokeWidth={2} className="text-gray-400" />
                                    </span>
                                    <p className="flex flex-col">
                                        <span className="text-[11px] font-[500] text-gray-400 uppercase">Total responses</span>
                                        <span className="text-[14px] text-gray-800">{getTotalResponses(data)}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 px-8">
                                    <span className="inline-flex items-center rounded-sm bg-gray-100/70 px-4 py-2 text-xs font-medium text-purple-700">
                                        <CheckCircle size={18} strokeWidth={2} className="text-gray-400" />
                                    </span>
                                    <p className="flex flex-col">
                                        <span className="text-[11px] font-[500] text-gray-400 uppercase">Published forms</span>
                                        <span className="text-[14px] text-gray-800">{getTotalPublishedForms(data)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-4">
                                <span className="text-[16px] font-[500]">My forms</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex cursor-pointer items-center gap-2 rounded-md border-2 border-gray-100 px-2.5 py-1.5 text-[13px] font-[500] text-gray-600 focus:outline-none">
                                            {loading ? <Loader2 size={14} className="mr-1 animate-spin" /> : null}
                                            Sort by - {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="min-w-[150px]">
                                        <DropdownMenuItem
                                            className={`cursor-pointer ${sortOption === 'popular' ? 'bg-gray-100' : ''}`}
                                            onClick={() => handleSortChange('popular')}
                                        >
                                            Popular
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={`cursor-pointer ${sortOption === 'newest' ? 'bg-gray-100' : ''}`}
                                            onClick={() => handleSortChange('newest')}
                                        >
                                            Newest
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={`cursor-pointer ${sortOption === 'oldest' ? 'bg-gray-100' : ''}`}
                                            onClick={() => handleSortChange('oldest')}
                                        >
                                            Oldest
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className={`mt-6 ${loading ? 'opacity-70' : ''}`}>
                                <div className="overflow-hidden rounded-[7px] shadow-sm">
                                    <Table entries={data} />
                                </div>

                                {meta && (
                                    <div className="mt-4 flex justify-center">
                                        <Pagination
                                            links={meta?.links}
                                            onPageChange={handlePageChange}
                                            currentPage={meta?.current_page}
                                            lastPage={meta?.last_page}
                                            disabled={loading}
                                        />
                                    </div>
                                )}

                                {loading && (
                                    <div className="mt-4 flex justify-center">
                                        <Loader2 className="animate-spin text-gray-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <FormCreate showCreateForm={showCreateForm} setCreateForm={setCreateForm} />
            </div>
        </AppLayout>
    );
}
