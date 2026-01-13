import fs from 'fs';
import path from 'path';
import { GeneratedRule } from './rule-generator';

/**
 * Rule Manager
 * Manages the lifecycle of RSI rules.
 */

const ACTIVE_RULES_PATH = path.join(process.cwd(), 'docs/rsi/active-rules.json');

export class RuleManager {
  static async activateRule(rule: GeneratedRule): Promise<boolean> {
    try {
      let rules: GeneratedRule[] = [];
      if (fs.existsSync(ACTIVE_RULES_PATH)) {
        rules = JSON.parse(fs.readFileSync(ACTIVE_RULES_PATH, 'utf-8') || '[]');
      }

      // Check duplicates
      if (rules.some(r => r.name === rule.name)) {
        console.log(`Rule "${rule.name}" already active.`);
        return false;
      }

      rules.push(rule);
      fs.writeFileSync(ACTIVE_RULES_PATH, JSON.stringify(rules, null, 2));
      console.log(`Rule "${rule.name}" activated.`);
      return true;
    } catch (error) {
      console.error('Failed to activate rule:', error);
      return false;
    }
  }

  static async getActiveRules(): Promise<GeneratedRule[]> {
    if (!fs.existsSync(ACTIVE_RULES_PATH)) return [];
    return JSON.parse(fs.readFileSync(ACTIVE_RULES_PATH, 'utf-8') || '[]');
  }
}
