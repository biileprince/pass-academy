"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateUserRole } from "@/app/actions/admin";
import type { Role } from "@/prisma/generated/prisma/client";

type Props = { userId: string; currentRole: Role };

export function AdminRoleSelect({ userId, currentRole }: Props) {
  const [value, setValue] = useState<Role>(currentRole);
  const { toast } = useToast();
  const router = useRouter();

  async function onChange(newRole: string) {
    const role = newRole as Role;
    setValue(role);
    const result = await updateUserRole(userId, role);
    if (!result.success) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
      setValue(currentRole);
    } else {
      toast({ title: "Role updated" });
      router.refresh();
    }
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 w-28 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="STUDENT">Student</SelectItem>
        <SelectItem value="MENTOR">Mentor</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
