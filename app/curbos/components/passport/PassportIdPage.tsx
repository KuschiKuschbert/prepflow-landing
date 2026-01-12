'use client';

import { logger } from '@/lib/logger';
import { Camera, Globe } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface PassportIdPageProps {
  customer: {
    id: string;
    member_number?: number;
    full_name: string | null;
    current_rank: string;
    join_date?: string;
    avatar_url?: string;
  };
}

export default function PassportIdPage({ customer }: PassportIdPageProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(customer.avatar_url);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passportNumber = (customer.member_number || 0).toString().padStart(9, '0');
  const surname = customer.full_name ? customer.full_name.split(' ').pop()?.toUpperCase() : 'UNKNOWN';
  const givenNames = customer.full_name ? customer.full_name.split(' ').slice(0, -1).join(' ').toUpperCase() : 'UNKNOWN';

  // Fake "MRZ" (Machine Readable Zone) generator
  const mrzLine1 = `P<CUR${surname}<<${givenNames.replace(/ /g, '<')}<<<<<<<<<<<<<<<<<<<<<<`.substring(0, 44);
  const mrzLine2 = `${passportNumber}4CUR9401018M${customer.id.substring(0, 14).toUpperCase()}<<<<<<<00`.substring(0, 44);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('customerId', customer.id);

    try {
        const response = await fetch('/api/customers/upload-photo', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();

        if (result.success) {
            setAvatarUrl(result.data.url);
            toast.success("Passport photo updated successfully!");
        } else {
            console.error(result);
            toast.error("Upload failed. Please try again.");
        }
    } catch (error) {
        logger.error("Upload error", error);
        toast.error("An error occurred during upload.");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#fdfbf7] text-black font-mono flex flex-col relative overflow-hidden">

      {/* Security Background Pattern (Guilloche-ish) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, #ccff00 1px, transparent 1px), radial-gradient(circle at 0% 0%, #1a1a1a 1px, transparent 1px)',
             backgroundSize: '20px 20px, 30px 30px'
           }}>
      </div>

      {/* Holographic Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-30 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ccff00]/30 to-transparent rounded-bl-full z-10"></div>

      {/* Content */}
      <div className="relative z-10 p-5 lg:p-7 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-dashed border-[#ccff00] pb-2 shrink-0">
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

        {/* Portrait Layout Content - Distributed Vertical Space */}
        <div className="flex flex-col flex-1 gap-6 min-h-0 relative justify-between py-2">

            {/* Top Section: Photo + Basic Data */}
            <div className="flex gap-6 items-stretch">
                 {/* Photo */}
                <div
                    className="w-40 flex flex-col gap-2 shrink-0 group cursor-pointer relative"
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to change photo"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                    />

                    <div className="aspect-[3/4] w-full bg-neutral-200 rounded-lg border-2 border-neutral-300 overflow-hidden relative grayscale contrast-125 shadow-inner transition-all group-hover:border-[#ccff00] group-hover:shadow-[0_0_15px_rgba(204,255,0,0.3)]">

                        {/* Current Photo or Initials */}
                        {avatarUrl && avatarUrl.length > 5 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={avatarUrl}
                                alt="Passport Photo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    setAvatarUrl(undefined);
                                }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-5xl font-black text-neutral-300">
                                {customer.full_name ? customer.full_name[0].toUpperCase() : '?'}
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUploading ? 'opacity-100' : ''}`}>
                            {isUploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#ccff00]"></div>
                            ) : (
                                <>
                                    <Camera className="w-8 h-8 mb-1 text-[#ccff00]" />
                                    <span className="text-[9px] font-bold tracking-widest uppercase">Update</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Primary Data */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-600 font-bold mb-0.5">SURNAME</span>
                        <span className="font-bold text-2xl leading-none truncate tracking-tight">{surname}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-600 font-bold mb-0.5">GIVEN NAMES</span>
                        <span className="font-bold text-xl leading-none truncate tracking-tight">{givenNames}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-600 font-bold mb-0.5">NATIONALITY</span>
                        <span className="font-bold text-lg">CURBOSIAN</span>
                    </div>
                </div>
            </div>

            {/* Secondary Data & Signature */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-600 font-bold mb-0.5">DATE OF BIRTH</span>
                    <span className="font-bold text-base">01 JAN 2000</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-600 font-bold mb-0.5">SEX</span>
                    <span className="font-bold text-base">X</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-600 font-bold mb-0.5">DATE OF ISSUE</span>
                    <span className="font-bold text-base">{new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase()}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-600 font-bold mb-0.5">DATE OF EXPIRY</span>
                    <span className="font-bold text-base">{new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase()}</span>
                </div>
            </div>

            <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-[#ccff00] font-bold tracking-widest block mb-2">SIGNATURE</span>
                    <div className="font-script text-2xl opacity-70 transform -rotate-6 px-1 truncate w-40 border-b border-black/10 pb-1">{customer.full_name}</div>
                </div>

                 {/* Optimized Large QR placement for Portrait */}
                <div className="p-1.5 bg-white border border-neutral-200 shadow-sm">
                     <QRCodeCanvas value={`https://prepflow.org/curbos/quests/${customer.id}`} size={96} />
                </div>
            </div>

        </div>

        {/* Machine Readable Zone (MRZ) */}
        <div className="mt-auto pt-2 font-mono text-sm leading-tight tracking-[0.1em] text-black/80 break-all w-full overflow-hidden whitespace-nowrap shrink-0 opacity-80">
            <div>{mrzLine1}</div>
            <div>{mrzLine2}</div>
        </div>

      </div>
    </div>
  );
}
