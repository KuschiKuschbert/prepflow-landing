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
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      const endpoint = isClockIn
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

      showSuccess(isClockIn ? 'Clocked in successfully' : 'Clocked out successfully');
      setIsClockIn(!isClockIn);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Clock action failed';
      showError(errorMessage);
      logger.error('Clock action failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Time & Attendance</h2>
          <p className="text-sm text-gray-400">
            {employee.first_name} {employee.last_name}
          </p>
        </div>
        <Icon icon={Clock} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>

      {/* Location Status */}
      <div className="mb-6 space-y-4">
        {locationError ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
            <Icon icon={XCircle} size="md" className="text-red-400" aria-hidden={true} />
            <div>
              <div className="font-medium text-red-400">Location Error</div>
              <div className="text-sm text-red-300">{locationError}</div>
            </div>
          </div>
        ) : location ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
              <Icon icon={MapPin} size="md" className="text-[#29E7CD]" aria-hidden={true} />
              <div className="flex-1">
                <div className="font-medium text-white">Your Location</div>
                <div className="text-sm text-gray-400">
                  {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                </div>
              </div>
            </div>

            {distance !== null && (
              <div
                className={`flex items-center gap-3 rounded-xl border p-4 ${
                  isValidLocation
                    ? 'border-green-500/50 bg-green-500/10'
                    : 'border-red-500/50 bg-red-500/10'
                }`}
              >
                <Icon
                  icon={isValidLocation ? CheckCircle : XCircle}
                  size="md"
                  className={isValidLocation ? 'text-green-400' : 'text-red-400'}
                  aria-hidden={true}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium ${isValidLocation ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {isValidLocation ? 'Within Geofence' : 'Outside Geofence'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Distance: {Math.round(distance)}m / {defaultVenueLocation.radiusMeters}m
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
            <Icon
              icon={Loader2}
              size="md"
              className="animate-spin text-gray-400"
              aria-hidden={true}
            />
            <div className="text-sm text-gray-400">Getting your location...</div>
          </div>
        )}
      </div>

      {/* Clock Action Button */}
      <Button
        variant="primary"
        onClick={handleClockAction}
        disabled={loading || !location || !isValidLocation}
        className="w-full"
      >
        {loading ? (
          <>
            <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
            Processing...
          </>
        ) : isClockIn ? (
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
        <div className="mt-4 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
          <div className="text-xs text-gray-400">Current Shift</div>
          <div className="text-sm font-medium text-white">
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
