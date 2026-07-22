import type { gmail_v1 } from "googleapis";

import type { ParsedMessage } from "./types";

function normalizeHeaderName(name: string): string {
  return name.toLowerCase();
}

export function getHeader(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string {
  const target = normalizeHeaderName(name);
  const header = headers?.find(
    (item) => item.name && normalizeHeaderName(item.name) === target,
  );
  return header?.value ?? "";
}

function decodeBody(data?: string | null): string {
  if (!data) return "";
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function extractBodyFromPart(part: gmail_v1.Schema$MessagePart): string {
  if (part.body?.data) {
    return decodeBody(part.body.data);
  }

  if (part.parts?.length) {
    const plain = part.parts.find((p) => p.mimeType === "text/plain");
    if (plain) {
      return extractBodyFromPart(plain);
    }

    const html = part.parts.find((p) => p.mimeType === "text/html");
    if (html) {
      return extractBodyFromPart(html);
    }

    return part.parts.map(extractBodyFromPart).join("\n");
  }

  return "";
}

export function parseGmailMessage(message: gmail_v1.Schema$Message): ParsedMessage {
  const headers = message.payload?.headers ?? [];
  const headerMap = Object.fromEntries(
    headers
      .filter((header) => header.name && header.value)
      .map((header) => [normalizeHeaderName(header.name!), header.value!]),
  );

  const body = message.payload ? extractBodyFromPart(message.payload) : "";

  return {
    gmailMessageId: message.id ?? "",
    threadId: message.threadId ?? "",
    sender: getHeader(headers, "From"),
    subject: getHeader(headers, "Subject"),
    snippet: message.snippet ?? "",
    body: body || message.snippet || "",
    receivedAt: new Date(Number(message.internalDate ?? Date.now())),
    headers: headerMap,
  };
}

export function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  if (match?.[1]) {
    return match[1].toLowerCase();
  }
  return value.trim().toLowerCase();
}

export function extractSenderDomain(sender: string): string {
  const email = extractEmailAddress(sender);
  const [, domain = ""] = email.split("@");
  return domain;
}
