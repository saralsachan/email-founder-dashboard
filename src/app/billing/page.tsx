"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUBSCRIPTION_PRICE } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

function BillingContent() {
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed",
      );
      setLoading(false);
    }
  }

  return (
    <PageContainer className="space-y-6" narrow>
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-muted-foreground">Billing</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Upgrade your plan
        </h1>
        <p className="text-muted-foreground">
          ${SUBSCRIPTION_PRICE}/month after your 14-day free trial.
        </p>
      </div>

      {checkoutSuccess && (
        <Card className="border-emerald-500/30 bg-emerald-500/10 shadow-sm">
          <CardContent className="pt-6 text-sm leading-relaxed">
            Payment received. Your subscription will activate shortly once the
            webhook confirms.
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl">Pro plan</CardTitle>
            <Badge variant="secondary">14-day trial</Badge>
          </div>
          <CardDescription className="leading-relaxed">
            Gmail sync every 15 minutes, revenue parsing, urgent issue detection,
            and AI draft replies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <p className="text-4xl font-semibold tracking-tight">
            ${SUBSCRIPTION_PRICE}
            <span className="text-base font-normal text-muted-foreground">
              /month
            </span>
          </p>
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => void handleCheckout()}
            size="lg"
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Redirecting…" : "Start free trial"}
          </Button>
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            href="/dashboard"
          >
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default function BillingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col py-8">
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">
              Loading…
            </div>
          }
        >
          <BillingContent />
        </Suspense>
      </main>
    </>
  );
}
