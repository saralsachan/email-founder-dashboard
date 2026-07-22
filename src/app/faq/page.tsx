import Link from "next/link";

import { LegalPage } from "@/components/layout/legal-page";
import { SUBSCRIPTION_PRICE } from "@/lib/billing/plans";

export const metadata = {
  title: "FAQs · Founder Dashboard",
  description:
    "Answers about Gmail access, syncing, billing, refunds, and AI drafts.",
};

const FAQS = [
  {
    question: "What does Founder Dashboard do?",
    answer:
      "It syncs your Gmail on a schedule and shows overnight revenue signals, urgent customer issues, threads waiting on your reply, and one recommended next action with an editable AI draft.",
  },
  {
    question: "Do you send email for me?",
    answer:
      "No. Access is read-only. Draft replies are generated for you to review, edit, copy, and send yourself from Gmail.",
  },
  {
    question: "What Gmail permissions do you need?",
    answer:
      "We request read-only Gmail access so we can sync messages needed for the dashboard. We cannot send, delete, or modify your mail.",
  },
  {
    question: "How often does sync run?",
    answer:
      "Automatic sync runs about every 15 minutes. You can also trigger a manual sync from the dashboard (subject to a short cooldown).",
  },
  {
    question: "How are revenue numbers calculated?",
    answer:
      "We parse payment-provider notification emails (such as Stripe or Paddle) for payments, refunds, and failed charges over the last 24 hours. Totals depend on those emails being present and parseable in your inbox.",
  },
  {
    question: "How does “urgent” detection work?",
    answer:
      "Non-marketing customer emails are classified with AI to flag likely bug reports and churn signals. Classification is probabilistic and may occasionally miss or over-flag messages.",
  },
  {
    question: "What is “Waiting on you”?",
    answer:
      "Those are threads where you previously replied and the other person has been waiting 24+ hours without a follow-up from you (based on synced thread data).",
  },
  {
    question: "Is there a free trial?",
    answer: `Yes. New accounts get a 14-day free trial. After that, the plan is $${SUBSCRIPTION_PRICE}/month unless you cancel.`,
  },
  {
    question: "What is your refund policy?",
    answer:
      "Paid subscription charges can be refunded if you request within 7 days of the charge. See the Refund Policy page for details.",
  },
  {
    question: "Can I disconnect Gmail?",
    answer:
      "Yes. Use Settings → Disconnect Gmail, or revoke access from your Google Account permissions. Syncing will stop until you reconnect.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Google refresh tokens are encrypted at rest (AES-256-GCM), traffic uses HTTPS, and database access is restricted. See the Privacy Policy for full details.",
  },
  {
    question: "Which AI provider do you use?",
    answer:
      "Draft generation and urgency classification go through OpenRouter to underlying models. Only the content needed for those tasks is sent.",
  },
] as const;

export default function FaqPage() {
  return (
    <LegalPage
      description="Quick answers about how Founder Dashboard works, billing, and privacy."
      lastUpdated="July 22, 2026"
      title="Frequently asked questions"
    >
      <div className="space-y-3">
        {FAQS.map((faq) => (
          <details
            className="group rounded-xl border bg-card px-4 py-3 open:pb-4"
            key={faq.question}
          >
            <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{faq.question}</span>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      <section>
        <h2>Still need help?</h2>
        <p>
          Review our <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/terms">Terms of Service</Link>, and{" "}
          <Link href="/refund">Refund Policy</Link>, or contact support through
          your billing receipt / account channel.
        </p>
      </section>
    </LegalPage>
  );
}
