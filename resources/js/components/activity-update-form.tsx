import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { CheckCircle, Clock, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ActivityUpdateFormProps {
    activityId: number;
    activityDate: string;
    currentStatus?: string;
    currentRemark?: string | null;
}

export function ActivityUpdateForm({ activityId, activityDate, currentStatus = 'pending', currentRemark = '' }: ActivityUpdateFormProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        activity_id: activityId,
        activity_date: activityDate,
        status: currentStatus,
        remark: currentRemark || '',
    });

    const [isEditing, setIsEditing] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('activity_updates.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                // The router automatically updates the flash data which implies success
            },
        });
    };

    if (!isEditing && currentStatus !== 'pending') {
        return (
            <div className="bg-muted/30 flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {currentStatus === 'done' ? (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-1 h-3 w-3" /> Done
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                                <Clock className="mr-1 h-3 w-3" /> In Progress
                            </Badge>
                        )}
                        <span className="text-muted-foreground ml-2 text-sm">Status via you</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        Update
                    </Button>
                </div>
                {currentRemark && <div className="text-muted-foreground mt-1 border-l-2 pl-3 text-sm italic">"{currentRemark}"</div>}
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="bg-card flex flex-col gap-3 rounded-lg border p-3 shadow-sm">
            <div className="flex items-start gap-4">
                <div className="w-32 shrink-0">
                    <Select value={data.status} onValueChange={(value) => setData('status', value)} disabled={processing}>
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grow">
                    <Input
                        type="text"
                        placeholder="Add a remark (optional)..."
                        className="h-9 w-full"
                        value={data.remark}
                        onChange={(e) => setData('remark', e.target.value)}
                        disabled={processing}
                    />
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {isEditing && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9"
                            onClick={() => {
                                setData({
                                    activity_id: activityId,
                                    activity_date: activityDate,
                                    status: currentStatus,
                                    remark: currentRemark || '',
                                });
                                setIsEditing(false);
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" size="sm" className="h-9" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Save Update
                    </Button>
                </div>
            </div>

            <InputError message={errors.status} />
            <InputError message={errors.remark} />
            <InputError message={errors.activity_id} />
            <InputError message={errors.activity_date} />

            {recentlySuccessful && <div className="text-sm font-medium text-green-600">Saved.</div>}
        </form>
    );
}
