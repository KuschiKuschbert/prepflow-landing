import * as knowledgeBase from './knowledge-base';
import * as ruleGenerator from './rule-generator';

// Mock knowledge base dependencies
jest.mock('./knowledge-base', () => ({
  loadKnowledgeBase: jest.fn(),
  addPatternToKnowledgeBase: jest.fn(),
  addRuleToKnowledgeBase: jest.fn(),
}));

jest.mock('./rule-manager', () => ({
  generateRule: jest.fn(() => ({
    id: 'mock-rule',
    name: 'Mock Rule',
    source: 'mock',
    enforcement: 'manual',
    implementation: 'module.exports = {}',
  })),
  updateErrorPatternsFile: jest.fn(),
}));

describe('AST Rule Synthesis', () => {
  it('should synthesize CallExpression selector for simple function calls', async () => {
    // Mock data mimicking multiple fixes for "console.log(x)"
    // We intentionally include the bad code in the error pattern
    const mockFixes = Array(5).fill({
      solution: 'console.info(x)',
      prevention: 'Avoid console.log',
      documentedAt: new Date().toISOString(),
    });

    const mockLoadKb = knowledgeBase.loadKnowledgeBase as jest.Mock;
    mockLoadKb.mockResolvedValue({
      version: '1.0.0',
      lastUpdated: '',
      errors: [
        {
          id: 'err-1',
          errorType: 'ConsoleUsage',
          category: 'BestPractice',
          severity: 'warning',
          pattern: 'console.log(foo)', // This is the bad code
          context: {},
          fixes: mockFixes,
          similarErrors: [],
          preventionRules: [],
        },
      ],
      patterns: [],
      rules: [],
    });

    const mockAddRule = knowledgeBase.addRuleToKnowledgeBase as jest.Mock;

    await ruleGenerator.generateRulesFromRecentFixes();

    expect(mockAddRule).toHaveBeenCalled();
    const callArgs = mockAddRule.mock.calls[0][0]; // First call, first arg -> Rule object

    expect(callArgs.description).toContain('Detects ConsoleUsage-BestPractice usage via AST');

    // The "console.log(foo)" pattern matches the MemberExpression logic:
    // ^(\w+)\.(\w+)\s*\( -> obj="console", prop="log"
    expect(callArgs.implementation).toContain(
      "CallExpression[callee.object.name='console'][callee.property.name='log']",
    );
  });
});
