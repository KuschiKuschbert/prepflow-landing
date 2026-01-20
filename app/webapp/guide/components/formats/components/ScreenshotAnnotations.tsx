import type { ScreenshotContent } from '../../../data/guide-types';

interface ScreenshotAnnotationsProps {
  annotations: ScreenshotContent['annotations'];
}

export function ScreenshotAnnotations({ annotations }: ScreenshotAnnotationsProps) {
  if (!annotations || annotations.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      {annotations.map((annotation, index) => (
        <div
          key={`annotation-${index}`}
          className="absolute"
          style={{
            left: `${annotation.x}%`,
            top: `${annotation.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}
        >
          {/* Arrow */}
          {annotation.arrow && (
            <div
              className={`absolute ${
                annotation.arrow === 'up'
                  ? 'bottom-full mb-2'
                  : annotation.arrow === 'down'
                    ? 'top-full mt-2'
                    : annotation.arrow === 'left'
                      ? 'right-full mr-2'
                      : 'left-full ml-2'
              }`}
              style={{
                ...(annotation.arrow === 'up' || annotation.arrow === 'down'
                  ? { left: '50%', transform: 'translateX(-50%)' }
                  : { top: '50%', transform: 'translateY(-50%)' }),
              }}
            >
              <div
                className={`h-0 w-0 border-4 ${
                  annotation.arrow === 'up'
                    ? 'border-t-transparent border-r-transparent border-b-[#29E7CD] border-l-transparent'
                    : annotation.arrow === 'down'
                      ? 'border-t-[#29E7CD] border-r-transparent border-b-transparent border-l-transparent'
                      : annotation.arrow === 'left'
                        ? 'border-t-transparent border-r-[#29E7CD] border-b-transparent border-l-transparent'
                        : 'border-t-transparent border-r-transparent border-b-transparent border-l-[#29E7CD]'
                }`}
              />
            </div>
          )}

          {/* Annotation text */}
          <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2 text-sm text-[var(--foreground)] backdrop-blur-sm">
            {annotation.text}
          </div>
        </div>
      ))}
    </div>
  );
}
