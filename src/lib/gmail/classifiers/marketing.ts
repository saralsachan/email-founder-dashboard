import { extractEmailAddress, extractSenderDomain } from "@/lib/gmail/message-utils";
import type { ParsedMessage } from "@/lib/gmail/types";

const MARKETING_LOCAL_PARTS = [
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "newsletter",
  "marketing",
  "promo",
  "promotions",
  "updates",
  "notifications",
  "hello",
  "team",
  "news",
  "digest",
];

const MARKETING_DOMAINS = [
  "mailchimp.com",
  "sendgrid.net",
  "constantcontact.com",
  "substack.com",
  "beehiiv.com",
  "hubspotemail.net",
  "campaign-archive.com",
  "click.mail",
];

const MARKETING_SUBJECT_PATTERNS = [
  /\bnewsletter\b/i,
  /\bunsubscribe\b/i,
  /\bweekly digest\b/i,
  /\bdaily digest\b/i,
  /\blimited time\b/i,
  /\b% off\b/i,
  /\bsale ends\b/i,
];

export function isMarketingOrNewsletter(message: ParsedMessage): boolean {
  const email = extractEmailAddress(message.sender);
  const [localPart = "", domain = ""] = email.split("@");

  if (message.headers["list-unsubscribe"]) {
    return true;
  }

  if (message.headers["precedence"]?.toLowerCase() === "bulk") {
    return true;
  }

  if (MARKETING_LOCAL_PARTS.some((part) => localPart.includes(part))) {
    return true;
  }

  if (
    MARKETING_DOMAINS.some(
      (marketingDomain) =>
        domain === marketingDomain || domain.endsWith(`.${marketingDomain}`),
    )
  ) {
    return true;
  }

  const senderDomain = extractSenderDomain(message.sender);
  if (senderDomain.includes("mail.") || senderDomain.startsWith("email.")) {
    return true;
  }

  return MARKETING_SUBJECT_PATTERNS.some((pattern) =>
    pattern.test(`${message.subject} ${message.snippet}`),
  );
}
