import { extractSenderDomain } from "@/lib/gmail/message-utils";
import type { ParsedMessage, RevenueParseResult } from "@/lib/gmail/types";
import type { PaymentProvider } from "@/types/database";

const STRIPE_DOMAINS = new Set([
  "stripe.com",
  "e.stripe.com",
  "notify.stripe.com",
  "receipts.stripe.com",
]);

const PADDLE_DOMAINS = new Set([
  "paddle.com",
  "vendor.paddle.com",
  "notification.paddle.com",
  "notifications.paddle.com",
]);

function resolveProvider(domain: string): PaymentProvider | null {
  if (STRIPE_DOMAINS.has(domain) || domain.endsWith(".stripe.com")) {
    return "stripe";
  }

  if (PADDLE_DOMAINS.has(domain) || domain.endsWith(".paddle.com")) {
    return "paddle";
  }

  return null;
}

function parseAmount(text: string): { amount: number; currency: string } | null {
  const currencyFirst = text.match(
    /\b([A-Z]{3})\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)\b/,
  );
  if (currencyFirst) {
    const amount = Number(currencyFirst[2].replace(/,/g, ""));
    if (!Number.isNaN(amount)) {
      return { amount, currency: currencyFirst[1] };
    }
  }

  const labeledSymbol = text.match(
    /(?:payment|charge|refund|amount)\s*(?:of|:)?\s*([$€£])\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i,
  );
  if (labeledSymbol) {
    const amount = Number(labeledSymbol[2].replace(/,/g, ""));
    if (!Number.isNaN(amount)) {
      const symbol = labeledSymbol[1];
      const currency =
        symbol === "$"
          ? "USD"
          : symbol === "€"
            ? "EUR"
            : symbol === "£"
              ? "GBP"
              : "USD";
      return { amount, currency };
    }
  }

  const symbolOnly = text.match(
    /([$€£])\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/,
  );
  if (symbolOnly) {
    const amount = Number(symbolOnly[2].replace(/,/g, ""));
    if (!Number.isNaN(amount)) {
      const symbol = symbolOnly[1];
      const currency =
        symbol === "$"
          ? "USD"
          : symbol === "€"
            ? "EUR"
            : symbol === "£"
              ? "GBP"
              : "USD";
      return { amount, currency };
    }
  }

  const amountCurrency = text.match(
    /\b([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)\s*([A-Z]{3})\b/,
  );
  if (amountCurrency) {
    const amount = Number(amountCurrency[1].replace(/,/g, ""));
    if (!Number.isNaN(amount)) {
      return { amount, currency: amountCurrency[2] };
    }
  }

  return null;
}

function detectEventType(text: string): RevenueParseResult["type"] | null {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("payment failed") ||
    normalized.includes("charge failed") ||
    normalized.includes("failed payment") ||
    normalized.includes("couldn't process") ||
    normalized.includes("could not process") ||
    normalized.includes("card was declined")
  ) {
    return "failed_charge";
  }

  if (
    normalized.includes("refund") ||
    normalized.includes("refunded") ||
    normalized.includes("returned payment")
  ) {
    return "refund";
  }

  if (
    normalized.includes("payment received") ||
    normalized.includes("received a payment") ||
    normalized.includes("successful payment") ||
    normalized.includes("payment succeeded") ||
    normalized.includes("you've been paid") ||
    normalized.includes("new sale") ||
    normalized.includes("new payment")
  ) {
    return "payment";
  }

  return null;
}

export function parseRevenueEmail(message: ParsedMessage): RevenueParseResult | null {
  const domain = extractSenderDomain(message.sender);
  const provider = resolveProvider(domain);

  if (!provider) {
    return null;
  }

  const searchableText = `${message.subject}\n${message.body}\n${message.snippet}`;
  const eventType = detectEventType(searchableText);
  const amountInfo = parseAmount(searchableText);

  if (!eventType || !amountInfo) {
    return null;
  }

  return {
    type: eventType,
    amount: amountInfo.amount,
    currency: amountInfo.currency,
    provider,
  };
}

export function isRevenueSender(sender: string): boolean {
  const domain = extractSenderDomain(sender);
  return resolveProvider(domain) !== null;
}
