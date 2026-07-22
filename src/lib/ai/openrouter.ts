const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterChatParams {
  model: string;
  system: string;
  user: string;
  maxTokens: number;
}

function getApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  return apiKey;
}

export function getClassifyModel(): string {
  return (
    process.env.OPENROUTER_CLASSIFY_MODEL ?? "anthropic/claude-3.5-haiku"
  );
}

export function getDraftModel(): string {
  return (
    process.env.OPENROUTER_DRAFT_MODEL ?? "anthropic/claude-3.5-sonnet"
  );
}

export async function openRouterChat(
  params: OpenRouterChatParams,
): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...(appUrl ? { "HTTP-Referer": appUrl } : {}),
      "X-Title": "Founder Dashboard",
    },
    body: JSON.stringify({
      model: params.model,
      max_tokens: params.maxTokens,
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error("OpenRouter returned an empty response");
  }

  return content.trim();
}
