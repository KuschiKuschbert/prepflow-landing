'use client';

import React from 'react';
import { useGlobalWarning } from '@/contexts/GlobalWarningContext';

const TestWarningButton: React.FC = () => {
  const { addWarning } = useGlobalWarning();

  const testWarning = () => {
    addWarning({
      type: 'warning',
      title: 'Temperature Monitoring Alert',
      message:
        'No food items have been temperature checked today. Ensure all food items are properly monitored for safety compliance.',
      action: {
        label: 'Go to Temperature Logs',
        onClick: () => {
          window.location.href = '/webapp/temperature';
        },
      },
      dismissible: true,
      autoHide: false,
    });
  };

  return (
    <button
      onClick={testWarning}
      className="rounded-lg bg-yellow-500 px-4 py-2 text-black transition-colors hover:bg-yellow-400"
    >
      Test Global Warning
    </button>
  );
};

export default TestWarningButton;
