'use client';
import React from 'react';
import ErrorBoundary from './ui/ErrorBoundary';
import { useExitIntentHandlers } from './ExitIntentPopup/helpers/useExitIntentHandlers';

interface ExitIntentPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (data: { name: string; email: string }) => void;
}

function ExitIntentPopupContent({ isVisible, onClose, onSuccess }: ExitIntentPopupProps) {
  const { formData, isSubmitting, errors, isSuccess, popupRef, handleSubmit, handleInputChange } =
    useExitIntentHandlers({ isVisible, onClose, onSuccess });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="animate-in slide-in-from-bottom-4 relative w-full max-w-md rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl duration-300">
        <div ref={popupRef} className="desktop:p-8 rounded-3xl bg-[var(--surface)]/95 p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            aria-label="Close popup"
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

          {isSuccess ? (
            <div className="text-center">
              <div className="text-fluid-4xl mb-4">🎉</div>
              <h3 className="text-fluid-2xl mb-2 font-bold text-[var(--primary)]">Don&apos;t go yet!</h3>
              <p className="mb-4 text-[var(--foreground-secondary)]">
                We&apos;ve sent the sample dashboard to your email.
              </p>
              <p className="text-fluid-sm text-[var(--foreground-subtle)]">
                Check your inbox in the next few minutes.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="text-fluid-4xl mb-3">🚨</div>
                <h3 className="text-fluid-2xl mb-2 font-bold text-[var(--foreground)]">Wait! Before you go...</h3>
                <p className="text-[var(--foreground-secondary)]">
                  Get your free sample dashboard and see exactly how PrepFlow can transform your
                  menu profitability.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="popup-name"
                    className="text-fluid-sm mb-2 block font-medium text-[var(--foreground-secondary)]"
                  >
                    Your name *
                  </label>
                  <input
                    id="popup-name"
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                    className={`w-full rounded-xl border bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] placeholder-gray-400 transition-colors focus:outline-none ${
                      errors.name
                        ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
                        : 'border-[var(--border)] focus:border-[var(--primary)]'
                    }`}
                    aria-describedby={errors.name ? 'popup-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="popup-name-error" className="text-fluid-sm mt-1 text-[var(--color-error)]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="popup-email"
                    className="text-fluid-sm mb-2 block font-medium text-[var(--foreground-secondary)]"
                  >
                    Your email *
                  </label>
                  <input
                    id="popup-email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full rounded-xl border bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] placeholder-gray-400 transition-colors focus:outline-none ${
                      errors.email
                        ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
                        : 'border-[var(--border)] focus:border-[var(--primary)]'
                    }`}
                    aria-describedby={errors.email ? 'popup-email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="popup-email-error" className="text-fluid-sm mt-1 text-[var(--color-error)]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`text-fluid-base w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-6 py-3 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:shadow-xl hover:shadow-[var(--primary)]/25'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-[var(--foreground)]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send me the sample dashboard'
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-fluid-xs text-[var(--foreground-subtle)]">
                  No spam. No lock-in. Your data stays private.
                </p>
                <button
                  onClick={onClose}
                  className="text-fluid-sm mt-3 text-[var(--foreground-muted)] underline transition-colors hover:text-[var(--foreground)]"
                >
                  No thanks, I&apos;ll continue browsing
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExitIntentPopup(props: ExitIntentPopupProps) {
  return (
    <ErrorBoundary>
      <ExitIntentPopupContent {...props} />
    </ErrorBoundary>
  );
}
