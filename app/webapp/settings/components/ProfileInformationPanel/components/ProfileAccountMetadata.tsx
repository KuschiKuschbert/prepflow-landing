interface ProfileAccountMetadataProps {
  created_at: string | null;
  last_login: string | null;
  email_verified: boolean;
}

/**
 * Format date for display
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  try {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Profile account metadata component
 */
export function ProfileAccountMetadata({
  created_at,
  last_login,
  email_verified,
}: ProfileAccountMetadataProps) {
  return (
    <div className="border-t border-[#2a2a2a] pt-4">
      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
        <div>
          <p className="text-xs text-gray-500">Account Created</p>
          <p className="text-sm font-medium text-gray-300">{formatDate(created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Login</p>
          <p className="text-sm font-medium text-gray-300">{formatDate(last_login)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Email Verification</p>
          <p className="text-sm font-medium text-gray-300">
            {email_verified ? (
              <span className="text-green-400">Verified</span>
            ) : (
              <span className="text-yellow-400">Unverified</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
