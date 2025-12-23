export function UserAccounts() {
  return (
    <>
      <p className="mb-4 leading-relaxed text-gray-300">
        To access PrepFlow, you must create an account using our authentication provider (Auth0). You agree to:
      </p>
      <ul className="ml-4 list-inside list-disc space-y-2 text-gray-300">
        <li className="text-fluid-base">Provide accurate, current, and complete information during registration</li>
        <li className="text-fluid-base">Verify your email address as required by our authentication system</li>
        <li className="text-fluid-base">Maintain and update your information as necessary</li>
        <li className="text-fluid-base">Maintain the security of your account credentials and authentication tokens</li>
        <li className="text-fluid-base">Notify us immediately of any unauthorized access or security breaches</li>
        <li className="text-fluid-base">Accept responsibility for all activities that occur under your account</li>
      </ul>
      <p className="mt-4 leading-relaxed text-gray-300">
        <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account
        credentials. We use Auth0 for authentication, which provides industry-standard security measures. However, you
        must not share your credentials with others or allow unauthorized access to your account.
      </p>
      <p className="mt-4 leading-relaxed text-gray-300">
        <strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these
        Terms or engage in fraudulent, abusive, or illegal activities.
      </p>
    </>
  );
}


