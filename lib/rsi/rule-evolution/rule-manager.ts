import fs from 'fs';
import path from 'path';
import { GeneratedRule } from './rule-generator';

/**
 * Rule Manager
 * Manages the lifecycle of RSI rules.
 */

const ACTIVE_RULES_PATH = path.join(process.cwd(), 'docs/rsi/active-rules.json');
const RSI_ESLINT_CONFIG_PATH = path.join(process.cwd(), 'rsi.eslint.config.mjs');

export class RuleManager {
  static async activateRule(rule: GeneratedRule): Promise<boolean> {
    try {
      // 1. Handle ESLint Rules (Native Integration)
      if (rule.type === 'eslint') {
        return await this.activateESLintRule(rule);
      }

      // 2. Handle Custom RSI Rules (Legacy / Complex)
      let rules: GeneratedRule[] = [];
      if (fs.existsSync(ACTIVE_RULES_PATH)) {
        rules = JSON.parse(fs.readFileSync(ACTIVE_RULES_PATH, 'utf-8') || '[]');
      }

      if (rules.some(r => r.name === rule.name)) {
return false;
      }

      rules.push(rule);
      fs.writeFileSync(ACTIVE_RULES_PATH, JSON.stringify(rules, null, 2));
      console.log(`✅ Activated RSI rule: ${rule.name}`);
      return true;
    } catch (error) {
      console.error('Failed to activate rule:', error);
      return false;
    }
  }

  private static async activateESLintRule(rule: GeneratedRule): Promise<boolean> {
    try {
      // Ideally we would parse the AST, but for stability we will read the current file
      // and inject the rule into the rules object regex-style or reconstruct the file.
      // Since the file structure is controlled by us, reconstruction is safe.

      // Getting existing rules is hard without executing the JS.
      // Strategy: Parse the file content, find the rules object, and insert.

      if (!fs.existsSync(RSI_ESLINT_CONFIG_PATH)) {
        console.error('RSI ESLint Config file missing.');
        return false;
      }

      let content = fs.readFileSync(RSI_ESLINT_CONFIG_PATH, 'utf-8');

      // Check if rule already exists
      if (content.includes(`'${rule.definition}':`)) {
return false;
      }

      // Injection logic: Find "rules: {" and insert after it
      const ruleEntry = `'${rule.definition}': '${rule.severity}', // ${rule.name}`;
      const insertionPoint = 'rules: {';

      if (content.includes(insertionPoint)) {
        content = content.replace(insertionPoint, `${insertionPoint}\n      ${ruleEntry}`);
        fs.writeFileSync(RSI_ESLINT_CONFIG_PATH, content);
return true;
      } else {
        console.error('Could not find rules block in RSI config.');
        return false;
      }
    } catch (err) {
      console.error('Failed to update ESLint config:', err);
      return false;
    }
  }

  static async getActiveRules(): Promise<GeneratedRule[]> {
    if (!fs.existsSync(ACTIVE_RULES_PATH)) return [];
    return JSON.parse(fs.readFileSync(ACTIVE_RULES_PATH, 'utf-8') || '[]');
  }
}
