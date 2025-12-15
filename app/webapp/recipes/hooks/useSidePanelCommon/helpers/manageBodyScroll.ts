/**
 * Manage body scroll when panel is open.
 */
export function manageBodyScroll(isOpen: boolean): () => void {
  if (isOpen) {
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    requestAnimationFrame(() => {
      if (window.scrollY !== scrollY) {
        window.scrollTo(0, scrollY);
      }
    });
  } else {
    document.body.style.overflow = '';
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }
  }
  return () => {
    document.body.style.overflow = '';
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }
  };
}
