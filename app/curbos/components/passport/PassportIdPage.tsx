'use client';

import { Globe } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface PassportIdPageProps {
  customer: {
    id: string;
    member_number?: number;
    full_name: string | null;
    current_rank: string;
    join_date?: string; // fallback if needed
  };
}

export default function PassportIdPage({ customer }: PassportIdPageProps) {
  const passportNumber = (customer.member_number || 0).toString().padStart(9, '0');
  const surname = customer.full_name ? customer.full_name.split(' ').pop()?.toUpperCase() : 'UNKNOWN';
  const givenNames = customer.full_name ? customer.full_name.split(' ').slice(0, -1).join(' ').toUpperCase() : 'UNKNOWN';

  // Fake "MRZ" (Machine Readable Zone) generator
  const mrzLine1 = `P<CUR${surname}<<${givenNames.replace(/ /g, '<')}<<<<<<<<<<<<<<<<<<<<<<`.substring(0, 44);
  const mrzLine2 = `${passportNumber}4CUR9401018M${customer.id.substring(0, 14).toUpperCase()}<<<<<<<00`.substring(0, 44);

  return (
    <div className="relative w-full aspect-[1.586/1] bg-[#fdfbf7] rounded-r-2xl shadow-2xl overflow-hidden text-black font-mono border-l-4 border-black/10">

      {/* Security Background Pattern (Guilloche-ish) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, #ccff00 1px, transparent 1px), radial-gradient(circle at 0% 0%, #1a1a1a 1px, transparent 1px)',
             backgroundSize: '20px 20px, 30px 30px'
           }}>
      </div>

      {/* Holographic Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-50 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ccff00]/30 to-transparent rounded-bl-full z-10"></div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b-2 border-dashed border-[#ccff00] pb-2">
            <div className="flex items-center gap-2">
                <Globe className="text-black w-6 h-6" />
                <span className="font-bold tracking-widest text-xs">CURBOS REPUBLIC</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold">
                <div className="flex flex-col">
                    <span className="text-neutral-500">TYPE</span>
                    <span>P</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-neutral-500">CODE</span>
                    <span>CUR</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-neutral-500">PASSPORT NO</span>
                    <span>{passportNumber}</span>
                </div>
            </div>
        </div>

        <div className="flex flex-1 gap-6">
            {/* Photo Area */}
            <div className="w-1/3 flex flex-col gap-2">
                <div className="aspect-[3/4] bg-neutral-200 rounded-lg border-2 border-neutral-300 overflow-hidden relative grayscale contrast-125">
                     {/* Avatar / Initials */}
                     <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-6xl font-black text-neutral-300">
                        {customer.full_name ? customer.full_name[0].toUpperCase() : '?'}
                     </div>
                     {/* "Ghost" image overlay */}
                     <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-multiply"></div>
                </div>
                <div className="text-center">
                    <span className="text-[10px] text-[#ccff00] font-bold tracking-widest">SIGNATURE</span>
                    <div className="font-script text-xl -mt-1 opacity-70 transform -rotate-6">{customer.full_name}</div>
                </div>
            </div>

            {/* Data Fields */}
            <div className="flex-1 space-y-3">
                <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 font-bold">SURNAME</span>
                    <span className="font-bold text-lg leading-none">{surname}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 font-bold">GIVEN NAMES</span>
                    <span className="font-bold text-lg leading-none">{givenNames}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-500 font-bold">NATIONALITY</span>
                        <span className="font-bold">CURBOSIAN</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-500 font-bold">RANK</span>
                        <span className="font-bold text-[#ccff00] bg-black px-1 rounded-sm inline-block">{customer.current_rank}</span>
                    </div>
                </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 font-bold">DATE OF ISSUE</span>
                    <span className="font-bold">{new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase()}</span>
                </div>
            </div>

            {/* QR Code as "Chip" */}
            <div className="absolute right-6 top-20 opacity-90">
                <div className="p-1 bg-white border border-neutral-200">
                     <QRCodeCanvas value={`https://prepflow.org/curbos/quests/${customer.id}`} size={64} />
                </div>
            </div>
        </div>

        {/* Machine Readable Zone (MRZ) */}
        <div className="mt-auto pt-4 font-mono text-sm leading-tight tracking-[0.1em] text-black/80 break-all w-full overflow-hidden whitespace-nowrap">
            <div>{mrzLine1}</div>
            <div>{mrzLine2}</div>
        </div>

      </div>
    </div>
  );
}
