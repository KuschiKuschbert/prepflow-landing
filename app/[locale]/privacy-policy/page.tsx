import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | PrepFlow - How We Protect Your Data',
  description: 'Learn how PrepFlow protects your privacy and handles your data. Our comprehensive privacy policy ensures GDPR compliance and data security.',
  keywords: ['privacy policy', 'data protection', 'GDPR', 'PrepFlow privacy', 'data security'],
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to PrepFlow
          </Link>
          
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300">
            How we protect and handle your data
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-AU')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                PrepFlow ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our restaurant profitability optimization tool and related services.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                By using PrepFlow, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-medium text-white mb-3">2.1 Personal Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Name and email address (when you request a demo or sample)</li>
                <li>Business information (restaurant type, size, location)</li>
                <li>Payment information (processed securely through Gumroad)</li>
                <li>Communication preferences and feedback</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3 mt-6">2.2 Usage Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We automatically collect certain information about your use of PrepFlow:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Device information (browser type, operating system)</li>
                <li>Usage patterns and feature interactions</li>
                <li>Performance data and error logs</li>
                <li>IP address and general location (city/country level)</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide and maintain PrepFlow services</li>
                <li>Process your requests and deliver content</li>
                <li>Send important updates and service notifications</li>
                <li>Improve our products and user experience</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party services that help us operate PrepFlow (e.g., Gumroad for payments, email services)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure hosting infrastructure with industry-standard security</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure payment processing through Gumroad</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@prepflow.org" className="text-[#29E7CD] hover:underline">
                  privacy@prepflow.org
                </a>
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use PrepFlow</li>
                <li><strong>Marketing Cookies:</strong> Used for advertising and conversion tracking</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect functionality.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                8. Data Retention
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-300 leading-relaxed">
                PrepFlow is operated globally, and your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                PrepFlow is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of PrepFlow after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-700">
                <p className="text-gray-300 mb-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@prepflow.org" className="text-[#29E7CD] hover:underline">
                    privacy@prepflow.org
                  </a>
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Data Protection Officer:</strong> privacy@prepflow.org
                </p>
                <p className="text-gray-300">
                  <strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-700">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors"
          >
            <span>← Back to PrepFlow</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
