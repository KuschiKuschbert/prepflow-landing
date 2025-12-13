'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { logger } from '@/lib/logger';

interface SubscriptionStatusBannerProps {
  className?: string;
}

/**
 * Global subscription status banner component.
 * Shows at top of webapp when subscription status is not active.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element | null} Rendered banner or null if not needed
 */
export function SubscriptionStatusBanner({ className = '' }: SubscriptionStatusBannerProps) {
  const { user } = useUser();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          const status = data.subscription?.status || 'trial';
          setSubscriptionStatus(status);

          // Check if banner was dismissed for this status
          const dismissKey = `subscription-banner-dismissed-${status}`;
          const wasDismissed = localStorage.getItem(dismissKey) === 'true';
          setDismissed(wasDismissed);
        }
      } catch (error) {
        logger.error('[SubscriptionStatusBanner] Failed to fetch subscription status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user?.email]);

  const handleDismiss = () => {
    if (subscriptionStatus) {
      const dismissKey = `subscription-banner-dismissed-${subscriptionStatus}`;
      localStorage.setItem(dismissKey, 'true');
      setDismissed(true);
    }
  };

  const handleClick = () => {
    router.push('/webapp/settings/billing');
  };

  if (loading || !subscriptionStatus || subscriptionStatus === 'active' || dismissed) {
    return null;
  }

  const isPastDue = subscriptionStatus === 'past_due';
  const isCancelled = subscriptionStatus === 'cancelled';
  const isTrial = subscriptionStatus === 'trial';

  const bannerStyles = isPastDue
    ? 'border-yellow-500/30 bg-yellow-500/10'
    : isCancelled
      ? 'border-red-500/30 bg-red-500/10'
      : 'border-blue-500/30 bg-blue-500/10';

  const iconColor = isPastDue ? 'text-yellow-400' : isCancelled ? 'text-red-400' : 'text-blue-400';

  const icon = isPastDue || isCancelled ? AlertTriangle : Info;

  const messages = {
    past_due: {
      title: 'Payment Failed',
      description:
        'Your payment failed. Please update your payment method to continue using PrepFlow.',
    },
    cancelled: {
      title: 'Subscription Cancelled',
      description:
        'Your subscription has been cancelled. Reactivate it to continue using PrepFlow.',
    },
    trial: {
      title: 'Trial Period',
      description:
        "You're currently on a trial period. Upgrade to continue using PrepFlow after your trial ends.",
    },
  };

  const message = messages[subscriptionStatus as keyof typeof messages] || messages.trial;

  return (
    <div
      className={`relative mx-auto mb-4 max-w-7xl rounded-2xl border p-4 transition-all ${bannerStyles} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${message.title}. Click to manage subscription.`}
    >
      <div className="flex items-center gap-3">
        <Icon icon={icon} size="md" className={iconColor} aria-hidden={true} />
        <div className="flex-1">
          <p className="font-semibold text-white">{message.title}</p>
          <p className="text-sm text-gray-300">{message.description}</p>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-black/20 hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          aria-label="Dismiss banner"
        >
          <Icon icon={X} size="sm" />
        </button>
      </div>
    </div>
  );
}
