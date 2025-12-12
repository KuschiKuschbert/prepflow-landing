import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createCenterOnCursorModifier } from '../../drag/centerOnCursorModifier';

interface DragDropSetupParams {
  initialOffset: { x: number; y: number } | null;
  initialCursorPosition: { x: number; y: number } | null;
}

export function useDragDropSetup({ initialOffset, initialCursorPosition }: DragDropSetupParams) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const centerOnCursor = createCenterOnCursorModifier({
    initialOffset,
    initialCursorPosition,
  });

  return { sensors, centerOnCursor };
}




