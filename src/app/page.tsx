import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Inbox,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import {
  HeroDashboardPreview,
  HowItWorksSection,
} from "@/components/landing/how-it-works";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUBSCRIPTION_PRICE } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Revenue overnight",
    description:
      "Payments, refunds, and failed charges parsed automatically from Stripe and Paddle notification emails.",
    icon: DollarSign,
  },
  {
    title: "Urgent customer issues",
    description:
      "AI flags bug reports and churn signals from real customers, so nothing critical slips through.",
    icon: AlertCircle,
  },
  {
    title: "Waiting on you",
    description:
      "Threads where someone replied to you 24+ hours ago and is still waiting on your answer.",
    icon: Clock,
  },
  {
    title: "Do this first",
    description:
      "One recommended next action each morning, with an editable AI draft reply. Never auto-sent.",
    icon: Sparkles,
  },
] as const;

const TRUST_POINTS = [
  {
    icon: Lock,
    title: "Read-only access",
    description: "We can never send, delete, or modify your email.",
  },
  {
    icon: ShieldCheck,
    title: "Encrypted tokens",
    description: "Your Google credentials are encrypted at rest with AES-256.",
  },
  {
    icon: RefreshCw,
    title: "Disconnect anytime",
    description: "Revoke access in one click from settings. Your data stays yours.",
  },
] as const;

const PRICING_FEATURES = [
  "Gmail sync every 15 minutes",
  "Revenue parsing from Stripe & Paddle emails",
  "AI urgent-issue detection",
  "\u201CWaiting on you\u201D thread tracking",
  "Editable AI draft replies",
  "Dark and light mode",
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader showAuthLinks />
      <main className="flex flex-1 flex-col">
        {/* Hero — full viewport, split on large screens */}
        <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden border-b py-16 sm:py-20 lg:py-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_15%_20%,oklch(0.94_0.004_286.32/0.7),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_70%,oklch(0.95_0.01_145/0.25),transparent_50%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_15%_20%,oklch(0.274_0.006_286.033/0.55),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_70%,oklch(0.3_0.04_145/0.2),transparent_50%)]"
          />
          <SiteShell className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
            <div className="flex max-w-2xl flex-col gap-6 lg:max-w-none lg:py-20 xl:gap-8">
              <Badge
                className="w-fit gap-1.5 rounded-full px-3 py-1"
                variant="secondary"
              >
                <Inbox className="size-3.5" />
                Built for founders who live in Gmail
              </Badge>
              <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Know what matters in your inbox{" "}
                <span className="text-muted-foreground">
                  before your first coffee
                </span>
              </h1>
              <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg xl:text-xl">
                Overnight revenue, urgent customer issues, threads waiting on
                you, and one clear next action — synced from Gmail every 15
                minutes.
              </p>
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full sm:w-auto",
                  )}
                  href="/login"
                >
                  Start 14-day free trial
                  <ArrowRight />
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "w-full sm:w-auto",
                  )}
                  href="#how-it-works"
                >
                  See how it works
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />$
                  {SUBSCRIPTION_PRICE}/month after trial
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  Read-only Gmail
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  No auto-send
                </span>
              </div>
            </div>

            <div className="w-full lg:py-16">
              <HeroDashboardPreview />
            </div>
          </SiteShell>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 py-16 sm:py-20 lg:py-28">
          <SiteShell className="space-y-12 lg:space-y-16">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                The dashboard
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Four cards. Everything that matters.
              </h2>
              <p className="max-w-2xl text-pretty text-muted-foreground sm:text-lg">
                No folders, no filters, no inbox zero guilt. Just the signal
                from last night, ready when you wake up.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              {FEATURES.map((feature) => (
                <Card className="bg-card shadow-sm" key={feature.title}>
                  <CardHeader className="gap-3 p-6">
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </SiteShell>
        </section>

        <HowItWorksSection />

        {/* Trust */}
        <section className="border-t bg-muted/30 py-16 sm:py-20 lg:py-28">
          <SiteShell className="space-y-12 lg:space-y-16">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Privacy first
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Your inbox stays yours
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
              {TRUST_POINTS.map((point) => (
                <Card className="bg-card shadow-sm" key={point.title}>
                  <CardHeader className="gap-3 p-6 lg:p-8">
                    <point.icon className="size-5 text-muted-foreground" />
                    <CardTitle className="text-base lg:text-lg">
                      {point.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {point.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </SiteShell>
        </section>

        {/* Pricing */}
        <section className="border-t py-16 sm:py-20 lg:py-28">
          <SiteShell>
            <div className="grid items-center gap-10 rounded-2xl border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-12">
              <div className="space-y-5">
                <Badge className="rounded-full" variant="secondary">
                  14-day free trial
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  ${SUBSCRIPTION_PRICE}
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </h2>
                <p className="max-w-md text-muted-foreground">
                  Everything you need for a clear morning briefing. Cancel
                  anytime. Refunds available within 7 days of a paid charge.
                </p>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full sm:w-auto",
                  )}
                  href="/login"
                >
                  Start free trial
                  <ArrowRight />
                </Link>
                <p className="text-xs text-muted-foreground">
                  No credit card required to start.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {PRICING_FEATURES.map((feature) => (
                  <li
                    className="flex items-start gap-2.5 rounded-lg border bg-muted/30 px-4 py-3 text-sm"
                    key={feature}
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SiteShell>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
