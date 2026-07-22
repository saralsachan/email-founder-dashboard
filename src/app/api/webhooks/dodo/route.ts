import { NextResponse } from "next/server";

import { createDodoClient } from "@/lib/dodo/client";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanStatus } from "@/types/database";

function mapEventToPlanStatus(eventType: string): PlanStatus | null {
  switch (eventType) {
    case "subscription.active":
    case "subscription.renewed":
      return "active";
    case "subscription.on_hold":
      return "past_due";
    case "subscription.cancelled":
    case "subscription.expired":
      return "canceled";
    default:
      return null;
  }
}

function extractUserId(metadata: unknown): string | undefined {
  if (
    metadata &&
    typeof metadata === "object" &&
    "user_id" in metadata &&
    typeof metadata.user_id === "string"
  ) {
    return metadata.user_id;
  }
  return undefined;
}

function extractCustomerId(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  if ("customer" in data) {
    const customer = data.customer;
    if (
      customer &&
      typeof customer === "object" &&
      "customer_id" in customer &&
      typeof customer.customer_id === "string"
    ) {
      return customer.customer_id;
    }
  }

  if ("customer_id" in data && typeof data.customer_id === "string") {
    return data.customer_id;
  }

  return undefined;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("DODO_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const client = createDodoClient();

  let event: { type: string; data: unknown };

  try {
    event = client.webhooks.unwrap(rawBody, {
      key: webhookSecret,
      headers: {
        "webhook-id": request.headers.get("webhook-id") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      },
    });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type === "payment.failed") {
    const admin = createAdminClient();
    const customerId = extractCustomerId(event.data);
    const userId = extractUserId(
      event.data && typeof event.data === "object" && "metadata" in event.data
        ? event.data.metadata
        : undefined,
    );

    if (userId) {
      await admin.from("users").update({ plan_status: "past_due" }).eq("id", userId);
    } else if (customerId) {
      await admin
        .from("users")
        .update({ plan_status: "past_due" })
        .eq("dodo_customer_id", customerId);
    }

    return NextResponse.json({ received: true });
  }

  const planStatus = mapEventToPlanStatus(event.type);
  if (!planStatus) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const admin = createAdminClient();
  const customerId = extractCustomerId(event.data);
  const metadata =
    event.data && typeof event.data === "object" && "metadata" in event.data
      ? event.data.metadata
      : undefined;
  const userId = extractUserId(metadata);

  const updatePayload: { plan_status: PlanStatus; dodo_customer_id?: string } = {
    plan_status: planStatus,
  };

  if (customerId && planStatus === "active") {
    updatePayload.dodo_customer_id = customerId;
  }

  if (userId) {
    await admin.from("users").update(updatePayload).eq("id", userId);
  } else if (customerId) {
    await admin.from("users").update(updatePayload).eq("dodo_customer_id", customerId);
  }

  return NextResponse.json({ received: true });
}
