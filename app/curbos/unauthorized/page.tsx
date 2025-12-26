import Link from 'next/link';

/**
 * CurbOS unauthorized page component
 * Shown when user attempts to access CurbOS without Business tier subscription
 *
 * @component
 * @returns {JSX.Element} Unauthorized access page with upgrade prompt
 */
export default function CurbOSUnauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-3xl font-bold mb-4 text-white">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          CurbOS is available exclusively for Business tier subscribers.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Upgrade to Business tier to access the CurbOS admin console and unlock advanced features.
        </p>
        <Link
          href="/webapp/settings/billing"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#29E7CD] to-[#D925C7] rounded-2xl text-white font-semibold hover:shadow-lg transition-all"
        >
          Upgrade to Business
        </Link>
      </div>
    </div>
  );
}
