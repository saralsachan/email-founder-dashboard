"use client";

import { MailWarning, MailX, Inbox } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardEmptyStateProps {
  gmailConnected: boolean;
  hasSynced: boolean;
}

export function DashboardEmptyState({
  gmailConnected,
  hasSynced,
}: DashboardEmptyStateProps) {
  if (!gmailConnected) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
        <CardHeader>
          <div className="flex items-start gap-3">
            <MailX className="mt-0.5 size-5 text-amber-700 dark:text-amber-400" />
            <div>
              <CardTitle className="text-lg">Gmail not connected</CardTitle>
              <CardDescription>
                Reconnect Gmail to resume syncing your inbox.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link className={cn(buttonVariants())} href="/login">
            Reconnect Gmail
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!hasSynced) {
    return (
      <Card className="border-dashed bg-muted/30 shadow-none">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Inbox className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">No emails synced yet</CardTitle>
              <CardDescription className="leading-relaxed">
                Click <Badge variant="secondary">Sync now</Badge> to pull in your
                latest Gmail data. The dashboard loads instantly from the database
                after the first sync.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return null;
}

export function GmailTokenErrorBanner() {
  return (
    <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <MailWarning className="mt-0.5 size-5 text-destructive" />
          <div>
            <CardTitle className="text-lg text-destructive">
              Gmail access expired
            </CardTitle>
            <CardDescription>
              Your Gmail token may have expired. Reconnect to restore syncing.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/login">
          Reconnect Gmail
        </Link>
      </CardContent>
    </Card>
  );
}
