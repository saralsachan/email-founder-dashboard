import { syncGmailForUser } from "@/lib/gmail/sync";
import { inngest } from "@/lib/inngest/client";
import { createAdminClient } from "@/lib/supabase/admin";

export const syncAllUsersCron = inngest.createFunction(
  {
    id: "sync-all-users-cron",
    triggers: [{ cron: "*/15 * * * *" }],
  },
  async ({ step }) => {
    const userIds = await step.run("fetch-active-users", async () => {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("users")
        .select("id")
        .not("google_refresh_token", "is", null)
        .in("plan_status", ["trialing", "active", "past_due"]);

      if (error) {
        throw new Error(`Failed to fetch users for sync: ${error.message}`);
      }

      return (data ?? []).map((user) => user.id);
    });

    if (userIds.length === 0) {
      return { dispatched: 0 };
    }

    await step.sendEvent(
      "fan-out-user-syncs",
      userIds.map((userId) => ({
        name: "gmail/sync.user" as const,
        data: { userId },
      })),
    );

    return { dispatched: userIds.length };
  },
);

export const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    retries: 2,
    triggers: [{ event: "gmail/sync.user" }],
  },
  async ({ event, step }) => {
    const result = await step.run("sync-gmail-for-user", async () =>
      syncGmailForUser(event.data.userId),
    );

    return result;
  },
);

export const inngestFunctions = [syncAllUsersCron, syncUser];
