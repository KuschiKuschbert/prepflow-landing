export interface KnowledgeBaseError {
  id: string;
  errorType: string;
  category: string;
  severity: string;
  pattern: string;
  context: {
    file?: string;
    line?: number;
    environment?: string;
    [key: string]: unknown;
  };
  fixes: KnowledgeBaseFix[];
  similarErrors: string[];
  preventionRules: string[];
}

export interface KnowledgeBaseFix {
  id: string;
  solution: string;
  codeChanges?: string;
  prevention: string;
  documentedAt: string;
  documentedBy: 'system' | 'user';
}

export interface KnowledgeBasePattern {
  id: string;
  name: string;
  description: string;
  detection: string;
  fix: string;
  prevention: string;
  badPattern?: string; // Code snippet showing the bad pattern
  goodPattern?: string; // Code snippet showing the good pattern
  context?: string[]; // AST context (e.g., 'CallExpression')
}

export interface KnowledgeBaseRule {
  id: string;
  name: string;
  description?: string; // Rule description
  source: string;
  enforcement: 'automated' | 'manual';
  severity?: 'error' | 'warning' | 'info'; // ESLint severity
  implementation?: string; // Custom ESLint rule implementation
  ruleId?: string; // ESLint rule ID (e.g., rsi/no-bad-pattern)
}

export interface KnowledgeBase {
  version: string;
  lastUpdated: string;
  errors: KnowledgeBaseError[];
  patterns: KnowledgeBasePattern[];
  rules: KnowledgeBaseRule[];
}

export interface FixDocumentation {
  errorId: string;
  fixId: string;
  rootCause: string;
  solution: string;
  codeChanges?: string; // Git diff or description
  preventionStrategies: string[];
  relatedErrors?: string[]; // IDs of similar errors
  documentedAt: string;
  documentedBy: 'system' | 'user';
}
