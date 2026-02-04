import {
  AlertTriangle,
  Briefcase,
  Bug,
  Building2,
  CheckCircle,
  ClipboardCheck,
  Flame,
  Hospital,
  LucideIcon,
  Shield,
  UtensilsCrossed,
  Wine,
  XCircle,
} from 'lucide-react';

export function getTypeIcon(typeName: string): LucideIcon {
  const name = typeName.toLowerCase();
  if (name.includes('pest') || name.includes('exterminat')) return Bug;
  if (name.includes('fire') || name.includes('safety')) return Flame;
  if (name.includes('health') || name.includes('hygiene')) return Hospital;
  if (name.includes('council') || name.includes('license')) return Building2;
  if (name.includes('insurance')) return Shield;
  if (name.includes('tax') || name.includes('gst')) return Briefcase;
  if (name.includes('liquor') || name.includes('alcohol')) return Wine;
  if (name.includes('food') || name.includes('safety')) return UtensilsCrossed;
  return ClipboardCheck;
}

export function getTypeIconEmoji(typeName: string): string {
  // Keep for select options where React components can't be used
  const name = typeName.toLowerCase();
  if (name.includes('pest') || name.includes('exterminat')) return '🐛';
  if (name.includes('fire') || name.includes('safety')) return '🔥';
  if (name.includes('health') || name.includes('hygiene')) return '🏥';
  if (name.includes('council') || name.includes('license')) return '🏛️';
  if (name.includes('insurance')) return '🛡️';
  if (name.includes('tax') || name.includes('gst')) return '💼';
  if (name.includes('liquor') || name.includes('alcohol')) return '🍷';
  if (name.includes('food') || name.includes('safety')) return '🍽️';
  return '📋';
}

export function getStatusColor(status: 'active' | 'expired' | 'pending_renewal'): string {
  switch (status) {
    case 'active':
      return 'border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)]';
    case 'expired':
      return 'border-[var(--color-error)]/20 bg-[var(--color-error)]/10 text-[var(--color-error)]';
    case 'pending_renewal':
      return 'border-[var(--color-warning)]/20 bg-[var(--color-warning)]/10 text-[var(--color-warning)]';
    default:
      return 'border-gray-400/20 bg-gray-400/10 text-[var(--foreground-muted)]';
  }
}

export function getStatusIcon(status: 'active' | 'expired' | 'pending_renewal'): LucideIcon {
  switch (status) {
    case 'active':
      return CheckCircle;
    case 'expired':
      return XCircle;
    case 'pending_renewal':
      return AlertTriangle;
    default:
      return ClipboardCheck;
  }
}

export function getDaysUntilExpiry(expiryDate: string | null): number | null {
  if (!expiryDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
