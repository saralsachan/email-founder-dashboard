import { getRecommendedAction } from "@/lib/dashboard/recommendation";
import { createClient } from "@/lib/supabase/server";
import type {
  EmailCategory,
  PlanStatus,
  RevenueEventType,
  UrgentSubcategory,
} from "@/types/database";

export interface RevenueStats {
  payments: number;
  refunds: number;
  failedCharges: number;
  currency: string;
}

export interface UrgentIssue {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  category: UrgentSubcategory | null;
  receivedAt: string;
}

export interface WaitingThreadItem {
  id: string;
  sender: string;
  subject: string;
  daysOverdue: number;
  threadId: string;
}

export interface DashboardData {
  profile: {
    planStatus: PlanStatus;
    gmailConnected: boolean;
    email: string;
  };
  sync: {
    lastSyncedAt: string | null;
    syncInProgress: boolean;
  };
  revenue: RevenueStats;
  urgentIssues: UrgentIssue[];
  waitingThreads: WaitingThreadItem[];
  waitingTotal: number;
  recommendedAction: Awaited<ReturnType<typeof getRecommendedAction>>;
  hasAnyData: boolean;
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function daysSince(dateIso: string): number {
  const diff = Date.now() - new Date(dateIso).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();
  const since24h = hoursAgo(24);

  const [
    profileResult,
    syncResult,
    revenueResult,
    urgentResult,
    waitingResult,
    waitingCountResult,
    recommendedAction,
  ] = await Promise.all([
    supabase
      .from("users")
      .select("plan_status, google_refresh_token, email")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("sync_state")
      .select("last_synced_at, sync_in_progress")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("revenue_events")
      .select("type, amount, currency")
      .eq("user_id", userId)
      .gte("occurred_at", since24h),
    supabase
      .from("emails")
      .select("id, sender, subject, raw_snippet, urgent_subcategory, received_at")
      .eq("user_id", userId)
      .eq("category", "urgent" satisfies EmailCategory)
      .gte("received_at", since24h)
      .order("received_at", { ascending: false })
      .limit(10),
    supabase
      .from("waiting_threads")
      .select("id, last_sender, subject, last_message_at, thread_id")
      .eq("user_id", userId)
      .order("last_message_at", { ascending: true })
      .limit(3),
    supabase
      .from("waiting_threads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    getRecommendedAction(userId),
  ]);

  const revenueEvents = revenueResult.data ?? [];
  let payments = 0;
  let refunds = 0;
  let failedCharges = 0;
  let currency = "USD";

  for (const event of revenueEvents) {
    currency = event.currency ?? currency;
    const type = event.type as RevenueEventType;
    const amount = Number(event.amount);

    if (type === "payment") payments += amount;
    if (type === "refund") refunds += amount;
    if (type === "failed_charge") failedCharges += 1;
  }

  const urgentIssues: UrgentIssue[] = (urgentResult.data ?? []).map((row) => ({
    id: row.id,
    sender: row.sender,
    subject: row.subject,
    snippet: row.raw_snippet ?? row.subject,
    category: row.urgent_subcategory as UrgentSubcategory | null,
    receivedAt: row.received_at,
  }));

  const waitingThreads: WaitingThreadItem[] = (waitingResult.data ?? []).map(
    (row) => ({
      id: row.id,
      sender: row.last_sender,
      subject: row.subject,
      daysOverdue: daysSince(row.last_message_at),
      threadId: row.thread_id,
    }),
  );

  const waitingTotal = waitingCountResult.count ?? waitingThreads.length;

  const hasAnyData =
    revenueEvents.length > 0 ||
    urgentIssues.length > 0 ||
    waitingTotal > 0 ||
    Boolean(recommendedAction);

  return {
    profile: {
      planStatus: (profileResult.data?.plan_status ?? "trialing") as PlanStatus,
      gmailConnected: Boolean(profileResult.data?.google_refresh_token),
      email: profileResult.data?.email ?? "",
    },
    sync: {
      lastSyncedAt: syncResult.data?.last_synced_at ?? null,
      syncInProgress: syncResult.data?.sync_in_progress ?? false,
    },
    revenue: { payments, refunds, failedCharges, currency },
    urgentIssues,
    waitingThreads,
    waitingTotal,
    recommendedAction,
    hasAnyData,
  };
}
