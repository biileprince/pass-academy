import { Metadata } from "next";
import { getAllUsers, updateUserRole } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import { AdminRoleSelect } from "@/components/dashboard/admin-role-select";

export const metadata: Metadata = { title: "Users — Admin" };

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Badge variant="outline">{users.length} total</Badge>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Joined</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user.name ?? "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate max-w-[160px]">{user.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <AdminRoleSelect userId={user.id} currentRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
