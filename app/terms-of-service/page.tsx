import Link from 'next/link';
import TermsBackground from './TermsBackground';
import TermsMobileTOC from './TermsMobileTOC';
import TermsScrollProgress from './TermsScrollProgress';
import TermsTableOfContents from './TermsTableOfContents';

export const metadata = {
  title: 'Terms of Service | PrepFlow - Usage Terms and Conditions',
  description:
    "Read PrepFlow's terms of service to understand your rights and obligations when using our restaurant profitability optimization tool.",
  keywords: [
    'terms of service',
    'terms and conditions',
    'PrepFlow terms',
    'user agreement',
    'legal terms',
  ],
};

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen scroll-smooth bg-transparent text-white">
      {/* Scroll Progress Indicator */}
      <TermsScrollProgress />

      {/* Base background color */}
      <div className="fixed inset-0 -z-20 bg-[#0a0a0a]" aria-hidden={true} />
      <TermsBackground />
      <div className="tablet:px-6 desktop:px-8 desktop:pr-96 large-desktop:pr-[28rem] tablet:max-w-[90%] desktop:max-w-[85%] large-desktop:max-w-[80%] relative mx-auto w-full max-w-[95%] px-4 py-16 xl:max-w-[75%] xl:pr-[32rem] 2xl:max-w-7xl">
        {/* Table of Contents - Desktop Only */}
        <TermsTableOfContents />

        {/* Mobile Table of Contents - Floating Button & Modal */}
        <TermsMobileTOC />
        {/* Header */}
        <div className="mb-16 text-center">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-3 text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to PrepFlow
          </Link>

          <h1 className="text-fluid-4xl mb-4 font-bold tracking-tight">Terms of Service</h1>
          <p className="text-fluid-xl text-gray-300">Terms and conditions for using PrepFlow</p>
          <p className="text-fluid-sm mt-2 text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-AU')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="space-y-6">
            {/* Introduction */}
            <section
              id="acceptance-of-terms"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                1. Acceptance of Terms
              </h2>
              <p className="text-fluid-base leading-relaxed text-gray-300">
                By accessing and using PrepFlow (&quot;the Service&quot;), you accept and agree to
                be bound by the terms and provision of this agreement. If you do not agree to abide
                by the above, please do not use this service.
              </p>
              <p className="mt-4 leading-relaxed text-gray-300">
                These Terms of Service (&quot;Terms&quot;) govern your use of PrepFlow, a restaurant
                profitability optimization tool provided by PrepFlow (&quot;we&quot;,
                &quot;our&quot;, or &quot;us&quot;).
              </p>
            </section>

            {/* Service Description */}
            <section
              id="service-description"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                2. Service Description
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                PrepFlow is a web-based Software-as-a-Service (SaaS) platform that provides
                comprehensive restaurant profitability optimization tools, including:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">Ingredients management and inventory tracking</li>
                <li className="text-fluid-base">Recipe creation and cost calculation</li>
                <li className="text-fluid-base">
                  COGS (Cost of Goods Sold) calculator with advanced pricing strategies
                </li>
                <li className="text-fluid-base">
                  Menu profitability analysis and performance insights
                </li>
                <li className="text-fluid-base">Temperature monitoring and compliance logging</li>
                <li className="text-fluid-base">Cleaning task management and scheduling</li>
                <li className="text-fluid-base">Compliance record keeping and audit trails</li>
                <li className="text-fluid-base">Supplier management and price tracking</li>
                <li className="text-fluid-base">Menu builder and dish management</li>
                <li className="text-fluid-base">Order lists and prep list generation</li>
                <li className="text-fluid-base">AI-powered specials suggestions</li>
                <li className="text-fluid-base">Recipe sharing and collaboration features</li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-300">
                The Service is designed to assist restaurant owners, managers, and chefs in making
                informed business decisions. However, we do not guarantee specific financial
                outcomes. Feature availability may vary based on your subscription tier.
              </p>
            </section>

            {/* User Accounts */}
            <section
              id="user-accounts"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                3. User Accounts and Registration
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                To access PrepFlow, you must create an account using our authentication provider
                (Auth0). You agree to:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">
                  Provide accurate, current, and complete information during registration
                </li>
                <li className="text-fluid-base">
                  Verify your email address as required by our authentication system
                </li>
                <li className="text-fluid-base">
                  Maintain and update your information as necessary
                </li>
                <li className="text-fluid-base">
                  Maintain the security of your account credentials and authentication tokens
                </li>
                <li className="text-fluid-base">
                  Accept responsibility for all activities under your account
                </li>
                <li className="text-fluid-base">
                  Notify us immediately of any unauthorized use or security breach
                </li>
                <li className="text-fluid-base">
                  Not share your account credentials with third parties
                </li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-300">
                By creating an account, you acknowledge that your account information is managed
                through Auth0 and subject to their{' '}
                <a
                  href="https://auth0.com/legal/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#29E7CD] hover:underline"
                >
                  terms of service
                </a>{' '}
                and{' '}
                <a
                  href="https://auth0.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#29E7CD] hover:underline"
                >
                  privacy policy
                </a>
                .
              </p>
              <p className="mt-4 leading-relaxed text-gray-300">
                <strong>Data Collection and Consent:</strong> We collect and process your data as
                described in our Privacy Policy. By using PrepFlow, you consent to our data
                collection practices. We will honor your privacy preferences and any opt-out
                requests. We do not sell your personal data to third parties. For more information
                about how we collect, use, and protect your data, please review our{' '}
                <Link href="/privacy-policy" className="text-[#29E7CD] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* Payment Terms */}
            <section
              id="payment-terms"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                4. Payment and Subscription Terms
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Subscription Model:</strong> PrepFlow is offered as a monthly subscription
                service. All prices are in AUD unless otherwise stated and are subject to change
                without notice. We will notify you of any price changes at least 30 days in advance.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Subscription Tiers:</strong> PrepFlow offers three subscription tiers:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">
                  <strong>Starter:</strong> $69 AUD per month - Includes core features with
                  limitations on recipes and ingredients
                </li>
                <li className="text-fluid-base">
                  <strong>Pro:</strong> $129 AUD per month - Includes all Starter features plus
                  unlimited recipes and ingredients, advanced analytics, and export capabilities
                </li>
                <li className="text-fluid-base">
                  <strong>Business:</strong> $199 AUD per month - Includes all Pro features plus
                  multi-user collaboration and API access
                </li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Payment Processing:</strong> Payments are processed securely through Stripe,
                our payment processor. By subscribing to PrepFlow, you agree to{' '}
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
                <strong>Automatic Renewal:</strong> Your subscription will automatically renew each
                month unless you cancel before the end of your current billing period. You will be
                charged the then-current monthly subscription fee on each renewal date.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Subscription Cancellation:</strong> You may cancel your subscription at any
                time through your account settings or by contacting us. Your subscription will
                remain active until the end of your current billing period, after which your access
                will be terminated. Cancellation does not entitle you to a refund for any unused
                portion of your current billing period.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>EU Data Act Compliance:</strong> For customers located in the European
                Union, the EU Data Act (effective September 12, 2025) provides additional rights. EU
                customers may cancel their cloud subscription at any time, regardless of contract
                length, without penalty. This right is in addition to the cancellation rights
                described above.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Failed Payments:</strong> If a payment fails, we will attempt to process the
                payment again. If payment continues to fail, we may suspend or terminate your
                subscription and access to the Service.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>No Refunds:</strong> All subscription fees are non-refundable. We do not
                provide refunds or credits for partial months of service, unused subscription
                periods, or if you cancel your subscription before the end of your billing period.
              </p>
              <p className="text-fluid-base leading-relaxed text-gray-300">
                <strong>Price Changes:</strong> We reserve the right to modify subscription prices
                at any time. Price changes will not affect your current billing period but will
                apply to subsequent renewals. We will notify you of any price changes at least 30
                days in advance.
              </p>
            </section>

            {/* License and Usage */}
            <section
              id="license-usage"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                5. License and Usage Rights
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>License Grant:</strong> Subject to these Terms and your active subscription,
                we grant you a limited, non-exclusive, non-transferable, revocable license to access
                and use PrepFlow for your personal or business use during your subscription period.
                This license is conditional upon your continued compliance with these Terms and
                payment of all applicable subscription fees.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Feature Access:</strong> Your access to specific features and functionality
                is determined by your subscription tier. Features may be limited or unavailable
                based on your tier level. Upgrading or downgrading your subscription may change your
                feature access.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Accessibility:</strong> PrepFlow is committed to providing an accessible
                platform that complies with the Americans with Disabilities Act (ADA) and Web
                Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. We regularly audit
                our platform for accessibility and make improvements to ensure all users can access
                and use our Service. If you encounter accessibility barriers, please contact us at{' '}
                <a href="mailto:support@prepflow.org" className="text-[#29E7CD] hover:underline">
                  support@prepflow.org
                </a>
                .
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Permitted Uses:</strong> You may use PrepFlow to:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">
                  Manage your restaurant&apos;s ingredients and inventory
                </li>
                <li className="text-fluid-base">
                  Create and manage recipes with cost calculations
                </li>
                <li className="text-fluid-base">
                  Analyze your restaurant&apos;s menu profitability
                </li>
                <li className="text-fluid-base">Calculate COGS and gross profit margins</li>
                <li className="text-fluid-base">Optimize your menu and pricing strategies</li>
                <li className="text-fluid-base">Monitor temperature compliance and food safety</li>
                <li className="text-fluid-base">Track cleaning tasks and compliance records</li>
                <li className="text-fluid-base">Manage suppliers and generate order lists</li>
                <li className="text-fluid-base">Generate prep lists and business reports</li>
                <li className="text-fluid-base">Use AI-powered features available in your tier</li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-300">
                <strong>Restrictions:</strong> You may not:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">
                  Share your account credentials or subscription access with third parties
                </li>
                <li className="text-fluid-base">
                  Resell, redistribute, or sublicense access to PrepFlow
                </li>
                <li className="text-fluid-base">
                  Reverse engineer, decompile, or disassemble the software
                </li>
                <li className="text-fluid-base">
                  Use PrepFlow for illegal or unauthorized purposes
                </li>
                <li className="text-fluid-base">
                  Attempt to gain unauthorized access to our systems or other users&apos; data
                </li>
                <li className="text-fluid-base">
                  Circumvent or attempt to circumvent subscription tier limitations
                </li>
                <li className="text-fluid-base">
                  Use automated systems or bots to access the Service without authorization
                </li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section
              id="intellectual-property"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                6. Intellectual Property Rights
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Our Rights:</strong> PrepFlow and all related content, features, and
                functionality are owned by us and are protected by copyright, trademark, and other
                intellectual property laws.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Your Content:</strong> You retain ownership of any data, content, or
                information you input into PrepFlow. By using the Service, you grant us a limited
                license to use this data to provide and improve our services.
              </p>
              <p className="text-fluid-base leading-relaxed text-gray-300">
                <strong>Feedback:</strong> If you provide feedback, suggestions, or ideas about
                PrepFlow, you agree that we may use them without compensation or obligation to you.
              </p>
            </section>

            {/* User Conduct */}
            <section
              id="user-conduct"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                7. User Conduct and Responsibilities
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                You agree to use PrepFlow responsibly and in accordance with these Terms. You are
                responsible for:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">Ensuring the accuracy of data you input</li>
                <li className="text-fluid-base">
                  Making informed business decisions based on PrepFlow insights
                </li>
                <li className="text-fluid-base">Complying with applicable laws and regulations</li>
                <li className="text-fluid-base">Maintaining the security of your account</li>
                <li className="text-fluid-base">Not interfering with the Service or other users</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section
              id="disclaimers"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                8. Disclaimers and Limitations
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Service Availability:</strong> We strive to provide reliable service but
                cannot guarantee uninterrupted access. The Service may be temporarily unavailable
                due to maintenance, updates, or technical issues.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Data Accuracy:</strong> While PrepFlow provides tools for analysis, the
                accuracy of results depends on the data you input. We are not responsible for
                decisions made based on PrepFlow insights.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Business Outcomes:</strong> PrepFlow is a tool to assist decision-making,
                but we do not guarantee specific financial results, increased profits, or business
                success.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Third-Party Services:</strong> PrepFlow integrates with third-party services
                including{' '}
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
                (database hosting). We are not responsible for their availability, functionality, or
                terms of service. Your use of these third-party services is subject to their
                respective{' '}
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
                , our database hosting provider. While we implement industry-standard security
                measures, we cannot guarantee absolute security of data transmitted over the
                internet or stored in cloud databases. Your use of Supabase is subject to their{' '}
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
              <p className="text-fluid-base mb-4 leading-relaxed text-gray-300">
                <strong>Data Security and Breach Notification:</strong> We implement
                industry-standard security measures including encryption in transit and at rest,
                secure authentication, and regular security audits. In the event of a data breach
                that may affect your personal information, we will notify affected users within 72
                hours of becoming aware of the breach, in accordance with applicable data protection
                laws. We will also notify relevant authorities as required by law.
              </p>
              <p className="text-fluid-base mb-4 leading-relaxed text-gray-300">
                <strong>Data Ownership and Export:</strong> You retain ownership of all data you
                upload or create within PrepFlow. You may export your data at any time using the
                export features available in your account settings. Upon termination of your
                subscription, you will have 30 days to export your data before it is permanently
                deleted. We do not claim ownership of your data and will not use your data for
                purposes other than providing the Service, except as described in our Privacy
                Policy.
              </p>
              <p className="text-fluid-base leading-relaxed text-gray-300">
                <strong>Cross-Border Data Transfers:</strong> Your data may be processed and stored
                in countries outside your jurisdiction, including Australia and the United States.
                We ensure that all data transfers comply with applicable data protection laws. We do
                not transfer sensitive personal data to restricted countries (including China,
                Russia, or Iran) without explicit consent and appropriate safeguards. By using
                PrepFlow, you consent to the transfer of your data to countries where our service
                providers operate.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section
              id="limitation-liability"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                9. Limitation of Liability
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                To the maximum extent permitted by law, PrepFlow shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, including but not
                limited to:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">
                  Loss of profits, revenue, or business opportunities
                </li>
                <li className="text-fluid-base">Data loss or corruption</li>
                <li className="text-fluid-base">Business interruption</li>
                <li className="text-fluid-base">Any damages resulting from your use of PrepFlow</li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-300">
                Our total liability to you for any claims arising from these Terms or your use of
                PrepFlow shall not exceed the amount you paid for the Service.
              </p>
            </section>

            {/* Indemnification */}
            <section
              id="indemnification"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                10. Indemnification
              </h2>
              <p className="text-fluid-base leading-relaxed text-gray-300">
                You agree to indemnify and hold harmless PrepFlow, its officers, directors,
                employees, and agents from any claims, damages, losses, or expenses (including
                reasonable attorneys&apos; fees) arising from your use of the Service or violation
                of these Terms.
              </p>
            </section>

            {/* Termination */}
            <section
              id="termination"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">11. Termination</h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Termination by You:</strong> You may cancel your subscription and stop using
                PrepFlow at any time through your account settings or by contacting us. Your access
                to the Service will continue until the end of your current billing period. After the
                billing period ends, your subscription will not renew and your access will be
                terminated.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Termination by Us:</strong> We may terminate or suspend your access to
                PrepFlow immediately if you violate these Terms, engage in fraudulent or illegal
                activities, fail to pay subscription fees, or if we discontinue the Service. We will
                provide reasonable notice when possible, except in cases of serious violations or
                illegal activity.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Effect of Termination:</strong> Upon termination of your subscription:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
                <li className="text-fluid-base">
                  Your right to access and use PrepFlow will cease at the end of your billing period
                </li>
                <li className="text-fluid-base">
                  You will lose access to all features and data stored in your account
                </li>
                <li className="text-fluid-base">
                  You may export your data before termination using available export features
                </li>
                <li className="text-fluid-base">
                  We may delete your account and associated data after a reasonable retention period
                </li>
                <li className="text-fluid-base">
                  You will not be entitled to any refund for unused subscription time
                </li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-300">
                <strong>Data Retention:</strong> After termination, we may retain your data for a
                period of up to 90 days for backup and recovery purposes. After this period, we will
                delete your data unless we are required to retain it for legal or regulatory
                purposes. You are responsible for exporting any data you wish to retain before
                termination.
              </p>
            </section>

            {/* Governing Law */}
            <section
              id="governing-law"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                12. Governing Law and Disputes
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Governing Law:</strong> These Terms are governed by and construed in
                accordance with the laws of the State of Queensland, Australia, without regard to
                its conflict of law provisions. Any disputes arising from these Terms or your use of
                PrepFlow shall be resolved through good faith negotiations.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Jurisdiction and Venue:</strong> If a dispute cannot be resolved amicably,
                it shall be subject to the exclusive jurisdiction of the courts of Queensland,
                Australia. You agree to submit to the personal jurisdiction of such courts and waive
                any objection to venue in such courts.
              </p>
              <p className="mb-4 leading-relaxed text-gray-300">
                <strong>Class Action Waiver:</strong> You agree that any disputes will be resolved
                individually and not as part of a class action. You waive your right to participate
                in a class action lawsuit or class-wide arbitration.
              </p>
              <p className="text-fluid-base leading-relaxed text-gray-300">
                <strong>EU Consumer Rights:</strong> If you are a consumer located in the European
                Union, you may have additional rights under EU consumer protection laws. Nothing in
                these Terms limits your rights as a consumer under mandatory EU law. If any
                provision of these Terms conflicts with mandatory EU consumer law, that provision
                will not apply to you.
              </p>
            </section>

            {/* Changes to Terms */}
            <section
              id="changes-terms"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                13. Changes to Terms
              </h2>
              <p className="text-fluid-base leading-relaxed text-gray-300">
                We reserve the right to modify these Terms at any time. We will notify you of any
                material changes by posting the updated Terms on our website and updating the
                &quot;Last updated&quot; date. Your continued use of PrepFlow after such changes
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section
              id="contact-information"
              className="desktop:p-8 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-6"
            >
              <h2 className="text-fluid-2xl mb-4 font-semibold text-[#29E7CD]">
                14. Contact Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
                <p className="mb-2 text-gray-300">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:hello@prepflow.org" className="text-[#29E7CD] hover:underline">
                    hello@prepflow.org
                  </a>
                </p>
                <p className="mb-2 text-gray-300">
                  <strong>Support:</strong>{' '}
                  <a href="mailto:hello@prepflow.org" className="text-[#29E7CD] hover:underline">
                    hello@prepflow.org
                  </a>
                </p>
                <p className="text-gray-300">
                  <strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-[#2a2a2a] pt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to PrepFlow</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
