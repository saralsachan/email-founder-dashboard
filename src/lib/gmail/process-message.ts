import type { GmailClient } from "@/lib/gmail/client";
import {
  extractEmailAddress,
  getHeader,
  parseGmailMessage,
} from "@/lib/gmail/message-utils";
import { isMarketingOrNewsletter } from "@/lib/gmail/classifiers/marketing";
import { isRevenueSender, parseRevenueEmail } from "@/lib/gmail/parsers/revenue";
import type { ParsedMessage } from "@/lib/gmail/types";
import { classifyUrgentEmail } from "@/lib/ai/classify-urgent";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EmailCategory } from "@/types/database";

interface ClassifyContext {
  userId: string;
  userEmail: string;
}

export async function classifyAndStoreMessage(
  message: ParsedMessage,
  context: ClassifyContext,
): Promise<EmailCategory | null> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("emails")
    .select("id, category")
    .eq("user_id", context.userId)
    .eq("gmail_message_id", message.gmailMessageId)
    .maybeSingle();

  if (existing) {
    return existing.category as EmailCategory;
  }

  const revenue = parseRevenueEmail(message);
  if (revenue) {
    const { data: emailRow, error: emailError } = await admin
      .from("emails")
      .insert({
        user_id: context.userId,
        gmail_message_id: message.gmailMessageId,
        thread_id: message.threadId,
        sender: message.sender,
        subject: message.subject,
        received_at: message.receivedAt.toISOString(),
        category: "revenue",
        raw_snippet: message.snippet,
      })
      .select("id")
      .single();

    if (emailError || !emailRow) {
      throw new Error(`Failed to store revenue email: ${emailError?.message}`);
    }

    const { error: revenueError } = await admin.from("revenue_events").insert({
      user_id: context.userId,
      email_id: emailRow.id,
      type: revenue.type,
      amount: revenue.amount,
      currency: revenue.currency,
      provider: revenue.provider,
      occurred_at: message.receivedAt.toISOString(),
    });

    if (revenueError) {
      throw new Error(`Failed to store revenue event: ${revenueError.message}`);
    }

    return "revenue";
  }

  if (isMarketingOrNewsletter(message) || isRevenueSender(message.sender)) {
    return null;
  }

  const classification = await classifyUrgentEmail(message);
  if (!classification.urgent) {
    return null;
  }

  const { error: urgentError } = await admin.from("emails").insert({
    user_id: context.userId,
    gmail_message_id: message.gmailMessageId,
    thread_id: message.threadId,
    sender: message.sender,
    subject: message.subject,
    received_at: message.receivedAt.toISOString(),
    category: "urgent",
    urgent_subcategory: classification.category ?? "other",
    classification_confidence: classification.confidence,
    raw_snippet: message.snippet,
  });

  if (urgentError) {
    throw new Error(`Failed to store urgent email: ${urgentError.message}`);
  }

  return "urgent";
}

export async function updateWaitingThreadForThread(
  gmail: GmailClient,
  userId: string,
  userEmail: string,
  threadId: string,
): Promise<void> {
  const admin = createAdminClient();

  const thread = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
    format: "metadata",
    metadataHeaders: ["From", "Subject", "Date"],
  });

  const messages = thread.data.messages ?? [];
  if (messages.length === 0) {
    return;
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return;
  }

  const headers = lastMessage.payload?.headers ?? [];
  const from = getHeader(headers, "From");
  const subject = getHeader(headers, "Subject");
  const receivedAt = new Date(Number(lastMessage.internalDate ?? Date.now()));
  const lastSenderEmail = extractEmailAddress(from);
  const isFromUser = lastSenderEmail === userEmail.toLowerCase();
  const hoursSince =
    (Date.now() - receivedAt.getTime()) / (1000 * 60 * 60);

  if (isFromUser && hoursSince >= 24) {
    const { error } = await admin.from("waiting_threads").upsert(
      {
        user_id: userId,
        thread_id: threadId,
        last_sender: from,
        last_message_at: receivedAt.toISOString(),
        subject,
      },
      { onConflict: "user_id,thread_id" },
    );

    if (error) {
      throw new Error(`Failed to upsert waiting thread: ${error.message}`);
    }

    return;
  }

  await admin
    .from("waiting_threads")
    .delete()
    .eq("user_id", userId)
    .eq("thread_id", threadId);
}

export async function fetchAndParseMessage(
  gmail: GmailClient,
  messageId: string,
): Promise<ParsedMessage | null> {
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  if (!response.data.id) {
    return null;
  }

  return parseGmailMessage(response.data);
}
