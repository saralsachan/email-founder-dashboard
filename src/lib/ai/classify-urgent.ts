import { getClassifyModel, openRouterChat } from "@/lib/ai/openrouter";
import type { ParsedMessage, UrgentClassification } from "@/lib/gmail/types";
import type { UrgentSubcategory } from "@/types/database";

function parseClassification(raw: string): UrgentClassification {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { urgent: false, category: null, confidence: null };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      urgent?: boolean;
      category?: UrgentSubcategory | null;
    };

    const category =
      parsed.category === "bug" ||
      parsed.category === "churn" ||
      parsed.category === "other"
        ? parsed.category
        : null;

    return {
      urgent: Boolean(parsed.urgent),
      category: parsed.urgent ? category : null,
      confidence: parsed.urgent ? 0.85 : 0.9,
    };
  } catch {
    return { urgent: false, category: null, confidence: null };
  }
}

export async function classifyUrgentEmail(
  message: ParsedMessage,
): Promise<UrgentClassification> {
  const system = `You classify founder inbox emails as urgent customer issues or not.
Output ONLY a JSON object with this exact shape:
{"urgent": true|false, "category": "bug"|"churn"|"other"|null}

Rules:
- urgent=true only for genuine customer problems: bugs, broken product, cancellation/churn risk, angry support requests needing response
- category "bug" for product defects or things not working
- category "churn" for cancellation intent, downgrade, refund demand due to dissatisfaction
- category "other" for urgent customer issues that are neither clearly bug nor churn
- urgent=false for newsletters, marketing, automated notifications, receipts, shipping updates, social alerts, recruiting, and routine non-urgent mail
- When urgent=false, category must be null`;

  const user = `Sender: ${message.sender}
Subject: ${message.subject}
Snippet: ${message.snippet}
Body excerpt: ${message.body.slice(0, 1200)}`;

  const text = await openRouterChat({
    model: getClassifyModel(),
    system,
    user,
    maxTokens: 128,
  });

  return parseClassification(text);
}
