import { useCallback } from 'react';
import type { InteractiveContent } from '../../../data/guide-types';

export function useActionSimulation(content: InteractiveContent) {
  const simulateAction = useCallback(
    (actionIndex: number) => {
      const action = content.actions?.[actionIndex];
      if (!action) return;

      const targetElement = document.querySelector(action.target);
      if (!targetElement) return;

      switch (action.type) {
        case 'click':
          (targetElement as HTMLElement).click();
          break;
        case 'type':
          if (
            targetElement instanceof HTMLInputElement ||
            targetElement instanceof HTMLTextAreaElement
          ) {
            targetElement.focus();
            targetElement.value = action.value || '';
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
            targetElement.dispatchEvent(new Event('change', { bubbles: true }));
          }
          break;
        case 'scroll':
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
      }
    },
    [content.actions],
  );

  return { simulateAction };
}
