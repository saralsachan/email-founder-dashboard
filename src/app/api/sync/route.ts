import { NextResponse } from "next/server";

import { getSyncState, syncGmailForUser } from "@/lib/gmail/sync";
import { createClient } from "@/lib/supabase/server";

const RATE_LIMIT_SECONDS = 30;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const syncState = await getSyncState(user.id);

    if (syncState?.last_synced_at) {
      const lastSyncedMs = new Date(syncState.last_synced_at).getTime();
      const elapsedSeconds = (Date.now() - lastSyncedMs) / 1000;

      if (elapsedSeconds < RATE_LIMIT_SECONDS) {
        return NextResponse.json(
          {
            error: "Sync rate limited",
            lastSyncedAt: syncState.last_synced_at,
            retryAfterSeconds: Math.ceil(RATE_LIMIT_SECONDS - elapsedSeconds),
          },
          { status: 429 },
        );
      }
    }

    if (syncState?.sync_in_progress) {
      return NextResponse.json(
        {
          error: "Sync already in progress",
          lastSyncedAt: syncState.last_synced_at,
        },
        { status: 409 },
      );
    }

    const result = await syncGmailForUser(user.id);

    return NextResponse.json({
      ok: true,
      lastSyncedAt: result.lastSyncedAt,
      messagesProcessed: result.messagesProcessed,
      lastHistoryId: result.lastHistoryId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync Gmail";

    if (message.includes("Gmail is not connected")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (message.includes("Sync already in progress")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    console.error("Manual sync failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const syncState = await getSyncState(user.id);

  return NextResponse.json({
    lastSyncedAt: syncState?.last_synced_at ?? null,
    syncInProgress: syncState?.sync_in_progress ?? false,
  });
}
