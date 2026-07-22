import { NextResponse } from "next/server";

import { createDodoClient, getAppUrl, getDodoProductId } from "@/lib/dodo/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("users")
      .select("email")
      .eq("id", user.id)
      .maybeSingle();

    const client = createDodoClient();
    const appUrl = getAppUrl();

    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: getDodoProductId(), quantity: 1 }],
      subscription_data: { trial_period_days: 14 },
      customer: {
        email: profile?.email ?? user.email ?? undefined,
        name:
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : undefined,
      },
      return_url: `${appUrl}/billing?checkout=success`,
      metadata: {
        user_id: user.id,
      },
    });

    if (!session.checkout_url) {
      throw new Error("Checkout URL was not returned");
    }

    return NextResponse.json({ checkoutUrl: session.checkout_url });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
