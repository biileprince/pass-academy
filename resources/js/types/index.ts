import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    employee_id?: string;
    job_title?: string;
    department?: string;
    phone?: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Activity {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    is_recurring: boolean;
    created_at: string;
    updated_at: string;
    updates?: ActivityUpdate[];
}

export interface ActivityUpdate {
    id: number;
    activity_id: number;
    user_id: number;
    user?: { id: number; name: string; avatar?: string };
    updater_name?: string | null;
    updater_department?: string | null;
    updater_job_title?: string | null;
    status: 'pending' | 'in_progress' | 'done';
    remark: string | null;
    activity_date: string;
    created_at: string;
    updated_at: string;
}
