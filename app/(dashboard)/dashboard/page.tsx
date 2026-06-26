import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getAdminStats } from "@/app/actions/admin";
import { getMyEnrollments } from "@/app/actions/courses";
import { getMySessionsAsStudent } from "@/app/actions/mentorship";
import { getProfile } from "@/app/actions/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Users, Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user.role;

  if (role === "ADMIN") return <AdminDashboard />;
  if (role === "MENTOR") return <MentorDashboard />;
  if (role === "TUTOR") return <TutorDashboard />;
  return <StudentDashboard />;
}

async function StudentDashboard() {
  const [enrollmentsResult, sessionsResult] = await Promise.all([
    getMyEnrollments(),
    getMySessionsAsStudent(),
  ]);

  const enrollments = enrollmentsResult.success ? enrollmentsResult.data : [];
  const sessions = sessionsResult.success
    ? sessionsResult.data.filter((s) => s.status !== "CANCELLED" && new Date(s.scheduledAt) >= new Date())
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s your learning overview and the next actions for your PAS Academy journey.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{enrollments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{sessions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{enrollments.filter((e) => e.status === "COMPLETED").length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="font-medium">What you can do next</p>
          <p className="text-sm text-muted-foreground mt-1">Explore tutorials, book mentorship, and join webinars to keep growing.</p>
        </CardContent>
      </Card>

      {sessions.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Upcoming Sessions</h2>
          <div className="space-y-3">
            {sessions.slice(0, 3).map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(s.scheduledAt)}</p>
                  </div>
                  <Badge variant={s.status === "CONFIRMED" ? "default" : "secondary"}>{s.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button asChild><Link href="/tutorials">Browse courses</Link></Button>
        <Button variant="outline" asChild><Link href="/mentorship">Find a mentor</Link></Button>
        <Button variant="outline" asChild><Link href="/webinars">Join webinar</Link></Button>
      </div>
    </div>
  );
}

async function TutorDashboard() {
  const profile = await getProfile();
  const profileReady = Boolean(profile?.tutorProfile?.headline && profile?.tutorProfile?.expertise?.length);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
        <p className="text-muted-foreground">Create learning experiences, manage students, and grow your teaching presence.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{profileReady ? "Ready" : "Needs setup"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Course creation</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Start</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Student support</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Live</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild><Link href="/tutor/courses/create">Create your first course</Link></Button>
        <Button variant="outline" asChild><Link href="/tutor/courses">Manage courses</Link></Button>
        <Button variant="outline" asChild><Link href="/profile/edit?tab=tutor">Complete tutor profile</Link></Button>
      </div>
    </div>
  );
}

async function MentorDashboard() {
  const { getMySessionsAsMentor } = await import("@/app/actions/mentorship");
  const sessionsResult = await getMySessionsAsMentor();
  const sessions = sessionsResult.success ? sessionsResult.data : [];
  const pending = sessions.filter((s) => s.status === "PENDING").length;
  const upcoming = sessions.filter((s) => s.status === "CONFIRMED" && new Date(s.scheduledAt) >= new Date()).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
        <p className="text-muted-foreground">Manage your sessions, availability, and the students you support.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{pending}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{upcoming}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{sessions.length}</p></CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button asChild><Link href="/mentor/sessions">Manage sessions</Link></Button>
        <Button variant="outline" asChild><Link href="/mentor/availability">Edit availability</Link></Button>
        <Button variant="outline" asChild><Link href="/profile/edit?tab=mentor">Complete mentor profile</Link></Button>
      </div>
    </div>
  );
}

async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.users, icon: Users, href: "/admin/users" },
          { label: "Published Courses", value: stats.courses, icon: BookOpen, href: "/admin/courses" },
          { label: "Webinars", value: stats.webinars, icon: Video, href: "/admin/webinars" },
          { label: "Mentor Sessions", value: stats.sessions, icon: Calendar, href: "/admin/mentors" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:border-primary/30 hover:shadow-sm transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><p className="text-2xl font-bold">{value}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild><Link href="/admin/courses/new">Create course</Link></Button>
        <Button variant="outline" asChild><Link href="/admin/webinars/new">Create webinar</Link></Button>
        <Button variant="outline" asChild><Link href="/admin/mentors">Review mentors</Link></Button>
      </div>
    </div>
  );
}
