export function PaymentTerms() {
  return (
    <>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Subscription Model:</strong> PrepFlow is offered as a monthly subscription service. All prices are in AUD
        unless otherwise stated and are subject to change without notice. We will notify you of any price changes at
        least 30 days in advance.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Subscription Tiers:</strong> PrepFlow offers three subscription tiers:
      </p>
      <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
        <li className="text-fluid-base">
          <strong>Starter:</strong> $69 AUD per month - Includes core features with limitations on recipes and ingredients
        </li>
        <li className="text-fluid-base">
          <strong>Pro:</strong> $129 AUD per month - Includes all Starter features plus unlimited recipes and ingredients,
          advanced analytics, and export capabilities
        </li>
        <li className="text-fluid-base">
          <strong>Business:</strong> $199 AUD per month - Includes all Pro features plus multi-user collaboration and API
          access
        </li>
      </ul>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Payment Processing:</strong> Payments are processed securely through Stripe, our payment processor. By
        subscribing to PrepFlow, you agree to{' '}
        <a
          href="https://stripe.com/legal/ssa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          Stripe&apos;s Services Agreement
        </a>{' '}
        and authorize us to charge your payment method on a recurring monthly basis.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Automatic Renewal:</strong> Your subscription will automatically renew each month unless you cancel before
        the end of your current billing period. You will be charged the then-current monthly subscription fee on each
        renewal date.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Subscription Cancellation:</strong> You may cancel your subscription at any time through your account
        settings or by contacting us. Your subscription will remain active until the end of your current billing
        period, after which your access will be terminated. Cancellation does not entitle you to a refund for any
        unused portion of your current billing period.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>EU Data Act Compliance:</strong> For customers located in the European Union, the EU Data Act (effective
        September 12, 2025) provides additional rights. EU customers may cancel their cloud subscription at any time,
        regardless of contract length, without penalty. This right is in addition to the cancellation rights described
        above.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Failed Payments:</strong> If a payment fails, we will attempt to process the payment again. If payment
        continues to fail, we may suspend or terminate your subscription and access to the Service.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>No Refunds:</strong> All subscription fees are non-refundable. We do not provide refunds or credits for
        partial months of service, unused subscription periods, or if you cancel your subscription before the end of
        your billing period.
      </p>
      <p className="text-fluid-base leading-relaxed text-gray-300">
        <strong>Price Changes:</strong> We reserve the right to modify subscription prices at any time. Price changes
        will not affect your current billing period but will apply to subsequent renewals. We will notify you of any
        price changes at least 30 days in advance.
      </p>
    </>
  );
}


