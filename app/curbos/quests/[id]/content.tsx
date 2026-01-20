'use client';

import TriangleGridBackground from '@/app/curbos/components/TriangleGridBackground';
import { Trophy } from 'lucide-react';
import { QuestBooklet } from './components/QuestBooklet';
import { QuestHeader } from './components/QuestHeader';
import { QuestShare } from './components/QuestShare';
import { QuestTravelLog } from './components/QuestTravelLog';
import { useQuestData } from './hooks/useQuestData';

interface QuestPageContentProps {
  id: string;
}

/**
 * Client-Side Quest Page Implementation.
 * Recursively fetches and displays customer stats.
 */
export default function QuestPageContent({ id }: QuestPageContentProps) {
  const { customer, recentOrders, loading } = useQuestData(id);

  if (loading) {
     return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ccff00]"></div>
        </div>
     );
  }

  if (!customer) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <Trophy size={48} className="text-neutral-600 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Passport Not Found</h1>
            <p className="text-neutral-400">We couldn't find a member with this ID.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-[#ccff00] selection:text-black relative pb-20">

      {/* Dynamic Background */}
      <TriangleGridBackground />

      {/* Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <QuestHeader />

      <div className="max-w-5xl mx-auto px-4 perspective-[2000px]">

        {/* The Booklet */}
        <QuestBooklet customer={customer} />

        {/* Travel Log (Recent Orders) */}
        <QuestTravelLog recentOrders={recentOrders} />

        {/* Share Footer */}
        <QuestShare />

      </div>
    </div>
  );
}
