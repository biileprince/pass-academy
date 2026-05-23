import { ActivityUpdateForm } from '@/components/activity-update-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type Activity, type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function DailyView({ activities, currentDate }: { activities: Activity[]; currentDate: string }) {
    const { auth } = usePage<SharedData>().props;
    const currentUserId = auth.user.id;

    // Helper functions for date navigation
    const getNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const getPrevDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    };

    const todayString = new Date().toISOString().split('T')[0];
    const isToday = currentDate === todayString;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Daily Handover',
            href: '/daily',
        },
    ];

    // Format date for display
    const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Daily Handover - ${formattedDate}`} />

            <div className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col gap-6 p-4">
                {/* Header and Date Navigation */}
                <div className="bg-card flex flex-col items-start justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Daily Handover</h2>
                        <p className="text-muted-foreground mt-1 flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formattedDate}{' '}
                            {isToday && <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-medium">Today</span>}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={route('daily.index', { date: getPrevDay() })}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className={isToday ? 'bg-muted' : ''}>
                            <Link href={route('daily.index')}>Today</Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild disabled={isToday}>
                            <Link href={route('daily.index', { date: getNextDay() })}>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Activities List */}
                <div className="flex flex-col gap-4">
                    {activities.length === 0 ? (
                        <div className="bg-card rounded-xl border border-dashed p-12 text-center">
                            <h3 className="text-lg font-medium">No activities found</h3>
                            <p className="text-muted-foreground mt-2">There are no daily activities configure to be tracked.</p>
                        </div>
                    ) : (
                        activities.map((activity) => {
                            const updates = activity.updates || [];
                            const latestUpdate = updates.length > 0 ? updates[0] : null; // Already sorted latest()
                            const myUpdate = updates.find((u) => u.user_id === currentUserId);

                            // Determine overall status colors
                            let statusColor = 'bg-card border-border';
                            if (latestUpdate) {
                                if (latestUpdate.status === 'done')
                                    statusColor = 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900';
                                else if (latestUpdate.status === 'in_progress')
                                    statusColor = 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900';
                            }

                            return (
                                <Card key={activity.id} className={`rounded-xl shadow-sm transition-colors ${statusColor}`}>
                                    <div className="flex flex-col gap-6 p-5 md:flex-row">
                                        {/* Activity Info */}
                                        <div className="flex flex-col gap-2 md:w-1/3">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-lg leading-tight font-semibold">{activity.title}</h3>
                                            </div>
                                            {activity.category && (
                                                <div className="bg-primary/10 text-primary self-start rounded px-2 py-0.5 text-xs font-medium">
                                                    {activity.category}
                                                </div>
                                            )}
                                            {activity.description && <p className="text-muted-foreground mt-1 text-sm">{activity.description}</p>}
                                        </div>

                                        {/* Updates / Handover Log */}
                                        <div className="flex flex-col gap-4 md:w-2/3">
                                            {/* History Log */}
                                            {updates.length > 0 ? (
                                                <div className="bg-background/50 flex flex-col gap-2 rounded-lg border p-3">
                                                    <h4 className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                                                        Today's Handover Log
                                                    </h4>
                                                    {updates.map((update) => (
                                                        <div key={update.id} className="flex gap-3 text-sm">
                                                            <div className="mt-0.5 shrink-0">
                                                                {update.status === 'done' ? (
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                ) : update.status === 'in_progress' ? (
                                                                    <Clock className="h-4 w-4 text-yellow-500" />
                                                                ) : (
                                                                    <AlertCircle className="text-muted-foreground h-4 w-4" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-medium">{update.updater_name ?? update.user?.name}</span>
                                                                    {(update.updater_department || update.updater_job_title) && (
                                                                        <span className="text-muted-foreground text-xs">
                                                                            {update.updater_department ?? 'Support'}
                                                                            {update.updater_job_title ? ` · ${update.updater_job_title}` : ''}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-muted-foreground text-xs">
                                                                        {new Date(update.created_at).toLocaleTimeString('en-US', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                {update.remark && <span className="text-muted-foreground">{update.remark}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="bg-background/50 text-muted-foreground flex items-center rounded-lg border p-3 text-sm">
                                                    <AlertCircle className="mr-2 h-4 w-4" />
                                                    No updates logged for this activity today.
                                                </div>
                                            )}

                                            {/* Action Form (Only if today or past, mostly you update today's activities) */}
                                            <div className="mt-auto border-t pt-2">
                                                <ActivityUpdateForm
                                                    activityId={activity.id}
                                                    activityDate={currentDate}
                                                    currentStatus={myUpdate?.status || 'pending'}
                                                    currentRemark={myUpdate?.remark}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
