/**
 * Smart "Chef" Rounding
 * Rounds quantities to human-friendly kitchen numbers.
 *
 * Logic for UI Display:
 * < 10: Nearest 0.5 (e.g. 2.5g)
 * 10 - 100: Nearest 1 (e.g. 12g)
 * > 100: Nearest 5 (e.g. 125g)
 *
 * @param value
 */
export function smartRound(value: number): number {
  const qty = value;

  if (qty < 10) {
    // e.g. 2.5 ml salt -> 3g.
    // 5ml salt -> 6g.
    // 1/2 tsp (2.5ml) -> 3g.
    return Math.round(qty * 2) / 2; // Nearest 0.5
  }
  if (qty < 100) {
    return Math.round(qty); // Nearest 1g
  }
  return Math.round(qty / 5) * 5; // Nearest 5g
}
