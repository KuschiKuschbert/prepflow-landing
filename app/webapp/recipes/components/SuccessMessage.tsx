interface SuccessMessageProps {
  message: string | null;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-center rounded border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 text-green-700">
      <div className="flex items-center">
        <svg
          className="mr-2 h-5 w-5 text-[var(--color-success)]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
