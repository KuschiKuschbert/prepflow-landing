/**
 * ClockIn Component
 * Geofenced clock-in component for time and attendance.
 *
 * @component
 */

'use client';

import type { Employee, Shift } from '@/app/webapp/roster/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { useGeofence } from './hooks/useGeofence';
import { LocationStatus } from './LocationStatus';

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
 */
export function ClockIn({ employee, shift, venueLocation }: ClockInProps) {
  const { showSuccess, showError } = useNotification();
  const [isClockIn, setIsClockIn] = useState(true); // true = clock in, false = clock out

  const { location, locationError, distance, isValidLocation, venueRadius } =
    useGeofence(venueLocation);

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

      <div className="mb-6">
        <LocationStatus
          location={location}
          locationError={locationError}
          distance={distance}
          isValidLocation={isValidLocation}
          venueRadius={venueRadius}
        />
      </div>

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
