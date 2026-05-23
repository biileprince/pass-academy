import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type Activity, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, BarChart3, CheckCircle, Clock, Download, FileText, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/reports' },
];

interface StatusStat {
    name: string;
    value: number;
    color: string;
}

interface ChartDataPoint {
    date: string;
    done: number;
    inProgress: number;
    pending: number;
}

interface RecentUpdate {
    id: number;
    status: 'pending' | 'in_progress' | 'done';
    remark: string | null;
    activity_date: string;
    created_at: string;
    updater_name?: string | null;
    updater_department?: string | null;
    updater_job_title?: string | null;
    user?: { id: number; name: string; department?: string; job_title?: string };
    activity?: { id: number; title: string; category?: string | null };
}

interface ReportProps {
    summary: {
        totalActivities: number;
        expectedUpdates: number;
        completionRate: number;
        statusStats: StatusStat[];
    };
    chartData: ChartDataPoint[];
    recentUpdates: RecentUpdate[];
    activities: Activity[];
    users: { id: number; name: string; department?: string; job_title?: string }[];
    filters: {
        activityId: string;
        userId: string;
        status: string;
    };
    dateRange: {
        start: string;
        end: string;
    };
}

export default function ReportsIndex({ summary, chartData, recentUpdates, activities, users, filters, dateRange }: ReportProps) {
    const [startDate, setStartDate] = useState(dateRange.start);
    const [endDate, setEndDate] = useState(dateRange.end);
    const [activityId, setActivityId] = useState(filters.activityId);
    const [userId, setUserId] = useState(filters.userId);
    const [status, setStatus] = useState(filters.status);

    const applyFilters = () => {
        router.get(
            route('reports.index'),
            {
                start_date: startDate,
                end_date: endDate,
                activity_id: activityId || undefined,
                user_id: userId || undefined,
                status: status || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const formatStatus = (status: string) => {
        switch (status) {
            case 'done':
                return 'Done';
            case 'in_progress':
                return 'In Progress';
            default:
                return 'Pending';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
                        <p className="text-muted-foreground">Analyze activity performance and export reports.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href={route('reports.export.csv', { start_date: startDate, end_date: endDate })}>
                                <Download className="mr-2 h-4 w-4" />
                                CSV
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href={route('reports.export.pdf', { start_date: startDate, end_date: endDate })}>
                                <FileText className="mr-2 h-4 w-4" />
                                PDF
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Date Range Filter */}
                <Card className="rounded-xl shadow-sm">
                    <CardContent className="p-4">
                        <div className="grid items-end gap-4 md:grid-cols-5">
                            <div className="grid gap-1.5">
                                <label htmlFor="start_date" className="text-sm font-medium">
                                    From
                                </label>
                                <input
                                    id="start_date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <label htmlFor="end_date" className="text-sm font-medium">
                                    To
                                </label>
                                <input
                                    id="end_date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <label htmlFor="activity_id" className="text-sm font-medium">
                                    Activity
                                </label>
                                <select
                                    id="activity_id"
                                    value={activityId}
                                    onChange={(e) => setActivityId(e.target.value)}
                                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                >
                                    <option value="">All activities</option>
                                    {activities.map((activity) => (
                                        <option key={activity.id} value={activity.id}>
                                            {activity.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-1.5">
                                <label htmlFor="user_id" className="text-sm font-medium">
                                    Personnel
                                </label>
                                <select
                                    id="user_id"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                >
                                    <option value="">All personnel</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                            {user.department ? ` · ${user.department}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-1.5">
                                <label htmlFor="status" className="text-sm font-medium">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                >
                                    <option value="">All statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>

                            <Button size="sm" className="h-9" onClick={applyFilters}>
                                Apply
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="rounded-xl shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Total Activities</p>
                                    <p className="mt-1 text-3xl font-bold">{summary.totalActivities}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/50">
                                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Completion Rate</p>
                                    <p className="mt-1 text-3xl font-bold">{summary.completionRate}%</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50">
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Updates Found</p>
                                    <p className="mt-1 text-3xl font-bold">{summary.expectedUpdates}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/50">
                                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-5">
                    {/* Bar Chart */}
                    <Card className="rounded-xl shadow-sm md:col-span-3">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">Daily Completion</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={chartData} barCategoryGap="20%">
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '0.5rem',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Bar dataKey="done" fill="#22c55e" name="Done" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="inProgress" fill="#eab308" name="In Progress" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="pending" fill="#94a3b8" name="Pending" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground flex h-[280px] items-center justify-center">
                                    No data for the selected period.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="rounded-xl shadow-sm md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold">Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {summary.statusStats.some((s) => s.value > 0) ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={summary.statusStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {summary.statusStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '0.5rem',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Legend verticalAlign="bottom" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground flex h-[280px] items-center justify-center">No data available.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Updates Table */}
                <Card className="rounded-xl shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Recent Updates</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {Array.isArray(recentUpdates) && recentUpdates.length > 0 ? (
                            <div className="w-full overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="p-3 font-medium">Activity</th>
                                            <th className="hidden p-3 font-medium sm:table-cell">Date</th>
                                            <th className="p-3 font-medium">Personnel</th>
                                            <th className="p-3 font-medium">Status</th>
                                            <th className="hidden p-3 font-medium md:table-cell">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUpdates.map((update) => (
                                            <tr key={update.id} className="hover:bg-muted/50 border-b transition-colors last:border-0">
                                                <td className="p-3 font-medium">
                                                    {update.activity?.title ?? 'N/A'}
                                                    {update.activity?.category && (
                                                        <div className="text-muted-foreground mt-1 text-xs font-normal">
                                                            {update.activity.category}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-muted-foreground hidden p-3 sm:table-cell">
                                                    {new Date(update.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-medium">{update.updater_name ?? update.user?.name ?? 'N/A'}</div>
                                                    {(update.updater_department ||
                                                        update.updater_job_title ||
                                                        update.user?.department ||
                                                        update.user?.job_title) && (
                                                        <div className="text-muted-foreground text-xs">
                                                            {update.updater_department ?? update.user?.department}
                                                            {(update.updater_job_title ?? update.user?.job_title)
                                                                ? ` · ${update.updater_job_title ?? update.user?.job_title}`
                                                                : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            update.status === 'done'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                                                                : update.status === 'in_progress'
                                                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400'
                                                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        {update.status === 'done' && <CheckCircle className="h-3 w-3" />}
                                                        {update.status === 'in_progress' && <Clock className="h-3 w-3" />}
                                                        {update.status === 'pending' && <AlertCircle className="h-3 w-3" />}
                                                        {formatStatus(update.status)}
                                                    </span>
                                                </td>
                                                <td className="text-muted-foreground hidden max-w-[200px] truncate p-3 md:table-cell">
                                                    {update.remark || '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <p className="text-muted-foreground">No updates found for this date range.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
