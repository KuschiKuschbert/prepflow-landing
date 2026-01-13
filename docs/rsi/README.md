# Recursive Self-Improvement (RSI) System

The RSI system ensures the codebase improves automatically over time through a continuous loop of analysis, fixing, learning, and evolution. This process is orchestrated via high-level **[Ralph Loops](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/methodology/RALPH_LOOP.md)**.

## Modules

### 1. Safety (`lib/rsi/safety`)

- **Guardrails**: Prevents automated changes from breaking the build.
- **Rollback**: Automatically reverts failed changes.
- **Components**: `ConfidenceScorer`, `SafetyChecker`, `ChangeTracker`.

### 2. Auto-Fixer (`lib/rsi/auto-fix`)

- **Self-Healing**: Runs cleanup rules and basic fixes proactively.
- **Command**: `npm run rsi:fix`
- **Logic**: Uses `FixProvider` adapters to standardized fix sources.

### 3. Self-Optimization (`lib/rsi/self-optimization`)

- **Tuning**: Adjusts internal parameters (e.g., confidence thresholds) based on success rates.
- **Command**: `npm run rsi:optimize`
- **Components**: `PerformanceTracker`, `Optimizer`, `ABTester`.

### 4. Meta-Learning (`lib/rsi/meta-learning`)

- **Pattern Recognition**: Analyzes history to find successful improvement patterns.
- **Command**: `npm run rsi:evolve`
- **Components**: `LearningStrategy`, `KnowledgeSynthesizer`.

### 5. Auto-Refactoring (`lib/rsi/auto-refactoring`)

- **Architectural Change**: Plans and executes large-scale AST transformations.
- **Command**: `npm run rsi:refactor`
- **Components**: `RefactoringPlanner`, `CodemodRunner`.

### 6. Rule Evolution (`lib/rsi/rule-evolution`)

- **Governance**: Automatically generates and enforces new linting/cleanup rules.
- **Command**: `npm run rsi:rule`
- **Components**: `RuleGenerator`, `RuleManager`.

## Usage

### The Master Switch

To run a standard maintenance cycle (Fix, Optimize, Learn, Rule):

```bash
npm run rsi:run
```

To include heavy refactoring:

```bash
npm run rsi:run -- --full
```

### Dry Run

All commands support `--dry-run` to preview actions without committing:

```bash
npm run rsi:run -- --dry-run
```

## Data Storage

All persistent data is stored in `docs/rsi/`:

- `improvements.json`: Log of all applied changes.
- `metrics.json`: System performance stats.
- `active-rules.json`: Currently enforced evolved rules.
- `experiments.json`: Active A/B tests.
- `learning-history.json`: Log of generated insights.
