/**
 * Service Status Wrapper
 *
 * Wrapper component that handles loading and error states,
 * displaying appropriate mini-games instead of generic loading/error screens.
 */

'use client';

import React from 'react';
import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import KitchenOnFire from '@/components/ErrorGame/KitchenOnFire';
import { isArcadeDisabled, isTouchDevice, prefersReducedMotion } from '@/lib/arcadeGuards';

interface ServiceStatusWrapperProps {
  isLoading?: boolean;
  hasError?: boolean;
  children: React.ReactNode;
}

export const ServiceStatusWrapper: React.FC<ServiceStatusWrapperProps> = ({
  isLoading = false,
  hasError = false,
  children,
}) => {
  // Error takes priority
  if (hasError) {
    return <KitchenOnFire />;
  }

  // Show loading game if loading
  if (isLoading && !prefersReducedMotion() && !isArcadeDisabled() && !isTouchDevice()) {
    return <CatchTheDocket isLoading={true} />;
  }

  // Otherwise render children
  return <>{children}</>;
};
