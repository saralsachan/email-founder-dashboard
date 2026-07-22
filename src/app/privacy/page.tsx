import Link from "next/link";

import { LegalPage } from "@/components/layout/legal-page";

export const metadata = {
  title: "Privacy Policy · Founder Dashboard",
  description:
    "How Founder Dashboard collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      description="How we collect, use, store, and protect your information when you use Founder Dashboard."
      lastUpdated="July 22, 2026"
      title="Privacy Policy"
    >
      <section>
        <h2>1. Overview</h2>
        <p>
          Founder Dashboard (“we”, “us”, or “our”) provides a morning briefing
          dashboard that syncs selected Gmail data to surface revenue events,
          urgent customer issues, and threads waiting on your reply. This
          Privacy Policy explains what data we process and why.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <h3>Account information</h3>
        <ul>
          <li>Google account email address and basic profile details</li>
          <li>Authentication tokens required to access Gmail on your behalf</li>
          <li>Plan status, trial dates, and billing-related identifiers</li>
        </ul>
        <h3>Gmail data (read-only)</h3>
        <ul>
          <li>
            Message metadata and content needed to classify emails (subject,
            sender, snippet, thread IDs, and relevant message bodies)
          </li>
          <li>
            Parsed revenue signals from payment provider notifications (for
            example Stripe or Paddle emails)
          </li>
        </ul>
        <h3>Usage and technical data</h3>
        <ul>
          <li>Sync timestamps, feature usage related to drafts and settings</li>
          <li>
            Standard server logs such as IP address, browser type, and request
            timestamps
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use your information</h2>
        <ul>
          <li>Authenticate you and maintain your session</li>
          <li>Sync and display your founder dashboard</li>
          <li>
            Classify emails for urgency and generate editable draft replies
            using AI providers
          </li>
          <li>Process subscriptions, trials, and refunds</li>
          <li>Improve reliability, security, and customer support</li>
        </ul>
        <p>
          We request <strong>read-only</strong> Gmail access. We do not send,
          delete, or modify emails in your mailbox.
        </p>
      </section>

      <section>
        <h2>4. AI processing</h2>
        <p>
          Selected email content may be sent to our AI provider (via OpenRouter)
          solely to classify urgency and generate draft replies. Drafts are never
          sent automatically. You remain in control of whether and how you use
          any suggested text.
        </p>
      </section>

      <section>
        <h2>5. Data storage and security</h2>
        <ul>
          <li>
            Google refresh tokens are encrypted at rest using AES-256-GCM before
            storage
          </li>
          <li>
            Application data is stored in a managed PostgreSQL database
            (Supabase) with access controls
          </li>
          <li>
            We use industry-standard transport encryption (HTTPS/TLS) for data
            in transit
          </li>
        </ul>
        <p>
          No method of transmission or storage is 100% secure. We work to
          protect your information, but we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>6. Sharing of information</h2>
        <p>We share data only with processors needed to run the service, such as:</p>
        <ul>
          <li>Authentication and database hosting (Supabase)</li>
          <li>Payment processing (Dodo Payments)</li>
          <li>AI inference (OpenRouter and underlying model providers)</li>
          <li>Background job infrastructure used for scheduled sync</li>
        </ul>
        <p>
          We do not sell your personal information. We may disclose information
          if required by law or to protect the rights, safety, or integrity of
          the service.
        </p>
      </section>

      <section>
        <h2>7. Retention and deletion</h2>
        <p>
          We retain account and synced email records while your account is
          active and as needed for billing, security, and legal obligations. You
          may disconnect Gmail at any time from Settings. You may request
          account deletion by contacting us; we will delete or anonymize
          personal data except where retention is required by law.
        </p>
      </section>

      <section>
        <h2>8. Your choices</h2>
        <ul>
          <li>Disconnect Gmail from Settings</li>
          <li>Revoke Google access from your Google Account permissions</li>
          <li>Cancel your subscription or request a refund per our Refund Policy</li>
          <li>
            Contact us with privacy questions or data requests (see Contact)
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Children’s privacy</h2>
        <p>
          Founder Dashboard is intended for business users and is not directed
          to children under 16. We do not knowingly collect personal information
          from children.
        </p>
      </section>

      <section>
        <h2>10. Changes</h2>
        <p>
          We may update this Privacy Policy from time to time. The “Last
          updated” date at the top will change when we do. Continued use of the
          service after an update constitutes acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          For privacy questions, reach us through the support channel listed on
          your billing or account communications, or reply to any Founder
          Dashboard transactional email associated with your account. Related
          policies:{" "}
          <Link href="/terms">Terms of Service</Link>,{" "}
          <Link href="/refund">Refund Policy</Link>, and{" "}
          <Link href="/faq">FAQs</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
