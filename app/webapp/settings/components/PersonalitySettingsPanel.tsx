// PrepFlow Personality System - Settings Panel Component

'use client';

import { usePersonality } from '@/lib/personality/store';
import { SPIRITS, type Spirit } from '@/lib/personality/schema';
import { dispatchToast, dispatchVisual } from '@/lib/personality/ui';
import { useNotification } from '@/contexts/NotificationContext';

export function PersonalitySettingsPanel() {
  const { settings, set, applyPreset, silenceFor24h } = usePersonality();
  const { showInfo } = useNotification();

  const handlePreview = (
    kind: 'mindful' | 'meta' | 'metrics' | 'chaos' | 'chefHabits' | 'moodShift',
  ) => {
    const msg = dispatchToast.pick(kind);
    if (msg) {
      showInfo(msg);
    }
  };

  const handlePreviewVisual = () => {
    dispatchVisual.random();
  };

  return (
    <div className="mt-8 space-y-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">PrepFlow Personality</h2>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={e => set({ enabled: e.target.checked })}
            className="h-5 w-5 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
          />
          <span className="text-sm text-gray-300">Enable Personality</span>
        </label>
      </div>

      <p className="text-sm text-gray-400">
        Add charming micro-moments, humor, and seasonal flair to your PrepFlow experience.
      </p>

      {/* Spirit Presets */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-300">Personality Spirit</h3>
        <div className="desktop:grid-cols-5 grid grid-cols-2 gap-2">
          {SPIRITS.map(spirit => (
            <button
              key={spirit}
              onClick={() => applyPreset(spirit)}
              className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                settings.spirit === spirit
                  ? 'border-[#29E7CD] bg-[#29E7CD]/10 text-[#29E7CD]'
                  : 'border-[#2a2a2a] bg-[#2a2a2a]/30 text-gray-300 hover:border-[#2a2a2a]/50'
              }`}
            >
              {spirit.charAt(0).toUpperCase() + spirit.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">Features</h3>
        <div className="desktop:grid-cols-2 grid gap-3">
          {[
            {
              key: 'moodShiftMessages',
              label: 'Mood Shift Messages',
              preview: 'moodShift' as const,
            },
            { key: 'chefHabits', label: 'Chef Habits', preview: 'chefHabits' as const },
            { key: 'chaosReports', label: 'Chaos Reports', preview: 'chaos' as const },
            { key: 'imaginaryMetrics', label: 'Imaginary Metrics', preview: 'metrics' as const },
            { key: 'mindfulMoments', label: 'Mindful Moments', preview: 'mindful' as const },
            { key: 'metaMoments', label: 'Meta Moments', preview: 'meta' as const },
            { key: 'seasonalLogoEvents', label: 'Seasonal Logo Events', preview: null },
            { key: 'visualDelights', label: 'Visual Delights', preview: null },
            { key: 'footerEasterEggs', label: 'Footer Easter Eggs', preview: null },
            { key: 'voiceReactions', label: 'Voice Reactions', preview: null },
          ].map(({ key, label, preview }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/20 p-3"
            >
              <div className="flex-1">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof typeof settings] as boolean}
                    onChange={e => set({ [key]: e.target.checked } as Partial<typeof settings>)}
                    disabled={!settings.enabled}
                    className="h-4 w-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-300">{label}</span>
                </label>
              </div>
              {preview && (
                <button
                  onClick={() => handlePreview(preview)}
                  disabled={!settings.enabled}
                  className="ml-2 rounded-lg border border-[#2a2a2a] px-2 py-1 text-xs text-gray-400 hover:bg-[#2a2a2a]/50 disabled:opacity-50"
                >
                  Preview
                </button>
              )}
              {key === 'visualDelights' && (
                <button
                  onClick={handlePreviewVisual}
                  disabled={!settings.enabled}
                  className="ml-2 rounded-lg border border-[#2a2a2a] px-2 py-1 text-xs text-gray-400 hover:bg-[#2a2a2a]/50 disabled:opacity-50"
                >
                  Preview
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 border-t border-[#2a2a2a] pt-4">
        <button
          onClick={() => {
            silenceFor24h();
            showInfo('Personality silenced for 24 hours');
          }}
          className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/50"
        >
          Silence for 24h
        </button>
        <button
          onClick={() => {
            set({ enabled: false });
            showInfo('Personality disabled');
          }}
          className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/50"
        >
          Disable All
        </button>
      </div>
    </div>
  );
}
