'use client';

import { AISpecialCard } from './AISpecialCard';
import { EmptyState } from './EmptyState';

export interface AISpecial {
  id: string;
  image_data: string;
  prompt?: string;
  ai_response: {
    ingredients?: string[];
    suggestions?: string[];
    confidence?: number;
  } | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

interface SpecialsGridProps {
  specials: AISpecial[];
}

export function SpecialsGrid({ specials }: SpecialsGridProps) {
  return (
    <div className="space-y-4">
      {specials.length === 0 ? (
        <EmptyState onUploadClick={() => {}} />
      ) : (
        specials.map(special => <AISpecialCard key={special.id} special={special} />)
      )}
    </div>
  );
}
