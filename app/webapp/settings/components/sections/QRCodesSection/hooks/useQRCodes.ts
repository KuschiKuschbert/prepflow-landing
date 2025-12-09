import { useState, useEffect } from 'react';
import type { QRCodeEntity } from '../types';

/**
 * Hook for fetching QR code entities
 */
export function useQRCodes() {
  const [entities, setEntities] = useState<QRCodeEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/qr-codes');
      const data = await response.json();

      if (data.success) {
        setEntities(data.entities);
      } else {
        setError(data.error || 'Failed to load QR codes');
      }
    } catch {
      setError('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  return {
    entities,
    loading,
    error,
    refetch: fetchEntities,
  };
}
