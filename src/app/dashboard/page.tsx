import Link from "next/link";
import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { DashboardEmptyState } from "@/components/dashboard/empty-states";
import { SyncButton } from "@/components/dashboard/sync-button";
import { getDashboardData } from "@/lib/dashboard/queries";
import { isPlanActive } from "@/lib/billing/plans";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import { SignOutButton } from "./sign-out-button";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDisplayName(
  metadata: Record<string, unknown> | undefined,
  email: string | undefined,
): string {
  const fullName = metadata?.full_name ?? metadata?.name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.split(" ")[0] ?? fullName;
  }

  if (email) {
    return email.split("@")[0] ?? "there";
  }

  return "there";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileRow } = await supabase
    .from("users")
    .select("plan_status, created_at, google_refresh_token")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileRow &&
    !isPlanActive(profileRow.plan_status, profileRow.created_at)
  ) {
    redirect("/billing");
  }

  const data = await getDashboardData(user.id);
  const displayName = getDisplayName(user.user_metadata, user.email);
  const today = formatDate(new Date());
  const hasSynced = Boolean(data.sync.lastSyncedAt);

  return (
    <>
      <SiteHeader
        actions={
          <>
            <Badge className="hidden px-3 py-1 text-sm capitalize sm:inline-flex" variant="secondary">
              {data.profile.planStatus}
            </Badge>
            <Link
              className={cn(buttonVariants({ variant: "ghost", size: "default" }))}
              href="/settings"
            >
              Settings
            </Link>
            <SignOutButton />
          </>
        }
      />
      <PageContainer className="space-y-10 lg:space-y-12">
        <div className="flex flex-col gap-8 border-b pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-base font-medium text-muted-foreground">Dashboard</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {getGreeting()}, {displayName}
            </h1>
            <p className="text-lg text-muted-foreground">{today}</p>
          </div>
          <SyncButton
            initialLastSyncedAt={data.sync.lastSyncedAt}
            initialSyncInProgress={data.sync.syncInProgress}
          />
        </div>

        <DashboardEmptyState
          gmailConnected={data.profile.gmailConnected}
          hasSynced={hasSynced}
        />

        {data.profile.gmailConnected && hasSynced && <DashboardCards data={data} />}

        {data.profile.gmailConnected && !hasSynced && (
          <p className="rounded-lg border border-dashed bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Use <span className="font-medium text-foreground">Sync now</span>{" "}
            above to run your first import.
          </p>
        )}
      </PageContainer>
    </>
  );
}
