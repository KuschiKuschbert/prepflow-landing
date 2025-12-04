'use client';

import { ReactNode } from 'react';

interface DishDropZoneProps {
  children: ReactNode;
  hasIngredients: boolean;
}

/**
 * Container component for dish builder content.
 * Simply wraps children - no empty state needed since instructions are in the left panel.
 *
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Content to display
 * @param {boolean} props.hasIngredients - Whether dish has ingredients (currently unused but kept for potential future use)
 * @returns {JSX.Element} Rendered container
 */
export default function DishDropZone({ children, hasIngredients }: DishDropZoneProps) {
  return <div className="space-y-6">{children}</div>;
}
