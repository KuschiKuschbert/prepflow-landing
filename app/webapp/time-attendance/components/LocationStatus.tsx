import { Icon } from '@/components/ui/Icon';
import { CheckCircle, Loader2, MapPin, XCircle } from 'lucide-react';

interface LocationStatusProps {
  location: GeolocationPosition | null;
  locationError: string | null;
  distance: number | null;
  isValidLocation: boolean | null;
  venueRadius: number;
}

export function LocationStatus({
  location,
  locationError,
  distance,
  isValidLocation,
  venueRadius,
}: LocationStatusProps) {
  if (locationError) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-4">
        <Icon
          icon={XCircle}
          size="md"
          className="text-[var(--color-error)]"
          aria-hidden={true}
        />
        <div>
          <div className="font-medium text-[var(--color-error)]">Location Error</div>
          <div className="text-sm text-red-300">{locationError}</div>
        </div>
      </div>
    );
  }

  if (location) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <Icon icon={MapPin} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          <div className="flex-1">
            <div className="font-medium text-[var(--foreground)]">Your Location</div>
            <div className="text-sm text-[var(--foreground-muted)]">
              {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
            </div>
          </div>
        </div>

        {distance !== null && (
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              isValidLocation
                ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/10'
                : 'border-[var(--color-error)]/50 bg-[var(--color-error)]/10'
            }`}
          >
            <Icon
              icon={isValidLocation ? CheckCircle : XCircle}
              size="md"
              className={
                isValidLocation ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              }
              aria-hidden={true}
            />
            <div className="flex-1">
              <div
                className={`font-medium ${isValidLocation ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
              >
                {isValidLocation ? 'Within Geofence' : 'Outside Geofence'}
              </div>
              <div className="text-sm text-[var(--foreground-muted)]">
                Distance: {Math.round(distance)}m / {venueRadius}m
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
      <Icon
        icon={Loader2}
        size="md"
        className="animate-spin text-[var(--foreground-muted)]"
        aria-hidden={true}
      />
      <div className="text-sm text-[var(--foreground-muted)]">Getting your location...</div>
    </div>
  );
}
