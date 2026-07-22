import { decryptToken } from "@/lib/crypto/tokens";
import { createGmailClient, type GmailClient } from "@/lib/gmail/client";
import {
  classifyAndStoreMessage,
  fetchAndParseMessage,
  updateWaitingThreadForThread,
} from "@/lib/gmail/process-message";
import type { SyncResult } from "@/lib/gmail/types";
import { createAdminClient } from "@/lib/supabase/admin";

const INITIAL_SYNC_QUERY = "newer_than:30d";
const INITIAL_SYNC_MAX_RESULTS = 200;

async function fetchMessageIdsFromHistory(
  gmail: GmailClient,
  lastHistoryId: string,
): Promise<string[]> {
  const messageIds = new Set<string>();
  let pageToken: string | undefined;

  do {
    const response = await gmail.users.history.list({
      userId: "me",
      startHistoryId: lastHistoryId,
      historyTypes: ["messageAdded"],
      pageToken,
    });

    for (const record of response.data.history ?? []) {
      for (const added of record.messagesAdded ?? []) {
        if (added.message?.id) {
          messageIds.add(added.message.id);
        }
      }
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return [...messageIds];
}

async function fetchInitialMessageIds(gmail: GmailClient): Promise<string[]> {
  const messageIds: string[] = [];
  let pageToken: string | undefined;

  do {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: INITIAL_SYNC_QUERY,
      maxResults: INITIAL_SYNC_MAX_RESULTS,
      pageToken,
    });

    for (const message of response.data.messages ?? []) {
      if (message.id) {
        messageIds.push(message.id);
      }
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken && messageIds.length < INITIAL_SYNC_MAX_RESULTS);

  return messageIds;
}

async function resolveMessageIds(
  gmail: GmailClient,
  lastHistoryId: string | null,
): Promise<string[]> {
  if (!lastHistoryId) {
    return fetchInitialMessageIds(gmail);
  }

  try {
    return await fetchMessageIdsFromHistory(gmail, lastHistoryId);
  } catch (error) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "number"
        ? error.code
        : typeof error === "object" &&
            error !== null &&
            "response" in error &&
            typeof error.response === "object" &&
            error.response !== null &&
            "status" in error.response
          ? Number(error.response.status)
          : null;

    if (status === 404) {
      return fetchInitialMessageIds(gmail);
    }

    throw error;
  }
}

export async function syncGmailForUser(userId: string): Promise<SyncResult> {
  const admin = createAdminClient();

  const { data: user, error: userError } = await admin
    .from("users")
    .select("id, email, google_refresh_token, plan_status")
    .eq("id", userId)
    .maybeSingle();

  if (userError || !user) {
    throw new Error(`User not found: ${userError?.message ?? userId}`);
  }

  if (!user.google_refresh_token) {
    throw new Error("Gmail is not connected for this user");
  }

  if (user.plan_status === "canceled" || user.plan_status === "inactive") {
    throw new Error("User plan is not active");
  }

  const { data: syncState, error: syncStateError } = await admin
    .from("sync_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (syncStateError) {
    throw new Error(`Failed to load sync state: ${syncStateError.message}`);
  }

  if (syncState?.sync_in_progress) {
    throw new Error("Sync already in progress");
  }

  await admin
    .from("sync_state")
    .upsert({ user_id: userId, sync_in_progress: true }, { onConflict: "user_id" });

  try {
    const refreshToken = decryptToken(user.google_refresh_token);
    const gmail = createGmailClient(refreshToken);

    const profile = await gmail.users.getProfile({ userId: "me" });
    const currentHistoryId = profile.data.historyId;

    if (!currentHistoryId) {
      throw new Error("Gmail profile did not return a historyId");
    }

    const messageIds = await resolveMessageIds(
      gmail,
      syncState?.last_history_id ?? null,
    );

    const touchedThreadIds = new Set<string>();
    let messagesProcessed = 0;

    for (const messageId of messageIds) {
      const parsed = await fetchAndParseMessage(gmail, messageId);
      if (!parsed) continue;

      await classifyAndStoreMessage(parsed, {
        userId,
        userEmail: user.email,
      });

      touchedThreadIds.add(parsed.threadId);
      messagesProcessed += 1;
    }

    for (const threadId of touchedThreadIds) {
      await updateWaitingThreadForThread(gmail, userId, user.email, threadId);
    }

    const lastSyncedAt = new Date().toISOString();

    const { error: updateError } = await admin
      .from("sync_state")
      .upsert(
        {
          user_id: userId,
          last_synced_at: lastSyncedAt,
          last_history_id: currentHistoryId,
          sync_in_progress: false,
        },
        { onConflict: "user_id" },
      );

    if (updateError) {
      throw new Error(`Failed to update sync state: ${updateError.message}`);
    }

    return {
      userId,
      messagesProcessed,
      lastSyncedAt,
      lastHistoryId: currentHistoryId,
    };
  } catch (error) {
    await admin
      .from("sync_state")
      .upsert({ user_id: userId, sync_in_progress: false }, { onConflict: "user_id" });
    throw error;
  }
}

export async function getSyncState(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("sync_state")
    .select("last_synced_at, last_history_id, sync_in_progress")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load sync state: ${error.message}`);
  }

  return data;
}
