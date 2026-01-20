import { useEffect } from 'react';

export function useKeyboardShortcuts(
  isDesktop: boolean,
  onSearch: () => void,
  onSidebarToggle?: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            onSearch();
            break;
          case 'b':
            // Toggle sidebar collapse on desktop (if we add that feature)
            // For now, just prevent default
            if (isDesktop && onSidebarToggle) {
              onSidebarToggle();
            } else if (isDesktop) {
              event.preventDefault();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDesktop, onSearch, onSidebarToggle]);
}
