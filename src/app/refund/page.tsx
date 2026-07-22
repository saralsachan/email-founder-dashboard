import Link from "next/link";

import { LegalPage } from "@/components/layout/legal-page";
import { SUBSCRIPTION_PRICE } from "@/lib/billing/plans";

export const metadata = {
  title: "Refund Policy · Founder Dashboard",
  description:
    "Refunds are available within 7 days of a paid subscription charge.",
};

export default function RefundPage() {
  return (
    <LegalPage
      description="When and how you can request a refund for Founder Dashboard."
      lastUpdated="July 22, 2026"
      title="Refund Policy"
    >
      <section>
        <h2>1. Summary</h2>
        <p>
          If you are not satisfied with a paid subscription charge, you may
          request a full refund <strong>within 7 days</strong> of that charge.
          Refunds are not available after the 7-day window closes.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <ul>
          <li>
            Refunds apply to paid subscription payments of ${SUBSCRIPTION_PRICE}
            /month (or the amount shown at checkout)
          </li>
          <li>
            The request must be submitted within <strong>7 days</strong> of the
            payment date
          </li>
          <li>
            One refund request per billing charge; abusive or repeated refund
            patterns may result in account restriction
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Free trial</h2>
        <p>
          The 14-day free trial does not require payment to start. Because no
          paid charge occurs during an active unpaid trial, there is nothing to
          refund for trial-only usage. If you convert to a paid plan and are
          charged, the 7-day refund window starts from that paid charge date.
        </p>
      </section>

      <section>
        <h2>4. How to request a refund</h2>
        <ol>
          <li>
            Contact us through your billing/support channel or reply to your
            payment receipt email
          </li>
          <li>
            Include the email address on your Founder Dashboard account and the
            payment date or receipt ID
          </li>
          <li>
            Submit the request within 7 days of the charge you want refunded
          </li>
        </ol>
        <p>
          Approved refunds are issued to the original payment method. Processing
          times depend on the payment provider and your bank or card issuer and
          may take several business days to appear.
        </p>
      </section>

      <section>
        <h2>5. After a refund</h2>
        <p>
          When a refund is approved for the current billing period, paid access
          to the Service may be canceled or downgraded. You may still disconnect
          Gmail and manage account settings as available.
        </p>
      </section>

      <section>
        <h2>6. Cancellations vs refunds</h2>
        <p>
          Canceling a subscription stops future renewals. Cancellation alone
          does not automatically refund a charge already processed. To receive
          money back for a recent paid charge, you must request a refund within
          the 7-day window described above.
        </p>
      </section>

      <section>
        <h2>7. Exceptions</h2>
        <p>
          We may decline refunds that fall outside the 7-day window, that cannot
          be matched to a valid paid charge, or that appear fraudulent. Nothing
          in this policy limits rights you may have under mandatory consumer
          protection laws in your jurisdiction.
        </p>
      </section>

      <section>
        <h2>8. Related policies</h2>
        <p>
          This Refund Policy forms part of your agreement with us, along with
          the <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>. Practical answers are
          also in our <Link href="/faq">FAQs</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
