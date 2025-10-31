export function getTypeIcon(typeName: string): string {
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
      return 'border-green-400/20 bg-green-400/10 text-green-400';
    case 'expired':
      return 'border-red-400/20 bg-red-400/10 text-red-400';
    case 'pending_renewal':
      return 'border-yellow-400/20 bg-yellow-400/10 text-yellow-400';
    default:
      return 'border-gray-400/20 bg-gray-400/10 text-gray-400';
  }
}

export function getStatusIcon(status: 'active' | 'expired' | 'pending_renewal'): string {
  switch (status) {
    case 'active':
      return '✅';
    case 'expired':
      return '❌';
    case 'pending_renewal':
      return '⚠️';
    default:
      return '📋';
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
