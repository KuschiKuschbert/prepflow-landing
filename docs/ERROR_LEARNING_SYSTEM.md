# Self-Improving Error System

## Overview

The self-improving error system automatically captures errors, documents fixes, learns from patterns, and prevents similar errors in the future. This creates a feedback loop that continuously improves code quality.

## Architecture

```
Error Capture → Fix Documentation → Pattern Learning → Rule Generation → Prevention
```

The system leverages the **[Ralph Loop Technique](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/methodology/RALPH_LOOP.md)** for fix generation: failures in fix attempts are treated as informative data for the next iteration.

## Components

### 1. Error Capture (`scripts/error-capture/`)

- **capture-error.js**: Captures errors from runtime, build, pre-commit, and CI/CD
- **capture-build-errors.js**: Captures TypeScript, ESLint, and Next.js build errors
- **pre-commit-error-capture.sh**: Captures pre-commit hook errors

### 2. Fix Documentation (`lib/error-learning/` & `scripts/error-learning/`)

- **document-fix.ts**: API for documenting fixes
- **detect-fixes.js**: Automatically detects fixes from git history
- **document-fix-interactive.js**: Interactive CLI for documenting fixes

### 3. Knowledge Base (`docs/errors/`)

- **knowledge-base.json**: Structured knowledge base (errors, patterns, rules)
- **fixes/**: Human-readable markdown documentation
- **error-patterns.mdc**: Auto-updated rules for agent context

### 4. Learning System (`lib/error-learning/`)

- **pattern-matcher.ts**: Matches new errors to known patterns
- **rule-generator.ts**: Generates rules from fix patterns
- **knowledge-index.ts**: Builds searchable index for fast lookup
- **suggest-fix.ts**: Suggests fixes based on knowledge base

### 5. Development Integration

- **learned-patterns.js**: Cleanup check that prevents high-risk patterns
- **error-patterns.mdc**: Auto-updated rules in agent context
- **suggest-fix.ts**: Provides fix suggestions when errors occur

### 6. Automation (`scripts/error-learning/`)

- **auto-document-fix.js**: Automatically documents fixes after successful builds
- **generate-learning-report.js**: Generates weekly learning reports
- **CI/CD Integration**: `.github/workflows/error-learning.yml`

## Usage

### Capture Errors

```bash
# Capture build errors
npm run error:capture-build

# Capture specific error
npm run error:capture runtime <error-id>
```

### Document Fixes

```bash
# Interactive documentation
npm run error:document

# Auto-detect fixes from git history
npm run error:detect-fixes

# Auto-document after build
npm run error:auto-document
```

### Generate Reports

```bash
# Generate learning report (last 7 days)
npm run error:report

# Generate report for specific days
npm run error:report 30
```

### Generate Rules

```bash
# Generate rules from knowledge base
npm run error:generate-rules
```

## Knowledge Base Structure

### Errors

- **id**: Unique identifier
- **errorType**: TypeScript, ESLint, Runtime, etc.
- **category**: type-error, lint-error, database, etc.
- **severity**: safety, critical, high, medium, low
- **pattern**: Error message pattern
- **context**: File, line, environment
- **fixes**: Array of documented fixes
- **similarErrors**: Related error IDs
- **preventionRules**: Rule IDs for prevention

### Patterns

- **id**: Unique identifier
- **name**: Pattern name
- **description**: Pattern description
- **detection**: How to detect this pattern
- **fix**: How to fix this pattern
- **prevention**: How to prevent this pattern

### Rules

- **id**: Unique identifier
- **name**: Rule name
- **source**: Source file (error-patterns.mdc)
- **enforcement**: automated or manual

## Workflow

1. **Error Occurs**: Captured automatically or manually
2. **Fix Applied**: Developer fixes the error
3. **Fix Documented**: Automatically detected or manually documented
4. **Pattern Learned**: System extracts patterns from fixes
5. **Rule Generated**: Rules generated when pattern appears 3+ times
6. **Prevention**: High-risk patterns checked in pre-commit

## Integration Points

### Pre-commit Hook

The learned-patterns check runs as part of cleanup checks, warning about high-risk patterns that have caused errors before.

### CI/CD Pipeline

The error-learning workflow:

- Captures build errors when CI fails
- Detects fixes when CI succeeds
- Generates learning reports weekly

### Agent Context

The `.cursor/rules/error-patterns.mdc` file is automatically updated with learned patterns and included in agent context, so the AI can reference past fixes when encountering similar errors.

## Success Metrics

- **Error Reduction**: Track errors over time (target: 20% reduction in 3 months)
- **Fix Speed**: Average time to fix errors (target: 50% reduction)
- **Knowledge Base Growth**: Track documented fixes and patterns
- **Rule Generation**: Number of automated rules generated
- **Prevention Rate**: Errors prevented by proactive checks

## Files Created

### Scripts

- `scripts/error-capture/capture-error.js`
- `scripts/error-capture/capture-build-errors.js`
- `scripts/error-capture/pre-commit-error-capture.sh`
- `scripts/error-learning/detect-fixes.js`
- `scripts/error-learning/document-fix-interactive.js`
- `scripts/error-learning/auto-document-fix.js`
- `scripts/error-learning/generate-learning-report.js`
- `scripts/cleanup/checks/learned-patterns.js`

### Libraries

- `lib/error-learning/document-fix.ts`
- `lib/error-learning/knowledge-base.ts`
- `lib/error-learning/pattern-matcher.ts`
- `lib/error-learning/rule-generator.ts`
- `lib/error-learning/knowledge-index.ts`
- `lib/error-learning/suggest-fix.ts`

### Documentation

- `docs/errors/knowledge-base.json`
- `docs/errors/fixes/typescript-type-errors.md`
- `docs/errors/fixes/missing-error-handling.md`
- `.cursor/rules/error-patterns.mdc`

### CI/CD

- `.github/workflows/error-learning.yml`

## Next Steps

1. Start using the system - errors will be captured automatically
2. Document fixes when resolving errors (interactive tool or auto-detect)
3. Review learning reports weekly to track progress
4. Rules will be generated automatically as patterns emerge
5. High-risk patterns will be checked in pre-commit to prevent errors

The system is now fully operational and will continuously learn and improve!
