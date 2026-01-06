'use client';

import { ExternalLink, Flame, MapPin, QrCode, Trophy, X } from 'lucide-react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';

interface Customer {
  id: string;
  full_name: string | null;
  phone_number: string;
  email: string | null;
  current_rank: string;
  lifetime_miles: number;
  redeemable_miles: number;
  streak_count: number;
  last_visit: number;
  zip_code: string | null;
}

export default function CustomerCard({ customer }: { customer: Customer }) {
  const [showQr, setShowQr] = useState(false);
  const passportUrl = `${window.location.origin}/curbos/quests/${customer.id}`;

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 border border-zinc-800 hover:border-[#ccff00]/50 transition-colors relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            {customer.full_name || 'Unknown Member'}
          </h3>
          <div className="text-sm text-zinc-400 font-mono">
            {customer.phone_number}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#ccff00]">
            {Math.floor(customer.redeemable_miles)}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest">Miles</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/50 p-3 rounded-lg flex items-center space-x-3">
          <Trophy className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-xs text-zinc-500 uppercase">Rank</div>
            <div className="font-bold text-purple-100 text-sm">{customer.current_rank}</div>
          </div>
        </div>
        <div className="bg-black/50 p-3 rounded-lg flex items-center space-x-3">
          <Flame className="w-5 h-5 text-orange-400" />
          <div>
            <div className="text-xs text-zinc-500 uppercase">Streak</div>
            <div className="font-bold text-orange-100 text-sm">{customer.streak_count} Wks</div>
          </div>
        </div>
      </div>

      {customer.zip_code && (
        <div className="flex items-center text-zinc-500 text-sm mt-4 pt-4 border-t border-zinc-800">
          <MapPin className="w-4 h-4 mr-2" />
          ZIP: {customer.zip_code}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-zinc-800">
        <Link
          href={`/curbos/quests/${customer.id}`}
          target="_blank"
          className="flex-1 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] py-2 px-3 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Passport
        </Link>
        <button
          onClick={() => setShowQr(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-colors"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>

      {/* QR Modal / Overlay */}
      {showQr && (
        <div className="absolute inset-0 z-10 bg-black/90 rounded-xl flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => setShowQr(false)}
            className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-white p-4 rounded-xl shadow-2xl shadow-[#ccff00]/20">
            <QRCodeCanvas
                value={passportUrl}
                size={160}
                bgColor={"#FFFFFF"}
                fgColor={"#000000"}
                level={"H"}
            />
          </div>
          <p className="mt-4 text-[#ccff00] font-bold text-sm tracking-widest uppercase">Scan Passport</p>
        </div>
      )}
    </div>
  );
}
