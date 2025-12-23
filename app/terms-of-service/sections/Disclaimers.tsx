export function Disclaimers() {
  return (
    <>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Service Availability:</strong> We strive to provide reliable service but cannot guarantee uninterrupted
        access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Data Accuracy:</strong> While PrepFlow provides tools for analysis, the accuracy of results depends on
        the data you input. We are not responsible for decisions made based on PrepFlow insights.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Business Outcomes:</strong> PrepFlow is a tool to assist decision-making, but we do not guarantee
        specific financial results, increased profits, or business success.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Third-Party Services:</strong> PrepFlow integrates with third-party services including{' '}
        <a
          href="https://stripe.com/legal/ssa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          Stripe
        </a>{' '}
        (payment processing),{' '}
        <a
          href="https://auth0.com/legal/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          Auth0
        </a>{' '}
        (authentication), and{' '}
        <a
          href="https://supabase.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          Supabase
        </a>{' '}
        (database hosting). We are not responsible for their availability, functionality, or terms of service. Your use
        of these third-party services is subject to their respective{' '}
        <a
          href="https://stripe.com/legal/ssa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          terms
        </a>{' '}
        and{' '}
        <a
          href="https://stripe.com/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          privacy policies
        </a>
        .
      </p>
      <p className="text-fluid-base mb-4 leading-relaxed text-gray-300">
        <strong>Data Storage:</strong> Your data is stored securely using{' '}
        <a
          href="https://supabase.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          Supabase
        </a>
        , our database hosting provider. While we implement industry-standard security measures, we cannot guarantee
        absolute security of data transmitted over the internet or stored in cloud databases. Your use of Supabase is
        subject to their{' '}
        <a
          href="https://supabase.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          terms of service
        </a>{' '}
        and{' '}
        <a
          href="https://supabase.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#29E7CD] hover:underline"
        >
          privacy policy
        </a>
        .
      </p>
      <p className="text-fluid-base leading-relaxed text-gray-300">
        <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, PrepFlow shall not be liable
        for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or
        business interruption, arising from your use of or inability to use PrepFlow.
      </p>
    </>
  );
}

