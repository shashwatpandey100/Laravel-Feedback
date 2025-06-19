import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DangerZone from './Components/Edit/DangerZone';
import FormActions from './Components/Edit/FormActions';
import FormBasicInfo from './Components/Edit/FormBasicInfo';
import FormHeader from './Components/Edit/FormHeader';
import FormLink from './Components/Edit/FormLink';
import FormStatusToggle from './Components/Edit/FormStatusToggle';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Feedback Forms', href: '/entries' },
    { title: 'Edit Form', href: '#' },
];

export default function Edit({ entry }) {
    const [isSaving, setIsSaving] = useState(false);

    const { data, setData, put, errors, processing } = useForm({
        title: entry.title || '',
        description: entry.description || '',
        status: entry.status || 'draft',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        put(route('entries.update', entry.slug), {
            onSuccess: () => setIsSaving(false),
            onError: () => setIsSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Form - ${entry.title}`} />

            <div className="flex h-full flex-1 flex-col">
                <div className="relative h-full w-full overflow-hidden">
                    <FormHeader entry={entry} />

                    <div className="overflow-x-auto px-6 pb-6">
                        <form onSubmit={handleSubmit}>
                            <div className="rounded-lg bg-gray-50 p-6">
                                <div className="space-y-6">
                                    <FormBasicInfo data={data} setData={setData} errors={errors} />

                                    <FormStatusToggle status={data.status} onChange={(status) => setData('status', status)} error={errors.status} />

                                    <FormActions entry={entry} isSaving={isSaving || processing} />
                                </div>
                            </div>
                        </form>

                        <FormLink entry={entry} isPublished={data.status === 'published'} />

                        <DangerZone entry={entry} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
