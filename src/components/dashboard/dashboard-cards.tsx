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

const cardClass = "shadow-sm [--card-spacing:--spacing(6)] text-base";

export function DashboardCards({ data }: { data: DashboardData }) {
  const [draftOpen, setDraftOpen] = useState(false);
  const action = data.recommendedAction;
  const waitingOverflow = Math.max(0, data.waitingTotal - data.waitingThreads.length);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-2 xl:gap-8">
        <Card className={cardClass}>
          <CardHeader className="border-b pb-5">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                <CircleDollarSign className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Revenue overnight</CardTitle>
                <CardDescription className="text-base">
                  Last 24 hours from payment notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 pt-6">
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
                className="rounded-lg border bg-muted/50 px-4 py-4"
                key={stat.label}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                <p className={cn("mt-2 text-2xl font-semibold tabular-nums sm:text-3xl", stat.className)}>
                  {stat.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="border-b pb-5">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Urgent customer issues</CardTitle>
                <CardDescription className="text-base">Bug reports and churn signals</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {data.urgentIssues.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-base text-muted-foreground">
                No urgent issues in the last 24 hours.
              </p>
            ) : (
              data.urgentIssues.map((issue) => (
                <div
                  className="rounded-lg border bg-muted/30 px-4 py-4"
                  key={issue.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-medium leading-snug sm:text-lg">{issue.sender}</p>
                    {issue.category && (
                      <Badge
                        className="text-sm"
                        variant={
                          issue.category === "churn" ? "destructive" : "secondary"
                        }
                      >
                        {issue.category}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-base leading-relaxed text-muted-foreground">
                    {issue.snippet || issue.subject}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "xl:col-span-2")}>
          <CardHeader className="border-b pb-5">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/60">
                <Clock3 className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Waiting on you</CardTitle>
                <CardDescription className="text-base">
                  Your last reply was 24+ hours ago
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {data.waitingThreads.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-base text-muted-foreground">
                Nothing overdue right now.
              </p>
            ) : (
              <>
                {data.waitingThreads.map((thread) => (
                  <div
                    className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-5 py-4"
                    key={thread.id}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium sm:text-lg">{thread.sender}</p>
                      <p className="mt-1 truncate text-base text-muted-foreground sm:text-lg">
                        {thread.subject}
                      </p>
                    </div>
                    <Badge className="shrink-0 px-3 py-1 text-sm" variant="outline">
                      {thread.daysOverdue}d
                    </Badge>
                  </div>
                ))}
                {waitingOverflow > 0 && (
                  <p className="pt-2 text-center text-base text-muted-foreground">
                    +{waitingOverflow} more threads
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "border-primary/30 xl:col-span-2")}>
          <CardHeader className="border-b pb-5">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Sparkles className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Do this first</CardTitle>
                <CardDescription className="text-base">Your highest-priority next action</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {!action ? (
              <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-base text-muted-foreground">
                No recommended action yet. Sync your inbox to populate this card.
              </p>
            ) : (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <Badge className="text-sm capitalize" variant="secondary">
                    {action.type === "urgent"
                      ? (action.category ?? "urgent")
                      : "waiting"}
                  </Badge>
                  <p className="text-lg font-medium sm:text-xl">{action.sender}</p>
                  <p className="text-base text-muted-foreground sm:text-lg">{action.subject}</p>
                  <p className="line-clamp-3 text-base leading-relaxed sm:text-lg">
                    {action.snippet}
                  </p>
                </div>
                <Button
                  className="h-11 shrink-0 px-6 text-base sm:mt-1"
                  onClick={() => setDraftOpen(true)}
                  size="lg"
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
