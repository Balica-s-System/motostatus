import {
  CalendarDays,
  Mail,
  ShieldCheck,
  ShieldHalf,
  type User,
  UserCog,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/data/auth";
import { listOrganizationMembers } from "@/lib/data/member";
import { prisma } from "@/lib/prisma";
import { InviteDialog } from "../../_components/invite-dialog";

const roleConfig: Record<
  string,
  { label: string; icon: typeof User; className: string }
> = {
  owner: {
    label: "Proprietário",
    icon: ShieldCheck,
    className:
      "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  },
  admin: {
    label: "Administrador",
    icon: ShieldHalf,
    className: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  },
  member: {
    label: "Membro",
    icon: UserCog,
    className: "text-muted-foreground bg-muted",
  },
};

function RoleBadge({ role }: { role: string }) {
  const config = roleConfig[role] ?? roleConfig.member;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
}

export default async function TeamPage() {
  const session = await getCurrentSession();
  const activeOrgId = session.session.activeOrganizationId;

  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const org = await prisma.organization.findUnique({
    where: { id: activeOrgId },
    select: { slug: true, name: true },
  });

  if (!org) redirect("/dashboard");

  const members = await listOrganizationMembers(org.slug);

  const currentMember = members.find((m) => m.userId === session.user.id);
  const isAdmin =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Time</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os membros da {org.name}
          </p>
        </div>
        {isAdmin && (
          <InviteDialog
            organizationSlug={org.slug}
            organizationName={org.name}
          />
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Membros ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {members.map((member) => {
              const initials = member.name
                ? member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "??";
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name ?? ""}
                          className="size-full object-cover rounded-full"
                        />
                      ) : null}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {member.name ?? "Sem nome"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <RoleBadge role={member.role} />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="size-3" />
                      {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
