'use client';

import { motion } from 'framer-motion';
import { Coffee, MapPin } from 'lucide-react';

interface PassportStampsPageProps {
  unlockedRegions: string[];
  stampCards: Record<string, number>;
}

export default function PassportStampsPage({ unlockedRegions, stampCards }: PassportStampsPageProps) {

  // Helper to generate consistent random rotation based on string
  const getRotation = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (hash % 30) - 15; // -15 to +15 degrees
  };

  return (
    <div className="w-full aspect-[1.586/1] bg-[#fdfbf7] rounded-l-2xl shadow-2xl overflow-hidden relative border-r-4 border-black/10">
       {/* Paper Texture Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
           }}>
      </div>

      <div className="p-5 h-full flex flex-col">
          <h3 className="text-neutral-900/80 font-bold text-center uppercase tracking-[0.3em] mb-6 border-b border-black/10 pb-2">Visas & Endorsements</h3>

          <div className="flex-1 grid grid-cols-3 gap-4 content-start">
             {/* Region Stamps */}
             {unlockedRegions.map((region) => (
                 <motion.div
                    key={region}
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="aspect-square border-4 border-double border-purple-800/60 rounded-full flex flex-col items-center justify-center p-2 transform mix-blend-multiply"
                    style={{ rotate: `${getRotation(region)}deg` }}
                 >
                    <MapPin className="text-purple-900/70 mb-1 w-6 h-6" />
                    <span className="text-[8px] font-black text-purple-900 uppercase text-center leading-none tracking-tighter">
                        ENTRY PERMITTED
                        <br/>
                        <span className="text-xs text-purple-700">{region}</span>
                    </span>
                 </motion.div>
             ))}

             {/* Punch Card Stamps (Active) */}
             {Object.entries(stampCards).map(([category, count]) => (
                <div
                    key={category}
                    className="aspect-square border-2 border-dashed border-orange-600/60 rounded-lg flex flex-col items-center justify-center p-2 transform mix-blend-multiply bg-orange-50/50"
                    style={{ rotate: `${getRotation(category)}deg` }}
                 >
                    <Coffee className="text-orange-900/70 mb-1 w-5 h-5" />
                    <span className="text-[8px] font-bold text-orange-900 uppercase text-center leading-none">
                        {category}
                        <br/>
                        <span className="text-lg font-black">{count}/10</span>
                    </span>
                 </div>
             ))}

             {/* Empty Placeholder Stamps */}
             {[...Array(Math.max(0, 6 - unlockedRegions.length - Object.keys(stampCards).length))].map((_, i) => (
                 <div key={`empty-${i}`} className="aspect-square border border-neutral-200 rounded-full opacity-30 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-neutral-300">VOID</span>
                 </div>
             ))}
          </div>

          <div className="text-center mt-auto pt-4">
              <span className="font-mono text-[10px] text-black/40">PAGE 4</span>
          </div>
      </div>
    </div>
  );
}
