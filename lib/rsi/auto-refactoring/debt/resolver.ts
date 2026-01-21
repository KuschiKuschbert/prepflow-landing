import { logger } from '@/lib/logger';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Automatically marks a debt item as resolved in DEBT.md
 * @param sourceItem The exact text of the debt item to search for
 */
export async function resolveDebtItem(sourceItem: string): Promise<boolean> {
  try {
    const debtPath = path.join(process.cwd(), 'docs/DEBT.md');
    if (!fs.existsSync(debtPath)) return false;

    const content = fs.readFileSync(debtPath, 'utf-8');

    // Look for the specific line and mark it as checked
    // We search for the pattern "- [ ] ... sourceItem"
    const lines = content.split('\n');
    const index = lines.findIndex(l => l.includes('- [ ]') && l.includes(sourceItem));

    if (index !== -1) {
      lines[index] = lines[index].replace('- [ ]', '- [x]');
      fs.writeFileSync(debtPath, lines.join('\n'), 'utf-8');
      logger.dev(`✅ Marked debt item as resolved in DEBT.md: ${sourceItem}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Failed to update DEBT.md:', error);
    return false;
  }
}
