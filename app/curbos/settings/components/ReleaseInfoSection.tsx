'use client';

import { ReleaseData } from '@/lib/github-release';
import { Download, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ReleaseInfoSectionProps {
  releaseData: ReleaseData | null;
}

export function ReleaseInfoSection({ releaseData }: ReleaseInfoSectionProps) {
  const downloadUrl = releaseData?.download_url;
  const tagName = releaseData?.tag_name || 'Latest';
  const publishedAt = releaseData?.published_at
    ? new Date(releaseData.published_at).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 tablet:p-8 border border-neutral-800 mt-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">Android POS App</h3>
        {releaseData ? (
          <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20 rounded">
            Stable Release
          </span>
        ) : (
          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest border border-yellow-500/20 rounded">
            Status Unknown
          </span>
        )}
      </div>
      <p className="text-gray-400 mb-6 text-sm tablet:text-base">
        Download the latest version of the CurbOS Android POS application. Requires Android 12.0+.
      </p>

      <div className="space-y-4">
        {downloadUrl ? (
          <div className="flex items-center gap-4">
            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={e => {
                if (!downloadUrl) {
                  e.preventDefault();
                  toast.error('Download URL not available. Please check GitHub releases.');
                }
              }}
            >
              <Download size={16} />
              Download APK
            </a>
            <div className="flex flex-col gap-1">
              <p className="text-[#C0FF02] font-black text-xs uppercase tracking-widest">
                {tagName}
              </p>
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tighter">
                Released: {publishedAt}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <Info size={20} />
            <p className="text-sm">
              Release information currently unavailable. Please check GitHub manually.
            </p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Note: You may need to enable "Install unknown apps" permission on your Android device.
      </p>
    </div>
  );
}
