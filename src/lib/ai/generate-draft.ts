import { getDraftModel, openRouterChat } from "@/lib/ai/openrouter";
import type { UrgentSubcategory } from "@/types/database";

interface DraftInput {
  sender: string;
  subject: string;
  snippet: string;
  body?: string;
  category?: UrgentSubcategory | null;
}

function buildSystemPrompt(category?: UrgentSubcategory | null): string {
  const base = `You draft brief, professional, empathetic email replies for a founder responding to customer email.
Write only the reply body — no subject line, no signature block, no markdown.
Keep it concise (3-6 sentences). Never promise specific timelines unless asked; for bugs acknowledge and commit to investigating.`;

  if (category === "bug") {
    return `${base}
The customer reported a bug or something broken. Acknowledge the issue, apologize for the friction, and give a realistic next step or timeline for a fix.`;
  }

  if (category === "churn") {
    return `${base}
The customer may be canceling or unhappy. Acknowledge their frustration, ask what went wrong, and offer to help resolve it before they leave.`;
  }

  return `${base}
This is a customer email needing a thoughtful reply. Be warm, direct, and helpful.`;
}

export async function generateDraftReply(input: DraftInput): Promise<string> {
  const bodyExcerpt = input.body?.slice(0, 2000) ?? input.snippet;

  const user = `Original email from: ${input.sender}
Subject: ${input.subject}
Body: ${bodyExcerpt}

Draft a reply the founder can review and send manually.`;

  return openRouterChat({
    model: getDraftModel(),
    system: buildSystemPrompt(input.category),
    user,
    maxTokens: 512,
  });
}
