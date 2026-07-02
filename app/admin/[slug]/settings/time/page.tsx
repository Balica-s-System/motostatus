import {
  CalendarDays,
  Mail,
  ShieldCheck,
  ShieldHalf,
  type User,
  UserCog,
} from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/data/auth";
import { getDealership } from "@/lib/data/dealership";
import { listOrganizationMembersById } from "@/lib/data/member";
import { InviteDialog } from "../../../_components/invite-dialog";

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

function TeamSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function TeamContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [user, dealership] = await Promise.all([
    getCurrentUser(),
    getDealership(slug),
  ]);

  const members = await listOrganizationMembersById(dealership.id);

  const currentMember = members.find((m) => m.userId === user?.id);
  const isAdmin =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Time</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os membros da {dealership.name}
          </p>
        </div>
        {isAdmin && (
          <InviteDialog
            organizationSlug={slug}
            organizationName={dealership.name}
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
                        <Image
                          width={40}
                          height={40}
                          src={member.image}
                          alt={member.name ?? ""}
                          className="size-full object-cover rounded-full"
                        />
                      ) : (
                        <AvatarFallback>{initials}</AvatarFallback>
                      )}
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

export default function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<TeamSkeleton />}>
      <TeamContent params={params} />
    </Suspense>
  );
}
