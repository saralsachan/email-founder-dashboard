"use client";

import {
  AlertTriangle,
  CircleDollarSign,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/dashboard/format";
import type { DashboardData } from "@/lib/dashboard/queries";
import { cn } from "@/lib/utils";

import { DraftReplyDialog } from "./draft-reply-dialog";

const cardClass = "shadow-sm";

export function DashboardCards({ data }: { data: DashboardData }) {
  const [draftOpen, setDraftOpen] = useState(false);
  const action = data.recommendedAction;
  const waitingOverflow = Math.max(0, data.waitingTotal - data.waitingThreads.length);

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Card className={cardClass}>
          <CardHeader className="border-b pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                <CircleDollarSign className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Revenue overnight</CardTitle>
                <CardDescription>
                  Last 24 hours from payment notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3 pt-5">
            {[
              {
                label: "New revenue",
                value: formatCurrency(data.revenue.payments, data.revenue.currency),
                className: "text-emerald-700 dark:text-emerald-400",
              },
              {
                label: "Refunds",
                value: formatCurrency(data.revenue.refunds, data.revenue.currency),
                className: "text-foreground",
              },
              {
                label: "Failed",
                value: String(data.revenue.failedCharges),
                className: "text-amber-700 dark:text-amber-400",
              },
            ].map((stat) => (
              <div
                className="rounded-lg border bg-muted/50 px-3 py-3"
                key={stat.label}
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className={cn("mt-1 text-xl font-semibold tabular-nums", stat.className)}>
                  {stat.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="border-b pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Urgent customer issues</CardTitle>
                <CardDescription>Bug reports and churn signals</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-5">
            {data.urgentIssues.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">
                No urgent issues in the last 24 hours.
              </p>
            ) : (
              data.urgentIssues.map((issue) => (
                <div
                  className="rounded-lg border bg-muted/30 px-3 py-2.5"
                  key={issue.id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{issue.sender}</p>
                    {issue.category && (
                      <Badge
                        variant={
                          issue.category === "churn" ? "destructive" : "secondary"
                        }
                      >
                        {issue.category}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {issue.snippet || issue.subject}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="border-b pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/60">
                <Clock3 className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Waiting on you</CardTitle>
                <CardDescription>
                  Your last reply was 24+ hours ago
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-5">
            {data.waitingThreads.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">
                Nothing overdue right now.
              </p>
            ) : (
              <>
                {data.waitingThreads.map((thread) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2.5"
                    key={thread.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{thread.sender}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {thread.subject}
                      </p>
                    </div>
                    <Badge variant="outline">{thread.daysOverdue}d</Badge>
                  </div>
                ))}
                {waitingOverflow > 0 && (
                  <p className="pt-1 text-center text-sm text-muted-foreground">
                    +{waitingOverflow} more threads
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "border-primary/30 lg:col-span-2")}>
          <CardHeader className="border-b pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Sparkles className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Do this first</CardTitle>
                <CardDescription>Your highest-priority next action</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {!action ? (
              <p className="rounded-lg border border-dashed bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">
                No recommended action yet. Sync your inbox to populate this card.
              </p>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <Badge className="capitalize" variant="secondary">
                    {action.type === "urgent"
                      ? (action.category ?? "urgent")
                      : "waiting"}
                  </Badge>
                  <p className="font-medium">{action.sender}</p>
                  <p className="text-sm text-muted-foreground">{action.subject}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed">
                    {action.snippet}
                  </p>
                </div>
                <Button
                  className="shrink-0 sm:mt-1"
                  onClick={() => setDraftOpen(true)}
                >
                  Draft reply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {action && (
        <DraftReplyDialog
          emailId={action.type === "urgent" ? action.id : undefined}
          onOpenChange={setDraftOpen}
          open={draftOpen}
          subject={action.subject}
          threadId={action.threadId}
          type={action.type}
        />
      )}
    </>
  );
}
