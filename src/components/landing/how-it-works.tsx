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

import { SiteShell } from "@/components/layout/site-shell";
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
    <MockChrome className="h-full" title="founder-dashboard.app/login">
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
    <MockChrome className="h-full" title="Background sync · every 15 min">
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
                  row.tone === "warn" && "bg-destructive/10 text-destructive",
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
    <MockChrome className="h-full" title="Morning dashboard">
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
    <section className="border-t py-16 sm:py-20 lg:py-28" id="how-it-works">
      <SiteShell className="space-y-12 lg:space-y-16">
        <div className="max-w-3xl space-y-3 lg:max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Set up once, informed every morning
          </h2>
          <p className="max-w-2xl text-pretty text-muted-foreground sm:text-lg">
            Three steps from empty inbox anxiety to a clear founder briefing.
          </p>
        </div>

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[7.5rem] right-0 left-0 hidden h-px bg-border md:block"
          />
          {STEPS.map((item) => (
            <div className="relative flex flex-col gap-5" key={item.step}>
              <div className="space-y-3">
                <span className="relative z-10 flex size-9 items-center justify-center rounded-full border bg-background font-mono text-xs font-semibold shadow-sm">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold tracking-tight lg:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </div>
              <div className="flex-1">
                <item.Visual />
              </div>
            </div>
          ))}
        </div>
      </SiteShell>
    </section>
  );
}

export function HeroDashboardPreview() {
  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-3xl bg-muted/40 blur-2xl"
      />
      <MockChrome title="app.founder-dashboard · Today">
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3 border-b pb-3">
            <div>
              <p className="text-xs text-muted-foreground">Good morning, Saral</p>
              <p className="text-sm font-semibold tracking-tight">
                Wednesday, July 22
              </p>
            </div>
            <Badge variant="secondary">Synced 2m ago</Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border bg-background p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CircleDollarSign className="size-3.5" />
                Revenue overnight
              </div>
              <p className="text-2xl font-semibold tabular-nums tracking-tight text-emerald-700 dark:text-emerald-400">
                $1,240
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                2 refunds · 1 failed charge
              </p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <AlertTriangle className="size-3.5" />
                Urgent issues
              </div>
              <p className="text-sm font-medium">Checkout failing on mobile</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                “Payments break after Apple Pay — losing customers.”
              </p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock3 className="size-3.5" />
                Waiting on you
              </div>
              <p className="text-sm font-medium">Acme Corp renewal</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                2 days overdue
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-background p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Sparkles className="size-3.5" />
                Do this first
              </div>
              <p className="text-sm font-medium">Draft reply ready</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Review · edit · copy to Gmail
              </p>
            </div>
          </div>
        </div>
      </MockChrome>
    </div>
  );
}
