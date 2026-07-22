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

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HowItWorksSection } from "@/components/landing/how-it-works";
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
        {/* Hero */}
        <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.92_0.004_286.32/0.6),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.274_0.006_286.033/0.5),transparent)]"
          />
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center sm:gap-8">
            <Badge className="gap-1.5 rounded-full px-3 py-1" variant="secondary">
              <Inbox className="size-3.5" />
              Built for founders who live in Gmail
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Know what matters in your inbox{" "}
              <span className="text-muted-foreground">
                before your first coffee
              </span>
            </h1>
            <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
              Overnight revenue, urgent customer issues, threads waiting on you,
              and one clear next action — synced from Gmail every 15 minutes.
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
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
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4" />
                ${SUBSCRIPTION_PRICE}/month after trial
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
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto w-full max-w-6xl space-y-10 sm:space-y-14">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                The dashboard
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Four cards. Everything that matters.
              </h2>
              <p className="text-pretty text-muted-foreground sm:text-lg">
                No folders, no filters, no inbox zero guilt. Just the signal
                from last night, ready when you wake up.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
              {FEATURES.map((feature) => (
                <Card className="bg-card shadow-sm" key={feature.title}>
                  <CardHeader className="gap-3 p-6 sm:p-7">
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <HowItWorksSection />

        {/* Trust */}
        <section className="border-t bg-muted/30 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto w-full max-w-6xl space-y-10 sm:space-y-14">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Privacy first
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Your inbox stays yours
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
              {TRUST_POINTS.map((point) => (
                <Card className="bg-card shadow-sm" key={point.title}>
                  <CardHeader className="gap-3 p-6">
                    <point.icon className="size-5 text-muted-foreground" />
                    <CardTitle className="text-base">{point.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {point.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section className="border-t px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto w-full max-w-lg">
            <Card className="shadow-sm">
              <CardHeader className="gap-4 p-6 text-center sm:p-8">
                <Badge className="mx-auto rounded-full" variant="secondary">
                  14-day free trial
                </Badge>
                <CardTitle className="text-3xl tracking-tight sm:text-4xl">
                  ${SUBSCRIPTION_PRICE}
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </CardTitle>
                <ul className="mx-auto space-y-2.5 text-left">
                  {PRICING_FEATURES.map((feature) => (
                    <li
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      key={feature}
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                  href="/login"
                >
                  Start free trial
                  <ArrowRight />
                </Link>
                <p className="text-xs text-muted-foreground">
                  No credit card required to start. Cancel anytime.
                </p>
              </CardHeader>
            </Card>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
