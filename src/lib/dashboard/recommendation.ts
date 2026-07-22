import { createAdminClient } from "@/lib/supabase/admin";
import type { UrgentSubcategory } from "@/types/database";

export interface RecommendedAction {
  type: "urgent" | "waiting";
  id: string;
  threadId: string;
  sender: string;
  subject: string;
  snippet: string;
  category?: UrgentSubcategory | null;
  receivedAt: string;
}

export async function getRecommendedAction(
  userId: string,
): Promise<RecommendedAction | null> {
  const admin = createAdminClient();

  const { data: urgentEmail } = await admin
    .from("emails")
    .select(
      "id, thread_id, sender, subject, raw_snippet, urgent_subcategory, received_at",
    )
    .eq("user_id", userId)
    .eq("category", "urgent")
    .is("resolved_at", null)
    .in("urgent_subcategory", ["bug", "churn"])
    .order("received_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (urgentEmail) {
    return {
      type: "urgent",
      id: urgentEmail.id,
      threadId: urgentEmail.thread_id,
      sender: urgentEmail.sender,
      subject: urgentEmail.subject,
      snippet: urgentEmail.raw_snippet ?? "",
      category: urgentEmail.urgent_subcategory as UrgentSubcategory | null,
      receivedAt: urgentEmail.received_at,
    };
  }

  const { data: waitingThread } = await admin
    .from("waiting_threads")
    .select("id, thread_id, last_sender, subject, last_message_at")
    .eq("user_id", userId)
    .order("last_message_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (waitingThread) {
    return {
      type: "waiting",
      id: waitingThread.id,
      threadId: waitingThread.thread_id,
      sender: waitingThread.last_sender,
      subject: waitingThread.subject,
      snippet: waitingThread.subject,
      receivedAt: waitingThread.last_message_at,
    };
  }

  return null;
}
