'use client';

import React, { useState, useEffect } from 'react';

interface SocialProofEvent {
  id: string;
  type: 'purchase' | 'signup' | 'demo_request';
  location: string;
  timeAgo: string;
  name?: string;
}

interface SocialProofNotifierProps {
  enabled?: boolean;
  interval?: number; // milliseconds between notifications
}

export default function SocialProofNotifier({ enabled = true, interval = 15000 }: SocialProofNotifierProps) {
  const [notifications, setNotifications] = useState<SocialProofEvent[]>([]);
  const [currentNotification, setCurrentNotification] = useState<SocialProofEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Sample social proof events (replace with real data from your analytics)
  const sampleEvents: SocialProofEvent[] = [
    {
      id: '1',
      type: 'purchase',
      location: 'Melbourne, AU',
      timeAgo: '2 minutes ago',
      name: 'Sarah M.'
    },
    {
      id: '2',
      type: 'signup',
      location: 'Sydney, AU',
      timeAgo: '4 minutes ago',
      name: 'Mike R.'
    },
    {
      id: '3',
      type: 'demo_request',
      location: 'Brisbane, AU',
      timeAgo: '6 minutes ago',
      name: 'Lisa K.'
    },
    {
      id: '4',
      type: 'purchase',
      location: 'Perth, AU',
      timeAgo: '8 minutes ago',
      name: 'David L.'
    },
    {
      id: '5',
      type: 'signup',
      location: 'Adelaide, AU',
      timeAgo: '10 minutes ago',
      name: 'Emma T.'
    }
  ];

  useEffect(() => {
    if (!enabled) return;

    // Initialize with first notification
    if (sampleEvents.length > 0) {
      setCurrentNotification(sampleEvents[0]);
      setIsVisible(true);
    }

    // Show notifications at intervals
    const timer = setInterval(() => {
      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setCurrentNotification(randomEvent);
      setIsVisible(true);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, interval]);

  if (!enabled || !currentNotification) return null;

  const getNotificationContent = (event: SocialProofEvent) => {
    switch (event.type) {
      case 'purchase':
        return {
          icon: '🎉',
          message: `${event.name} from ${event.location} just purchased PrepFlow!`,
          color: 'bg-green-500'
        };
      case 'signup':
        return {
          icon: '📧',
          message: `${event.name} from ${event.location} requested the demo!`,
          color: 'bg-blue-500'
        };
      case 'demo_request':
        return {
          icon: '🎬',
          message: `${event.name} from ${event.location} is watching the demo!`,
          color: 'bg-purple-500'
        };
      default:
        return {
          icon: '👋',
          message: `Someone from ${event.location} is exploring PrepFlow!`,
          color: 'bg-gray-500'
        };
    }
  };

  const content = getNotificationContent(currentNotification);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-40 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-xl p-4 shadow-2xl max-w-sm">
            <div className="flex items-start gap-3">
              <div className={`${content.color} text-white text-lg p-2 rounded-lg flex-shrink-0`}>
                {content.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium leading-relaxed">
                  {content.message}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {currentNotification.timeAgo}
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
