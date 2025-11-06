'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import KitchenOnFire from '@/components/ErrorGame/KitchenOnFire';
import { usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  public render() {
    if (this.state.hasError) {
      // Use provided fallback if any
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback, but suppress on auth routes
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if (
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/callback') ||
        pathname.startsWith('/authorize')
      ) {
        return null;
      }

      return <KitchenOnFire />;
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);

    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }, []);

  return { handleError };
};

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;
