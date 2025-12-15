/**
 * Update panel style based on screen size.
 */
export function updatePanelStyle(): React.CSSProperties {
  const isDesktop = window.innerWidth >= 1024;
  return {
    position: 'fixed',
    top: isDesktop
      ? 'calc(var(--header-height-desktop) + var(--safe-area-inset-top))'
      : 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
    height: isDesktop
      ? 'calc(100vh - var(--header-height-desktop) - var(--safe-area-inset-top))'
      : 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))',
    right: 0,
  };
}
