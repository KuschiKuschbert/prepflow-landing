import Link from 'next/link';
import TermsBackground from './TermsBackground';
import TermsMobileTOC from './TermsMobileTOC';
import TermsScrollProgress from './TermsScrollProgress';
import TermsTableOfContents from './TermsTableOfContents';
import { TermsSection } from './components/TermsSection';
import { ServiceDescription } from './sections/ServiceDescription';
import { UserAccounts } from './sections/UserAccounts';
import { PaymentTerms } from './sections/PaymentTerms';
import { LicenseUsage } from './sections/LicenseUsage';
import { IntellectualProperty } from './sections/IntellectualProperty';
import { UserConduct } from './sections/UserConduct';
import { Disclaimers } from './sections/Disclaimers';
import { LimitationOfLiability } from './sections/LimitationOfLiability';
import { Indemnification } from './sections/Indemnification';
import { Termination } from './sections/Termination';
import { GoverningLaw } from './sections/GoverningLaw';
import { ChangesToTerms } from './sections/ChangesToTerms';
import { ContactInformation } from './sections/ContactInformation';

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
                be bound by the terms and provision of this agreement. If you don&apos;t agree to
                abide by the above, please don&apos;t use this service.
              </p>
              <p className="mt-4 leading-relaxed text-gray-300">
                These Terms of Service (&quot;Terms&quot;) govern your use of PrepFlow, a restaurant
                profitability optimization tool provided by PrepFlow (&quot;we&quot;,
                &quot;our&quot;, or &quot;us&quot;).
              </p>
            </section>

            <TermsSection id="service-description" title="2. Service Description">
              <ServiceDescription />
            </TermsSection>

            <TermsSection id="user-accounts" title="3. User Accounts and Registration">
              <UserAccounts />
            </TermsSection>

            <TermsSection id="payment-terms" title="4. Payment and Subscription Terms">
              <PaymentTerms />
            </TermsSection>

            <TermsSection id="license-usage" title="5. License and Usage Rights">
              <LicenseUsage />
            </TermsSection>

            <TermsSection id="intellectual-property" title="6. Intellectual Property Rights">
              <IntellectualProperty />
            </TermsSection>

            <TermsSection id="user-conduct" title="7. User Conduct and Responsibilities">
              <UserConduct />
            </TermsSection>

            <TermsSection id="disclaimers" title="8. Disclaimers and Limitations">
              <Disclaimers />
            </TermsSection>

            <TermsSection id="limitation-liability" title="9. Limitation of Liability">
              <LimitationOfLiability />
            </TermsSection>

            <TermsSection id="indemnification" title="10. Indemnification">
              <Indemnification />
            </TermsSection>

            <TermsSection id="termination" title="11. Termination">
              <Termination />
            </TermsSection>

            <TermsSection id="governing-law" title="12. Governing Law and Disputes">
              <GoverningLaw />
            </TermsSection>

            <TermsSection id="changes-terms" title="13. Changes to Terms">
              <ChangesToTerms />
            </TermsSection>

            <TermsSection id="contact-information" title="14. Contact Information">
              <ContactInformation />
            </TermsSection>
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
