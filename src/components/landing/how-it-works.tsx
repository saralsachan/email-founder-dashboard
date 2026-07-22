import {
  AlertTriangle,
  Check,
  CircleDollarSign,
  Clock3,
  Link2,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function MockChrome({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
        </div>
        <p className="truncate text-[11px] font-medium text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

function ConnectVisual() {
  return (
    <MockChrome title="founder-dashboard.app/login">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight">Connect Gmail</p>
          <p className="text-xs text-muted-foreground">
            Read-only access. We never send mail.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full border bg-muted/50 text-xs font-bold">
            G
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Continue with Google</p>
            <p className="truncate text-[11px] text-muted-foreground">
              gmail.readonly
            </p>
          </div>
          <Badge className="shrink-0 text-[10px]" variant="secondary">
            Secure
          </Badge>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
          <Link2 className="size-3.5 shrink-0" />
          OAuth · encrypted token storage
        </div>
      </div>
    </MockChrome>
  );
}

function SyncVisual() {
  return (
    <MockChrome title="Background sync · every 15 min">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium">
            <RefreshCw className="size-3.5 animate-spin [animation-duration:3s]" />
            Syncing inbox
          </div>
          <Badge className="text-[10px]" variant="outline">
            Live
          </Badge>
        </div>
        <div className="space-y-2">
          {[
            { label: "Stripe · Payment succeeded", tag: "Revenue", tone: "ok" },
            { label: "Customer · Bug report", tag: "Urgent", tone: "warn" },
            { label: "Lead · Waiting 2d", tag: "Waiting", tone: "muted" },
          ].map((row) => (
            <div
              className="flex items-center gap-2 rounded-lg border bg-background px-2.5 py-2"
              key={row.label}
            >
              <Mail className="size-3.5 shrink-0 text-muted-foreground" />
              <p className="min-w-0 flex-1 truncate text-[11px] font-medium">
                {row.label}
              </p>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                  row.tone === "ok" &&
                    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                  row.tone === "warn" &&
                    "bg-destructive/10 text-destructive",
                  row.tone === "muted" && "bg-muted text-muted-foreground",
                )}
              >
                {row.tag}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          Parsed · classified · ready for dashboard
        </div>
      </div>
    </MockChrome>
  );
}

function DashboardVisual() {
  return (
    <MockChrome title="Morning dashboard">
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border bg-background p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <CircleDollarSign className="size-3" />
              Revenue
            </div>
            <p className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              $1,240
            </p>
          </div>
          <div className="rounded-lg border bg-background p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <AlertTriangle className="size-3" />
              Urgent
            </div>
            <p className="text-sm font-semibold tabular-nums">2 issues</p>
          </div>
          <div className="rounded-lg border bg-background p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock3 className="size-3" />
              Waiting
            </div>
            <p className="text-sm font-semibold tabular-nums">3 threads</p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-background p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Sparkles className="size-3" />
              Do this first
            </div>
            <p className="truncate text-[11px] font-medium">Draft reply ready</p>
          </div>
        </div>
        <div className="rounded-lg border border-dashed bg-muted/30 px-2.5 py-2 text-[11px] text-muted-foreground">
          One screen. Clear next action. No inbox scroll.
        </div>
      </div>
    </MockChrome>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Connect Gmail",
    description:
      "Sign in with Google and grant read-only access. Takes under a minute.",
    Visual: ConnectVisual,
  },
  {
    step: "02",
    title: "We sync every 15 minutes",
    description:
      "Emails are parsed for revenue events, urgent issues, and stale threads.",
    Visual: SyncVisual,
  },
  {
    step: "03",
    title: "Start your day with clarity",
    description:
      "Open one dashboard, see what matters, and reply with an AI-drafted starting point.",
    Visual: DashboardVisual,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      className="border-t px-4 py-16 sm:px-6 sm:py-24"
      id="how-it-works"
    >
      <div className="mx-auto w-full max-w-6xl space-y-10 sm:space-y-14">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Set up once, informed every morning
          </h2>
          <p className="text-pretty text-muted-foreground sm:text-lg">
            Three steps from empty inbox anxiety to a clear founder briefing.
          </p>
        </div>

        <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[7.5rem] right-0 left-0 hidden h-px bg-border lg:block"
          />
          {STEPS.map((item, index) => (
            <div className="relative space-y-5" key={item.step}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 flex size-9 items-center justify-center rounded-full border bg-background font-mono text-xs font-semibold shadow-sm">
                    {item.step}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden h-px flex-1 bg-border sm:block lg:hidden"
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </div>
              <item.Visual />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
