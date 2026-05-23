import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type Activity, type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Activities',
        href: '/activities',
    },
];

export default function Index({ activities }: { activities: Activity[] }) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activities" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Activities</h2>
                        <p className="text-muted-foreground">
                            Manage the daily activities trackable by the support team.
                        </p>
                    </div>
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('activities.create')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Activity
                            </Link>
                        </Button>
                    )}
                </div>

                <Card className="border-sidebar-border/70 mt-4 rounded-xl">
                    <CardContent className="p-0">
                        {activities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <p className="text-muted-foreground">No activities found.</p>
                                {isAdmin && (
                                    <Button variant="outline" className="mt-4" asChild>
                                        <Link href={route('activities.create')}>Create your first activity</Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="w-full overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="p-4 font-medium">Title</th>
                                            <th className="p-4 font-medium hidden md:table-cell">Category</th>
                                            <th className="p-4 font-medium hidden sm:table-cell">Recurring</th>
                                            {isAdmin && <th className="p-4 font-medium text-right">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activities.map((activity) => (
                                            <tr key={activity.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="p-4 font-medium">
                                                    <div>{activity.title}</div>
                                                    {activity.description && (
                                                        <div className="text-xs text-muted-foreground font-normal line-clamp-1 max-w-md mt-1">
                                                            {activity.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 hidden md:table-cell">
                                                    {activity.category ? (
                                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                                            {activity.category}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4 hidden sm:table-cell">
                                                    {activity.is_recurring ? "Daily" : "Once"}
                                                </td>
                                                {isAdmin && (
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" asChild>
                                                                <Link href={route('activities.edit', activity.id)}>
                                                                    <Edit className="h-4 w-4" />
                                                                    <span className="sr-only">Edit</span>
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" asChild className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                                                <Link href={route('activities.destroy', activity.id)} method="delete" as="button">
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span className="sr-only">Delete</span>
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
