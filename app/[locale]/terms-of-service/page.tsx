import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | PrepFlow - Usage Terms and Conditions',
  description: 'Read PrepFlow\'s terms of service to understand your rights and obligations when using our restaurant profitability optimization tool.',
  keywords: ['terms of service', 'terms and conditions', 'PrepFlow terms', 'user agreement', 'legal terms'],
};

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300">
            Terms and conditions for using PrepFlow
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
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using PrepFlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                These Terms of Service ("Terms") govern your use of PrepFlow, a restaurant profitability optimization tool provided by PrepFlow ("we", "our", or "us").
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                2. Service Description
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                PrepFlow is a digital tool that provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Google Sheets templates for restaurant COGS analysis</li>
                <li>Menu profitability optimization tools</li>
                <li>Recipe costing and margin calculations</li>
                <li>Business intelligence and reporting features</li>
                <li>Educational resources and support materials</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                The Service is designed to assist restaurant owners, managers, and chefs in making informed business decisions. However, we do not guarantee specific financial outcomes.
              </p>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                3. User Accounts and Registration
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To access certain features of PrepFlow, you may need to create an account or provide contact information. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as necessary</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                4. Payment and Subscription Terms
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Pricing:</strong> PrepFlow is offered as a one-time purchase at the price displayed at the time of purchase. All prices are in AUD unless otherwise stated and are subject to change without notice.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Payment Processing:</strong> Payments are processed securely through Gumroad, our trusted payment processor. By making a purchase, you agree to Gumroad's terms of service.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Refund Policy:</strong> We offer a 7-day money-back guarantee. If you're not satisfied with PrepFlow, you may request a full refund within 7 days of purchase by contacting us. After 7 days, all sales are final.
              </p>
            </section>

            {/* License and Usage */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                5. License and Usage Rights
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>License Grant:</strong> Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to use PrepFlow for your personal or business use.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Permitted Uses:</strong> You may use PrepFlow to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Analyze your restaurant's menu profitability</li>
                <li>Calculate COGS and gross profit margins</li>
                <li>Optimize your menu and pricing strategies</li>
                <li>Train staff on cost management principles</li>
                <li>Generate reports for business planning</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                <strong>Restrictions:</strong> You may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Resell, redistribute, or share PrepFlow with third parties</li>
                <li>Reverse engineer, decompile, or disassemble the software</li>
                <li>Use PrepFlow for illegal or unauthorized purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                6. Intellectual Property Rights
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Our Rights:</strong> PrepFlow and all related content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Your Content:</strong> You retain ownership of any data, content, or information you input into PrepFlow. By using the Service, you grant us a limited license to use this data to provide and improve our services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>Feedback:</strong> If you provide feedback, suggestions, or ideas about PrepFlow, you agree that we may use them without compensation or obligation to you.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                7. User Conduct and Responsibilities
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to use PrepFlow responsibly and in accordance with these Terms. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Ensuring the accuracy of data you input</li>
                <li>Making informed business decisions based on PrepFlow insights</li>
                <li>Complying with applicable laws and regulations</li>
                <li>Maintaining the security of your account</li>
                <li>Not interfering with the Service or other users</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                8. Disclaimers and Limitations
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Service Availability:</strong> We strive to provide reliable service but cannot guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Data Accuracy:</strong> While PrepFlow provides tools for analysis, the accuracy of results depends on the data you input. We are not responsible for decisions made based on PrepFlow insights.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Business Outcomes:</strong> PrepFlow is a tool to assist decision-making, but we do not guarantee specific financial results, increased profits, or business success.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>Third-Party Services:</strong> PrepFlow may integrate with third-party services (e.g., Google Sheets). We are not responsible for their availability, functionality, or terms of service.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To the maximum extent permitted by law, PrepFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Data loss or corruption</li>
                <li>Business interruption</li>
                <li>Any damages resulting from your use of PrepFlow</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Our total liability to you for any claims arising from these Terms or your use of PrepFlow shall not exceed the amount you paid for the Service.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify and hold harmless PrepFlow, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                11. Termination
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Termination by You:</strong> You may stop using PrepFlow at any time. Your access to the Service will continue until the end of your current billing period.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Termination by Us:</strong> We may terminate or suspend your access to PrepFlow immediately if you violate these Terms or engage in fraudulent or illegal activities.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>Effect of Termination:</strong> Upon termination, your right to use PrepFlow ceases immediately. You may retain any data you've exported, but we may delete your account and associated data.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                12. Governing Law and Disputes
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms are governed by and construed in accordance with the laws of Australia. Any disputes arising from these Terms or your use of PrepFlow shall be resolved through good faith negotiations.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If a dispute cannot be resolved amicably, it shall be subject to the exclusive jurisdiction of the courts of Australia.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of PrepFlow after such changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-[#29E7CD] mb-4">
                14. Contact Information
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-700">
                <p className="text-gray-300 mb-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:legal@prepflow.org" className="text-[#29E7CD] hover:underline">
                    legal@prepflow.org
                  </a>
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Support:</strong>{' '}
                  <a href="mailto:support@prepflow.org" className="text-[#29E7CD] hover:underline">
                    support@prepflow.org
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
