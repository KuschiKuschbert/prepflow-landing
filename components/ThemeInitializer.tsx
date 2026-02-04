'use client';

/**
 * Script component to initialize the theme from localStorage immediately on load.
 * This is placed in the <head> to prevent theme flashing.
 */
export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('prepflow-theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {
              console.error('Failed to read theme from localStorage, using dark theme fallback:', e);
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `,
      }}
    />
  );
}
