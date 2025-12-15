/**
 * Keyboard handler for logo interactions.
 */
export function setupKeyboardHandler(setShowAchievements: (show: boolean) => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.shiftKey && event.key === 'A') {
      event.preventDefault();
      setShowAchievements(true);
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}
