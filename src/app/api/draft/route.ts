import { NextResponse } from "next/server";

import { generateDraftReply } from "@/lib/ai/generate-draft";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { UrgentSubcategory } from "@/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { emailId?: string; threadId?: string; type?: "urgent" | "waiting" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (body.emailId) {
    const { data: email, error } = await admin
      .from("emails")
      .select("sender, subject, raw_snippet, urgent_subcategory, user_id")
      .eq("id", body.emailId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const draft = await generateDraftReply({
      sender: email.sender,
      subject: email.subject,
      snippet: email.raw_snippet ?? "",
      category: email.urgent_subcategory as UrgentSubcategory | null,
    });

    return NextResponse.json({ draft });
  }

  if (body.threadId && body.type === "waiting") {
    const { data: thread, error } = await admin
      .from("waiting_threads")
      .select("last_sender, subject, user_id")
      .eq("thread_id", body.threadId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const draft = await generateDraftReply({
      sender: thread.last_sender,
      subject: thread.subject,
      snippet: thread.subject,
    });

    return NextResponse.json({ draft });
  }

  return NextResponse.json(
    { error: "Provide emailId or threadId with type waiting" },
    { status: 400 },
  );
}
