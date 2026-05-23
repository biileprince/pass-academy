import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type Activity, type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Edit({ activity }: { activity: Activity }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Activities',
            href: '/activities',
        },
        {
            title: 'Edit',
            href: `/activities/${activity.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: activity.title || '',
        description: activity.description || '',
        category: activity.category || '',
        is_recurring: !!activity.is_recurring,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('activities.update', activity.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Activity - ${activity.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-3xl mx-auto w-full">
                <div className="flex items-center mb-4">
                    <Button variant="ghost" size="icon" asChild className="mr-2">
                        <Link href={route('activities.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Activity</h2>
                        <p className="text-muted-foreground">
                            Update details for {activity.title}.
                        </p>
                    </div>
                </div>

                <Card className="rounded-xl border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>Activity Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Activity Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category (Optional)</Label>
                                <Input
                                    id="category"
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                />
                                <InputError message={errors.category} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_recurring" 
                                    checked={data.is_recurring}
                                    onCheckedChange={(checked) => setData('is_recurring', checked === true)}
                                />
                                <Label htmlFor="is_recurring" className="font-normal">
                                    This is a recurring daily activity
                                </Label>
                            </div>
                            <InputError message={errors.is_recurring} />

                            <div className="flex justify-end gap-4 mt-4">
                                <Button variant="outline" asChild disabled={processing}>
                                    <Link href={route('activities.index')}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
                                    Update Activity
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
