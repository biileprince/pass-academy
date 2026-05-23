import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, CheckCircle, Clock, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface DashboardProps {
    stats: {
        totalActivities: number;
        todayDone: number;
        todayInProgress: number;
        todayPending: number;
        completionRate: number;
    };
    weeklyData: { date: string; done: number; total: number }[];
    recentUpdates: {
        id: number;
        status: string;
        remark: string | null;
        user_name: string;
        activity_title: string;
        created_at: string;
    }[];
}

export default function Dashboard({ stats, weeklyData, recentUpdates }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-6xl mx-auto w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold dark:font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">
                            Today's activity overview at a glance.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/daily">
                            Go to Daily View
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="rounded-xl shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold dark:font-medium">Total Activities</p>
                                    <p className="text-3xl font-extrabold dark:font-bold mt-1">{stats.totalActivities}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <ClipboardList className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold dark:font-medium">Done Today</p>
                                    <p className="text-3xl font-extrabold dark:font-bold mt-1 text-foreground">{stats.todayDone}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold dark:font-medium">In Progress</p>
                                    <p className="text-3xl font-extrabold dark:font-bold mt-1 text-foreground">{stats.todayInProgress}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold dark:font-medium">Completion Rate</p>
                                    <p className="text-3xl font-extrabold dark:font-bold mt-1">{stats.completionRate}%</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart + Recent Updates */}
                <div className="grid gap-4 lg:grid-cols-5">
                    {/* Weekly Trend Chart */}
                    <Card className="rounded-xl shadow-sm lg:col-span-3">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold dark:font-semibold">Weekly Completion Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {weeklyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={weeklyData} barCategoryGap="20%">
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '0.5rem',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Bar dataKey="done" fill="#22c55e" name="Completed" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                                    No data yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Updates Feed */}
                    <Card className="rounded-xl shadow-sm lg:col-span-2">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold dark:font-semibold">Recent Updates</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/daily">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4">
                            {recentUpdates.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {recentUpdates.map((update) => (
                                        <div key={update.id} className="flex items-start gap-3 text-sm">
                                            <div className="shrink-0 mt-0.5">
                                                {update.status === 'done' ? (
                                                    <CheckCircle className="w-4 h-4 text-foreground" />
                                                ) : update.status === 'in_progress' ? (
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold dark:font-medium truncate">{update.user_name}</span>
                                                    <span className="text-muted-foreground text-xs shrink-0">{update.created_at}</span>
                                                </div>
                                                <p className="text-muted-foreground truncate">{update.activity_title}</p>
                                                {update.remark && (
                                                    <p className="text-xs text-muted-foreground/70 italic truncate mt-0.5">"{update.remark}"</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                    No recent updates.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Today Alert */}
                {stats.todayPending > 0 && (
                    <Card className="rounded-xl shadow-sm bg-muted/50 border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {stats.todayPending} {stats.todayPending === 1 ? 'activity' : 'activities'} still pending today
                                    </p>
                                    <p className="text-sm text-muted-foreground">Head to the Daily View to update their status.</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/daily">Update Now</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
