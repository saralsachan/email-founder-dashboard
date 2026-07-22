import type { PlanStatus } from "@/types/database";

const TRIAL_DAYS = 14;

export function isPlanActive(
  planStatus: PlanStatus,
  createdAt: string,
): boolean {
  if (planStatus === "active") return true;

  if (planStatus === "trialing") {
    const trialEnd = new Date(createdAt);
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
    return Date.now() < trialEnd.getTime();
  }

  return false;
}

export function getTrialDaysRemaining(createdAt: string): number {
  const trialEnd = new Date(createdAt);
  trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
  const remaining = Math.ceil(
    (trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, remaining);
}

export const SUBSCRIPTION_PRICE = 17;
