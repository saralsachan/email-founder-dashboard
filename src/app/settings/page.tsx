import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("email, plan_status, created_at, google_refresh_token")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <SettingsClient
      createdAt={profile?.created_at ?? new Date().toISOString()}
      email={profile?.email ?? user.email ?? ""}
      gmailConnected={Boolean(profile?.google_refresh_token)}
      planStatus={profile?.plan_status ?? "trialing"}
    />
  );
}
