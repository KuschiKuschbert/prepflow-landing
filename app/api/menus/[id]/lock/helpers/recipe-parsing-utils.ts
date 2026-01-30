export type Section = 'title' | 'yield' | 'ingredients' | 'method' | 'notes';

export function detectSection(line: string): Section | null {
  if (line.match(/^title:\s*(.+)$/i)) return 'title';
  if (line.match(/^yield\/portions?:\s*(.+)$/i)) return 'yield';
  if (line.match(/^ingredients?:$/i)) return 'ingredients';
  if (line.match(/^method:?$/i) || line.match(/^method\s*:/i)) return 'method';
  if (line.match(/^notes?:$/i)) return 'notes';
  return null;
}

export function parseTitleFromHeader(line: string): string {
  return line.replace(/^title:\s*/i, '').trim();
}

export function parseYieldFromHeader(line: string): number | null {
  const match = line.match(/^yield\/portions?:\s*(.+)$/i);
  if (match) {
    const num = parseInt(match[1].trim(), 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

export function createIngredient(name: string, quantityStr: string, unit: string) {
  const quantity = parseFloat(quantityStr);
  if (!isNaN(quantity) && quantity > 0) {
    return {
      name: name.trim(),
      quantity,
      unit: unit.trim(),
    };
  }
  return null;
}

export function parseIngredient(line: string) {
  if (!line.startsWith('-')) return null;

  // Format: - [Name] | [Quantity] | [Unit]
  const pipeMatch = line.match(/^-\s*(.+?)\s*\|\s*([\d.]+)\s*\|\s*(.+)$/);
  if (pipeMatch) {
    const [, name, qty, unit] = pipeMatch;
    return createIngredient(name, qty, unit);
  }

  // Format: - Name: Quantity Unit
  const colonMatch = line.match(/^-\s*(.+?):\s*([\d.]+)\s+(.+)$/);
  if (colonMatch) {
    const [, name, qty, unit] = colonMatch;
    return createIngredient(name, qty, unit);
  }

  // Format: - Name Quantity Unit (last resort)
  const spaceMatch = line.match(/^-\s*(.+?)\s+([\d.]+)\s+(.+)$/);
  if (spaceMatch) {
    const [, name, qty, unit] = spaceMatch;
    return createIngredient(name, qty, unit);
  }

  return null;
}

export function parseMethodStep(line: string): string | null {
  // 1. Step or 1) Step
  const numberedMatch = line.match(/^\d+[\.\)]\s*(.+)$/);
  if (numberedMatch) return numberedMatch[1].trim();

  // - Step or * Step or • Step
  if (line.match(/^[-•*]\s/)) {
    return line.replace(/^[-•*]\s*/, '').trim();
  }

  // Plain text step, but ignore headers if they somehow slipped here (unlikely provided detection logic)
  // and ignore weird labels
  if (
    line.length > 0 &&
    !line.match(/^[A-Z][^:]+:$/i) && // Skip likely headers
    !detectSection(line) // Double check against headers
  ) {
    return line.trim();
  }

  return null;
}

export function parseNote(line: string): string | null {
  if (line.match(/^[-•]\s/)) {
    return line.replace(/^[-•]\s*/, '').trim();
  }
  if (line.length > 0) return line;
  return null;
}

export function isValidTitleCandidate(line: string): boolean {
  return line.length > 0 && !line.match(/^[A-Z][^:]+:$/);
}
