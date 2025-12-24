/**
 * ClockIn Component
 * Geofenced clock-in component for time and attendance.
 *
 * @component
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Clock, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { Employee, Shift } from '@/app/webapp/roster/types';

interface ClockInProps {
  employee: Employee;
  shift?: Shift;
  venueLocation?: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
}

/**
 * ClockIn component for employee clock-in with geofencing validation.
 *
 * @param {ClockInProps} props - Component props
 * @returns {JSX.Element} Rendered clock-in component
 */
export function ClockIn({ employee, shift, venueLocation }: ClockInProps) {
  const { showSuccess, showError } = useNotification();
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isClockIn, setIsClockIn] = useState(true); // true = clock in, false = clock out
  const [distance, setDistance] = useState<number | null>(null);
  const [isValidLocation, setIsValidLocation] = useState<boolean | null>(null);

  // Default venue location (should be configurable)
  const defaultVenueLocation = useMemo(
    () =>
      venueLocation || {
        latitude: -27.6394, // Brisbane, QLD (example)
        longitude: 153.1094,
        radiusMeters: 100,
      },
    [venueLocation],
  );

  /**
   * Calculates distance between current location and venue.
   */
  const calculateDistance = useCallback(
    (position: GeolocationPosition) => {
      const lat1 = position.coords.latitude;
      const lon1 = position.coords.longitude;
      const lat2 = defaultVenueLocation.latitude;
      const lon2 = defaultVenueLocation.longitude;

      const R = 6371e3; // Earth radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distanceMeters = R * c;
      setDistance(distanceMeters);
      setIsValidLocation(distanceMeters <= defaultVenueLocation.radiusMeters);
    },
    [defaultVenueLocation],
  );

  // Get current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(position);
          calculateDistance(position);
        },
        error => {
          let errorMessage = 'Unable to get your location';
          let errorCode = 'UNKNOWN';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              errorCode = 'PERMISSION_DENIED';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              errorCode = 'POSITION_UNAVAILABLE';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              errorCode = 'TIMEOUT';
              break;
          }
          setLocationError(errorMessage);
          // Log as warning since this is a user permission/configuration issue, not a system error
          logger.warn('Geolocation unavailable', {
            code: errorCode,
            message: error.message || errorMessage,
            errorCode: error.code,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, [calculateDistance]);

  /**
   * Handles clock-in or clock-out.
   */
  const handleClockAction = async () => {
    if (!location) {
      showError('Location not available. Please enable location access.');
      return;
    }

    if (!isValidLocation) {
      showError(`You are ${Math.round(distance || 0)}m away from the venue. Please move closer.`);
      return;
    }

    // Store original state for rollback
    const originalIsClockIn = isClockIn;

    // Optimistically toggle immediately
    setIsClockIn(!isClockIn);

    try {
      const endpoint = originalIsClockIn
        ? '/api/time-attendance/clock-in'
        : '/api/time-attendance/clock-out';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employee.id,
          shift_id: shift?.id || null,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Clock action failed');
      }

      showSuccess(originalIsClockIn ? 'Clocked in successfully' : 'Clocked out successfully');
    } catch (error) {
      // Rollback on error
      setIsClockIn(originalIsClockIn);
      const errorMessage = error instanceof Error ? error.message : 'Clock action failed';
      showError(errorMessage);
      logger.error('Clock action failed', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Time & Attendance</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {employee.first_name} {employee.last_name}
          </p>
        </div>
        <Icon icon={Clock} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
      </div>

      {/* Location Status */}
      <div className="mb-6 space-y-4">
        {locationError ? (
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
        ) : location ? (
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
                    Distance: {Math.round(distance)}m / {defaultVenueLocation.radiusMeters}m
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
            <Icon
              icon={Loader2}
              size="md"
              className="animate-spin text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <div className="text-sm text-[var(--foreground-muted)]">Getting your location...</div>
          </div>
        )}
      </div>

      {/* Clock Action Button */}
      <Button
        variant="primary"
        onClick={handleClockAction}
        disabled={!location || !isValidLocation}
        className="w-full"
      >
        {isClockIn ? (
          <>
            <Icon icon={Clock} size="sm" aria-hidden={true} />
            Clock In
          </>
        ) : (
          <>
            <Icon icon={Clock} size="sm" aria-hidden={true} />
            Clock Out
          </>
        )}
      </Button>

      {/* Shift Info */}
      {shift && (
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <div className="text-xs text-[var(--foreground-muted)]">Current Shift</div>
          <div className="text-sm font-medium text-[var(--foreground)]">
            {new Date(shift.start_time).toLocaleTimeString('en-AU', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            -{' '}
            {new Date(shift.end_time).toLocaleTimeString('en-AU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
