"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { Separator } from "@/components/ui/separator";
import { getTrialDaysRemaining, SUBSCRIPTION_PRICE } from "@/lib/billing/plans";
import type { PlanStatus } from "@/types/database";
import { cn } from "@/lib/utils";

import { SignOutButton } from "../dashboard/sign-out-button";

interface SettingsClientProps {
  email: string;
  planStatus: PlanStatus;
  createdAt: string;
  gmailConnected: boolean;
}

export function SettingsClient({
  email,
  planStatus,
  createdAt,
  gmailConnected,
}: SettingsClientProps) {
  const router = useRouter();
  const [disconnecting, setDisconnecting] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const trialDaysRemaining =
    planStatus === "trialing" ? getTrialDaysRemaining(createdAt) : null;

  async function handleDisconnect() {
    setDisconnecting(true);
    setMessage(null);

    const response = await fetch("/api/settings/disconnect-gmail", {
      method: "POST",
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "Failed to disconnect");
      setDisconnecting(false);
      return;
    }

    router.refresh();
    setMessage("Gmail disconnected.");
    setDisconnecting(false);
  }

  async function handleManageBilling() {
    setCheckoutLoading(true);
    setMessage(null);

    const response = await fetch("/api/billing/checkout", { method: "POST" });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Billing unavailable");
      setCheckoutLoading(false);
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  return (
    <>
      <SiteHeader
        actions={
          <>
            <Link
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              href="/dashboard"
            >
              Dashboard
            </Link>
            <SignOutButton />
          </>
        }
      />
      <PageContainer className="max-w-2xl space-y-6">
        <div className="space-y-1 border-b pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, Gmail connection, and billing.
          </p>
        </div>

        {message && (
          <p className="rounded-lg border bg-muted/50 px-3 py-2.5 text-sm">
            {message}
          </p>
        )}

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>{email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2.5">
              <span className="text-sm">Plan status</span>
              <Badge className="capitalize" variant="secondary">
                {planStatus}
              </Badge>
            </div>
            {trialDaysRemaining !== null && (
              <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2.5">
                <span className="text-sm">Trial remaining</span>
                <span className="text-sm font-medium">{trialDaysRemaining} days</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Gmail connection</CardTitle>
            <CardDescription>
              {gmailConnected
                ? "Connected with read-only access."
                : "Not connected — sign in again to grant access."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {gmailConnected ? (
              <Button
                disabled={disconnecting}
                onClick={() => void handleDisconnect()}
                variant="outline"
              >
                {disconnecting && <Loader2 className="animate-spin" />}
                Disconnect Gmail
              </Button>
            ) : (
              <Link className={cn(buttonVariants())} href="/login">
                Reconnect Gmail
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Billing</CardTitle>
            <CardDescription>
              ${SUBSCRIPTION_PRICE}/month · 14-day free trial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <Button
              disabled={checkoutLoading}
              onClick={() => void handleManageBilling()}
              variant="outline"
            >
              {checkoutLoading && <Loader2 className="animate-spin" />}
              Manage billing
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
