import Link from 'next/link';

export function DataPrivacy() {
  return (
    <>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Data Collection:</strong> PrepFlow collects and processes data necessary to provide the Service,
        including:
      </p>
      <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
        <li className="text-fluid-base">Account information (email, name, subscription details)</li>
        <li className="text-fluid-base">Business data (ingredients, recipes, menu items, costs, sales data)</li>
        <li className="text-fluid-base">Usage data (feature usage, access logs, performance metrics)</li>
        <li className="text-fluid-base">Payment information (processed securely through Stripe)</li>
      </ul>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Data Storage:</strong> Your data is stored securely using Supabase, our database hosting provider. Data
        is encrypted in transit and at rest. We implement industry-standard security measures to protect your data.
      </p>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Data Usage:</strong> We use your data to:
      </p>
      <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
        <li className="text-fluid-base">Provide and improve the Service</li>
        <li className="text-fluid-base">Process payments and manage subscriptions</li>
        <li className="text-fluid-base">Send service-related communications</li>
        <li className="text-fluid-base">Comply with legal obligations</li>
        <li className="text-fluid-base">Prevent fraud and abuse</li>
      </ul>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>Data Sharing:</strong> We do not sell your data to third parties. We may share data with:
      </p>
      <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
        <li className="text-fluid-base">
          <strong>Stripe:</strong> Payment processing and subscription management
        </li>
        <li className="text-fluid-base">
          <strong>Auth0:</strong> User authentication and account management
        </li>
        <li className="text-fluid-base">
          <strong>Supabase:</strong> Database hosting and data storage
        </li>
        <li className="text-fluid-base">
          <strong>Vercel:</strong> Application hosting and performance monitoring
        </li>
        <li className="text-fluid-base">
          <strong>Legal Authorities:</strong> When required by law or to protect our rights
        </li>
      </ul>
      <p className="mb-4 leading-relaxed text-gray-300">
        <strong>GDPR Compliance:</strong> For users in the European Union, PrepFlow complies with the General Data
        Protection Regulation (GDPR). You have the right to:
      </p>
      <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
        <li className="text-fluid-base">Access your personal data</li>
        <li className="text-fluid-base">Rectify inaccurate data</li>
        <li className="text-fluid-base">Request deletion of your data</li>
        <li className="text-fluid-base">Object to processing of your data</li>
        <li className="text-fluid-base">Data portability (export your data)</li>
        <li className="text-fluid-base">Withdraw consent at any time</li>
      </ul>
      <p className="text-fluid-base leading-relaxed text-gray-300">
        <strong>Privacy Policy:</strong> For detailed information about our data practices, please review our{' '}
        <Link href="/privacy-policy" className="text-[#29E7CD] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
