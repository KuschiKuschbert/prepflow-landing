interface SuccessMessageProps {
  message: string | null;
  onClose: () => void;
}

export function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div className="animate-in slide-in-from-top-2 mb-6 scale-105 transform rounded-2xl border-2 border-green-400 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 text-white shadow-2xl transition-all duration-300 duration-500 hover:scale-110">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-white">{message}</p>
          <p className="mt-1 text-sm font-medium text-green-100">
            🎉 Your recipe has been added to the Recipe Book and is ready to use!
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
