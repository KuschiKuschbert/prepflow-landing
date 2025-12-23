import confetti from 'canvas-confetti';

/**
 * Vegetable-themed colors for confetti (subtle celebrations)
 */
const VEGETABLE_COLORS = [
  '#FF6B6B', // Tomato red
  '#4ECDC4', // Cucumber green
  '#FFE66D', // Corn yellow
  '#95E1D3', // Lettuce green
  '#F38181', // Carrot orange
  '#AA96DA', // Eggplant purple
  '#FCBAD3', // Radish pink
  '#FFFFD2', // Onion white/yellow
];

/**
 * Throw subtle confetti (reduced particle count for subtlety)
 */
export function throwSubtleConfetti(intensity: number = 0.5): void {
  const particleCount = Math.floor(100 * intensity);

  confetti({
    particleCount,
    spread: 50,
    origin: { y: 0.6 },
    colors: VEGETABLE_COLORS,
    shapes: ['circle'],
  });
}
