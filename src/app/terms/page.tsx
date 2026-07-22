import Link from "next/link";

import { LegalPage } from "@/components/layout/legal-page";
import { SUBSCRIPTION_PRICE } from "@/lib/billing/plans";

export const metadata = {
  title: "Terms of Service · Founder Dashboard",
  description: "Terms governing your use of Founder Dashboard.",
};

export default function TermsPage() {
  return (
    <LegalPage
      description="The agreement between you and Founder Dashboard for use of the service."
      lastUpdated="July 22, 2026"
      title="Terms of Service"
    >
      <section>
        <h2>1. Acceptance of terms</h2>
        <p>
          By creating an account, connecting Gmail, starting a trial, or using
          Founder Dashboard (“Service”), you agree to these Terms of Service
          (“Terms”). If you do not agree, do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of the service</h2>
        <p>
          Founder Dashboard syncs selected Gmail data on a schedule to show
          overnight revenue signals, urgent customer issues, threads waiting on
          you, and a recommended next action with an editable AI draft reply.
          The Service is informational. It does not send email on your behalf.
        </p>
      </section>

      <section>
        <h2>3. Eligibility</h2>
        <p>
          You must be at least 18 years old (or the age of majority in your
          jurisdiction) and able to form a binding contract. You represent that
          you have authority to connect the Google account you use with the
          Service.
        </p>
      </section>

      <section>
        <h2>4. Accounts and Google access</h2>
        <ul>
          <li>
            You are responsible for maintaining the security of your account
          </li>
          <li>
            You grant us permission to access Gmail with the scopes you approve
            during OAuth (read-only)
          </li>
          <li>
            You may disconnect Gmail or revoke access at any time; doing so may
            limit or disable core features
          </li>
          <li>
            You must comply with Google’s terms and applicable email and privacy
            laws when using the Service
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Subscriptions, trials, and billing</h2>
        <p>
          The Service offers a 14-day free trial. After the trial, continued
          access requires an active paid subscription at ${SUBSCRIPTION_PRICE}
          per month unless otherwise stated at checkout. Payments are processed
          by our payment provider. Taxes may apply where required.
        </p>
        <p>
          Refunds are governed by our{" "}
          <Link href="/refund">Refund Policy</Link>. Subscriptions renew until
          canceled according to the billing flow provided at checkout or in
          account settings.
        </p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Misuse the Service or attempt unauthorized access</li>
          <li>Interfere with syncing, billing, or security mechanisms</li>
          <li>
            Use the Service to process data you are not authorized to access
          </li>
          <li>
            Reverse engineer, scrape, or abuse rate limits in a way that harms
            the Service or third-party providers
          </li>
          <li>
            Use AI outputs in a misleading or unlawful manner (for example,
            impersonation or spam)
          </li>
        </ul>
      </section>

      <section>
        <h2>7. AI-generated drafts</h2>
        <p>
          Draft replies are suggestions only. You are solely responsible for
          reviewing, editing, and sending any message. We do not auto-send
          email. AI output may be inaccurate or incomplete; do not rely on it as
          legal, financial, or professional advice.
        </p>
      </section>

      <section>
        <h2>8. Intellectual property</h2>
        <p>
          The Service, including its software, branding, and design, is owned by
          Founder Dashboard or its licensors. You retain ownership of your
          email content. You grant us a limited license to process that content
          solely to provide the Service.
        </p>
      </section>

      <section>
        <h2>9. Disclaimer of warranties</h2>
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM
          EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR
          IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT CLASSIFICATIONS, REVENUE
          TOTALS, OR DRAFTS WILL BE ERROR-FREE OR COMPLETE.
        </p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, FOUNDER DASHBOARD AND ITS
          SUPPLIERS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE,
          DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF
          THE SERVICE WILL NOT EXCEED THE AMOUNTS YOU PAID US IN THE THREE (3)
          MONTHS PRECEDING THE CLAIM.
        </p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>
          You may stop using the Service at any time. We may suspend or
          terminate access if you violate these Terms, if required by law, or if
          we discontinue the Service. Upon termination, your right to use the
          Service ends. Provisions that by nature should survive (including
          liability limits and intellectual property) will survive.
        </p>
      </section>

      <section>
        <h2>12. Changes to the service or terms</h2>
        <p>
          We may modify the Service or these Terms. Material changes will be
          reflected by updating the “Last updated” date. Continued use after
          changes become effective constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>13. Governing law</h2>
        <p>
          These Terms are governed by the laws applicable in the jurisdiction
          where the Service operator is established, without regard to conflict
          of law principles, unless mandatory consumer protections in your
          country provide otherwise.
        </p>
      </section>

      <section>
        <h2>14. Contact</h2>
        <p>
          Questions about these Terms can be sent through your account billing
          support channel. See also our{" "}
          <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/refund">Refund Policy</Link>, and{" "}
          <Link href="/faq">FAQs</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
