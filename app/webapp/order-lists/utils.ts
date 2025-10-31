export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return 'text-gray-400 bg-gray-400/10';
    case 'sent':
      return 'text-blue-400 bg-blue-400/10';
    case 'received':
      return 'text-green-400 bg-green-400/10';
    case 'cancelled':
      return 'text-red-400 bg-red-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
}
