<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Activity Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 22px;
            color: #1e40af;
            margin-bottom: 4px;
        }
        .header p {
            color: #6b7280;
            font-size: 12px;
        }
        .meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 11px;
            color: #4b5563;
        }
        .meta-item {
            margin-bottom: 4px;
        }
        .meta-label {
            font-weight: bold;
            color: #374151;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        th {
            background: #eff6ff;
            color: #1e40af;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
            border-bottom: 2px solid #bfdbfe;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        td {
            padding: 7px 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
            vertical-align: top;
        }
        tr:nth-child(even) {
            background: #f9fafb;
        }
        .activity-group {
            margin-bottom: 24px;
        }
        .activity-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 4px;
        }
        .activity-category {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .status-done {
            color: #059669;
            font-weight: 600;
        }
        .status-in-progress {
            color: #d97706;
            font-weight: 600;
        }
        .status-pending {
            color: #6b7280;
            font-weight: 600;
        }
        .footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
        }
        .no-updates {
            color: #9ca3af;
            font-style: italic;
            padding: 8px 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SuppTracker — Activity Report</h1>
        <p>{{ $startDate }} — {{ $endDate }}</p>
    </div>

    <div class="meta">
        <div>
            <div class="meta-item"><span class="meta-label">Generated:</span> {{ $generatedAt }}</div>
            <div class="meta-item"><span class="meta-label">Total Activities:</span> {{ $activities->count() }}</div>
        </div>
    </div>

    @foreach($activities as $activity)
        <div class="activity-group">
            <div class="activity-title">{{ $activity->title }}</div>
            @if($activity->category)
                <span class="activity-category">{{ $activity->category }}</span>
            @endif

            @if($activity->updates->count() > 0)
                <table>
                    <thead>
                        <tr>
                            <th style="width: 15%">Date</th>
                            <th style="width: 18%">Personnel</th>
                            <th style="width: 12%">Status</th>
                            <th>Remark</th>
                            <th style="width: 15%">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($activity->updates as $update)
                            <tr>
                                <td>{{ $update->activity_date->format('M d, Y') }}</td>
                                <td>
                                    {{ $update->user->name ?? 'N/A' }}
                                    @if($update->user && $update->user->job_title)
                                        <br><small style="color: #6b7280">{{ $update->user->job_title }}</small>
                                    @endif
                                </td>
                                <td>
                                    @if($update->status === 'done')
                                        <span class="status-done">✓ Done</span>
                                    @elseif($update->status === 'in_progress')
                                        <span class="status-in-progress">◷ In Progress</span>
                                    @else
                                        <span class="status-pending">○ Pending</span>
                                    @endif
                                </td>
                                <td>{{ $update->remark ?? '—' }}</td>
                                <td>{{ $update->created_at->format('H:i:s') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div class="no-updates">No updates recorded in this period.</div>
            @endif
        </div>
    @endforeach

    <div class="footer">
        SuppTracker — Generated on {{ $generatedAt }}
    </div>
</body>
</html>
