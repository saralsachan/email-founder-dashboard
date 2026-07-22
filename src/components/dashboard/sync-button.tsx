"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/dashboard/format";
import { cn } from "@/lib/utils";

interface SyncButtonProps {
  initialLastSyncedAt: string | null;
  initialSyncInProgress: boolean;
}

const COOLDOWN_SECONDS = 30;

export function SyncButton({
  initialLastSyncedAt,
  initialSyncInProgress,
}: SyncButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(initialSyncInProgress);
  const [lastSyncedAt, setLastSyncedAt] = useState(initialLastSyncedAt);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSync = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sync", { method: "POST" });
      const data = await response.json();

      if (response.status === 429) {
        setLastSyncedAt(data.lastSyncedAt ?? lastSyncedAt);
        setCooldown(data.retryAfterSeconds ?? COOLDOWN_SECONDS);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Sync failed");
      }

      setLastSyncedAt(data.lastSyncedAt);
      setCooldown(COOLDOWN_SECONDS);
      router.refresh();
    } catch (syncError) {
      setError(
        syncError instanceof Error ? syncError.message : "Sync failed",
      );
    } finally {
      setLoading(false);
    }
  }, [lastSyncedAt, router]);

  const disabled = loading || cooldown > 0;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm sm:w-auto sm:min-w-72",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sync status
          </p>
          <p className="text-sm text-foreground">
            Last synced {formatRelativeTime(lastSyncedAt)}
          </p>
        </div>
        <Button disabled={disabled} onClick={handleSync} size="sm">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <RefreshCw />
          )}
          {loading ? "Syncing…" : cooldown > 0 ? `Wait ${cooldown}s` : "Sync now"}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
