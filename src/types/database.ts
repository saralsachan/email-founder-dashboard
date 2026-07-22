export type PlanStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "inactive";

export type EmailCategory = "revenue" | "urgent" | "waiting" | "other";

export type UrgentSubcategory = "bug" | "churn" | "other";

export type RevenueEventType = "payment" | "refund" | "failed_charge";

export type PaymentProvider = "stripe" | "paddle";

export interface UserProfile {
  id: string;
  email: string;
  google_refresh_token: string | null;
  created_at: string;
  plan_status: PlanStatus;
  dodo_customer_id: string | null;
}

export interface SyncState {
  user_id: string;
  last_synced_at: string | null;
  last_history_id: string | null;
  sync_in_progress: boolean;
}
