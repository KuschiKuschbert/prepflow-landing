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
    <div className="w-full h-full bg-[#fdfbf7] relative flex flex-col overflow-hidden">
       {/* Paper Texture Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
           }}>
      </div>

       <div className="p-5 flex flex-col h-full">
          <h3 className="text-neutral-900/80 font-bold text-center uppercase tracking-[0.3em] mb-2 border-b border-black/10 pb-2 text-[10px] shrink-0">Visas & Endorsements</h3>

          <div className="flex-1 grid grid-cols-3 grid-rows-4 gap-4 p-4 justify-items-center items-center">
             {/* Region Stamps */}
             {unlockedRegions.map((region) => (
                 <motion.div
                    key={region}
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-full h-full max-w-[100px] max-h-[100px] aspect-square border-4 border-double border-purple-800/60 rounded-full flex flex-col items-center justify-center p-1 transform mix-blend-multiply"
                    style={{ rotate: `${getRotation(region)}deg` }}
                 >
                    <MapPin className="text-purple-900/70 mb-1 w-[25%] h-[25%]" />
                    <span className="text-[6px] sm:text-[8px] font-black text-purple-900 uppercase text-center leading-none tracking-tighter">
                        PERMIT
                        <br/>
                        <span className="text-[7px] sm:text-[9px] text-purple-700">{region}</span>
                    </span>
                 </motion.div>
             ))}

             {/* Punch Card Stamps (Active) */}
             {Object.entries(stampCards).map(([category, count]) => (
                <div
                    key={category}
                    className="w-full h-full max-w-[100px] max-h-[100px] aspect-square border-2 border-dashed border-orange-600/60 rounded-lg flex flex-col items-center justify-center p-1 transform mix-blend-multiply bg-orange-50/50"
                    style={{ rotate: `${getRotation(category)}deg` }}
                 >
                    <Coffee className="text-orange-900/70 mb-1 w-[25%] h-[25%]" />
                    <span className="text-[6px] sm:text-[8px] font-bold text-orange-900 uppercase text-center leading-none">
                        {category}
                        <br/>
                        <span className="text-[8px] sm:text-[10px] font-black">{count}/10</span>
                    </span>
                 </div>
             ))}

             {/* Empty Placeholder Stamps */}
             {[...Array(Math.max(0, 12 - unlockedRegions.length - Object.keys(stampCards).length))].map((_, i) => (
                 <div key={`empty-${i}`} className="w-full h-full max-w-[100px] max-h-[100px] aspect-square border border-neutral-200 rounded-full opacity-30 flex items-center justify-center">
                    <span className="text-[6px] sm:text-[8px] font-mono text-neutral-300">VOID</span>
                 </div>
             ))}
          </div>

          <div className="text-center mt-auto pt-4 border-t border-black/5 shrink-0">
              <span className="font-mono text-[10px] text-black/40">PAGE 4</span>
          </div>
      </div>
    </div>
  );
}
