import { NextResponse } from "next/server";

import { encryptToken } from "@/lib/crypto/tokens";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    console.error("Auth callback failed:", error?.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const { session, user } = data;
  const admin = createAdminClient();

  const userPayload: {
    id: string;
    email: string;
    google_refresh_token?: string;
  } = {
    id: user.id,
    email: user.email ?? "",
  };

  if (session.provider_refresh_token) {
    try {
      userPayload.google_refresh_token = encryptToken(
        session.provider_refresh_token,
      );
    } catch (tokenError) {
      console.error("Failed to encrypt refresh token:", tokenError);
    }
  } else {
    console.warn(
      "No provider_refresh_token returned — user may need to reconnect Gmail.",
    );
  }

  const { error: upsertError } = await admin.from("users").upsert(userPayload, {
    onConflict: "id",
  });

  if (upsertError) {
    console.error("Failed to upsert user profile:", upsertError.message);
    return NextResponse.redirect(`${origin}/login?error=profile_failed`);
  }

  const { data: existingSyncState } = await admin
    .from("sync_state")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingSyncState) {
    const { error: syncStateError } = await admin.from("sync_state").insert({
      user_id: user.id,
      sync_in_progress: false,
    });

    if (syncStateError) {
      console.error("Failed to create sync_state row:", syncStateError.message);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
