import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ArrowRight, BarChart3, ClipboardList, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-background font-sans selection:bg-[#D18CF9]/30 text-foreground overflow-x-hidden">
                {/* Navigation */}
                <header className="absolute top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md dark:bg-black/20">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#192562] to-[#D18CF9] text-white">
                                <AppLogoIcon className="size-5 fill-current" />
                            </div>
                            <span className="font-bold text-lg bg-gradient-to-r from-[#192562] to-[#D18CF9] dark:from-[#D18CF9] dark:to-blue-300 bg-clip-text text-transparent">
                                SuppTracker
                            </span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-gradient-to-r from-[#192562] to-[#D18CF9] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-gradient-to-r from-[#192562] to-[#D18CF9] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="relative isolate pt-14 dark:bg-slate-950">
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 -z-10 h-full w-full object-cover">
                        <img 
                            src="/images/hero-bg.png" 
                            alt="Background pattern" 
                            className="h-full w-full object-cover opacity-30 dark:opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-background/80 to-background dark:from-transparent"></div>
                    </div>
                    
                    <div className="py-24 sm:py-32 lg:pb-40">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">

                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                                    Empowering teams to achieve{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#192562] to-[#D18CF9] dark:from-[#D18CF9] dark:to-blue-300">
                                        more together
                                    </span>
                                </h1>
                                <p className="mt-6 text-xl leading-8 text-muted-foreground font-medium">
                                    SuppTracker is built for people. Simplify your daily handovers, stay connected with your team's progress, and focus on what truly matters.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-full bg-gradient-to-r from-[#192562] to-[#D18CF9] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#D18CF9]/25 hover:opacity-90 transition-all flex items-center gap-2"
                                        >
                                            Access Dashboard <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('register')}
                                            className="rounded-full bg-gradient-to-r from-[#192562] to-[#D18CF9] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#D18CF9]/25 hover:opacity-90 transition-all flex items-center gap-2"
                                        >
                                            Start Tracking Free <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            
                            {/* Removed the empty box grid shape as requested */}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 sm:py-32 bg-background border-t border-border">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-bold leading-7 text-primary">Made for you</h2>
                            <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Designed around how you naturally work
                            </p>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                We believe tools should adapt to people, not the other way around. SuppTracker brings clarity and warmth to your daily routines.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                {/* Feature 1 */}
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-foreground">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#192562] to-[#D18CF9]">
                                            <ClipboardList className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Activity Tracking
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-muted-foreground">
                                        Create, assign, and monitor tasks. Know exactly what your team is working on at any given moment.
                                    </dd>
                                </div>

                                {/* Feature 2 */}
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-foreground">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#192562] to-[#D18CF9]">
                                            <Clock className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Daily Handover
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-muted-foreground">
                                        Seamlessly transfer shifts with a dedicated daily handover board detailing completed and pending tasks.
                                    </dd>
                                </div>

                                {/* Feature 3 */}
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-foreground">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#192562] to-[#D18CF9]">
                                            <BarChart3 className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Rich Reporting
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-muted-foreground">
                                        Generate stunning charts and export your data to CSV or PDF for management reviews.
                                    </dd>
                                </div>

                                {/* Feature 4 */}
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-foreground">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#192562] to-[#D18CF9]">
                                            <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Enterprise Security
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-muted-foreground">
                                        Role-based access control built in. Admins manage activities while team members update statuses safely.
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-border bg-card">
                    <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                        <div className="flex justify-center space-x-6 md:order-2">
                            <Link href={route('login')} className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Log In</Link>
                            <Link href={route('register')} className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Create Account</Link>
                        </div>
                        <div className="mt-8 md:order-1 md:mt-0 flex items-center justify-center md:justify-start gap-2">
                            <div className="flex size-6 items-center justify-center rounded bg-gradient-to-br from-[#192562] to-[#D18CF9] text-white">
                                <AppLogoIcon className="size-3 fill-current" />
                            </div>
                            <p className="text-center text-sm leading-5 text-muted-foreground font-medium">
                                &copy; {new Date().getFullYear()} SuppTracker. Streamlining your workflow.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
