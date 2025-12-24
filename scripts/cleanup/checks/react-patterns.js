#!/usr/bin/env node

/**
 * React Patterns Check Module
 * Validates React hooks usage, component structure, and performance patterns
 * Source: development.mdc (Code Quality Requirements)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findReactFiles() {
  const files = [];
  const searchDirs = ['app', 'components', 'hooks'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules' &&
          entry.name !== '.next'
        ) {
          walkDir(fullPath);
        }
      } else if (/\.(tsx|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function analyzeReactPatterns(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  // Skip non-React files
  if (!/\.(tsx|jsx)$/.test(filePath)) return violations;

  // Check for client component directive
  const isClientComponent = content.includes('"use client"') || content.includes("'use client'");
  const hasHooks =
    /use[A-Z]\w+\(/.test(content) || /useState|useEffect|useCallback|useMemo/.test(content);
  const hasEventHandlers = /onClick|onChange|onSubmit/.test(content);
  const hasBrowserAPI = /window\.|document\.|localStorage|sessionStorage/.test(content);

  // Check for hooks usage
  const hasConditionalHook =
    /if\s*\([^)]*\)\s*\{[^}]*use[A-Z]\w+\(/.test(content) || /\?.*use[A-Z]\w+\(/.test(content);

  // Check for useEffect cleanup
  const hasUseEffect = /useEffect\(/.test(content);
  const hasCleanup = /return\s+\(\)\s*=>/.test(content) && hasUseEffect;

  // Check for proper dependency arrays
  // Improved detection: Find useEffect calls and check if dependency array exists
  // Strategy: Look for useEffect patterns and check for ", [" pattern within reasonable distance
  
  let hasUseEffectWithoutDeps = false;
  let hasUseEffectWithDeps = false;
  
  if (hasUseEffect) {
    // Find all useEffect call positions
    const useEffectMatches = [];
    const useEffectRegex = /useEffect\s*\(/g;
    let match;
    while ((match = useEffectRegex.exec(content)) !== null) {
      useEffectMatches.push(match.index);
    }
    
    // For each useEffect, check if it has a dependency array
    for (const startPos of useEffectMatches) {
      // Look at the next 500 characters after useEffect(
      const window = content.substring(startPos, startPos + 500);
      
      // Check if there's a dependency array pattern: , [...] or ,[]
      // The pattern should appear after the callback function
      // Simple check: look for ", [" or ",[]" after "useEffect("
      if (/,\s*\[/.test(window)) {
        hasUseEffectWithDeps = true;
      } else {
        // Check if this useEffect call is complete (ends with })
        // If it ends with }) or }); without ", [", it's missing dependency array
        // But we need to be careful - the callback might be multi-line
        // Look for patterns like: useEffect(() => { ... }) or useEffect(() => { ... });
        const callbackEndPattern = /\}\);?/;
        if (callbackEndPattern.test(window)) {
          // Found end of useEffect, check if there was a dependency array before it
          const beforeEnd = window.substring(0, window.search(callbackEndPattern));
          if (!/,\s*\[/.test(beforeEnd)) {
            hasUseEffectWithoutDeps = true;
          }
        } else {
          // Can't determine - might be a very long useEffect or incomplete
          // Don't flag as violation to avoid false positives
        }
      }
    }
    
    // Additional check: Look for explicit patterns
    // Pattern with dependency array: useEffect(..., [deps])
    if (/useEffect\s*\([^)]*,\s*\[/.test(content)) {
      hasUseEffectWithDeps = true;
    }
  }

  // Check for React.memo usage
  const hasProps = /props|interface.*Props|type.*Props/.test(content);
  const usesMemo = /React\.memo|memo\(/.test(content);

  // Check for useMemo/useCallback usage
  // Improved detection: Only flag expensive computations that aren't already memoized
  const hasExpensiveComputation = /\.map\(|\.filter\(|\.reduce\(/.test(content);
  const usesMemoization = /useMemo\(|useCallback\(/.test(content);
  
  // Check if computations are already wrapped in useMemo
  // Look for patterns like: useMemo(() => { ... .map(...) ... }, [deps])
  const hasMemoizedComputation = /useMemo\s*\([^)]*=>[^}]*\.(map|filter|reduce)\(/.test(content);
  
  // Check if computation is in a custom hook (hooks can memoize internally)
  const isHookFile = /hooks\/|use\w+\.tsx?$/.test(filePath);
  
  // Count array operations to determine if computation is expensive
  const mapCount = (content.match(/\.map\(/g) || []).length;
  const filterCount = (content.match(/\.filter\(/g) || []).length;
  const reduceCount = (content.match(/\.reduce\(/g) || []).length;
  const totalArrayOps = mapCount + filterCount + reduceCount;
  
  // Check for multiple chained operations (filter + sort + map = expensive)
  const hasChainedOperations = /\.(map|filter|reduce)\([^)]*\)\.(map|filter|reduce|sort)\(/.test(content);
  
  // Only flag if:
  // 1. Has expensive computation (multiple operations or chained)
  // 2. Not already memoized
  // 3. Not in a hook file (hooks can handle memoization internally)
  // 4. Component receives props (memoization is most beneficial with props)
  const shouldFlagMemoization = 
    hasExpensiveComputation &&
    !hasMemoizedComputation &&
    !isHookFile &&
    hasProps &&
    (hasChainedOperations || totalArrayOps > 2);

  // Check for proper state updates
  // Improved detection: Only flag actual state mutations, not helper function operations
  // Strategy: Check if mutation is on a variable that comes from useState destructuring
  
  let hasDirectStateMutation = false;
  const hasFunctionalUpdate = /set\w+\(.*prev/.test(content);
  
  if (/useState/.test(content)) {
    // Find all useState declarations: const [varName, setVarName] = useState(...)
    const useStateMatches = content.match(/const\s+\[(\w+),\s*set\w+\]\s*=\s*useState/g) || [];
    const stateVars = useStateMatches.map(m => {
      const varMatch = m.match(/\[(\w+),/);
      return varMatch ? varMatch[1] : null;
    }).filter(Boolean);
    
    // Check for direct mutations on state variables
    // Pattern: stateVar[index] = value (where stateVar is from useState)
    for (const stateVar of stateVars) {
      // Look for patterns like: stateVar[...] = or stateVar[index] =
      // But exclude: [...stateVar, ...] (spread operator creates new array)
      // Exclude: const newVar = stateVar[...] (reading, not mutating)
      const mutationPattern = new RegExp(`\\b${stateVar}\\s*\\[.*\\]\\s*=`, 'g');
      if (mutationPattern.test(content)) {
        // Verify it's not a spread operator or read operation
        const lines = content.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          if (mutationPattern.test(lines[i])) {
            // Check if it's a mutation (not a spread or read)
            if (!/\.\.\./.test(lines[i]) && !/const\s+\w+\s*=/.test(lines[i])) {
              hasDirectStateMutation = true;
              break;
            }
          }
        }
        if (hasDirectStateMutation) break;
      }
    }
    
    // Fallback: Simple pattern check (less accurate but catches obvious cases)
    if (!hasDirectStateMutation) {
      // Look for array mutations that are likely state mutations
      // Pattern: variable[index] = value where variable is likely state
      // Exclude helper functions and local variables
      const simpleMutationPattern = /(\w+)\[.*\]\s*=/g;
      let simpleMatch;
      while ((simpleMatch = simpleMutationPattern.exec(content)) !== null) {
        const varName = simpleMatch[1];
        // Check if this variable is from useState
        const isStateVar = stateVars.includes(varName);
        // Check if it's in a function parameter (exclude)
        const beforeMatch = content.substring(0, simpleMatch.index);
        const isInFunctionParam = /function\s+\w+\s*\([^)]*\b${varName}\b/.test(beforeMatch) ||
                                   /\([^)]*\b${varName}\b/.test(beforeMatch);
        
        if (isStateVar && !isInFunctionParam) {
          // Check if it's a spread operator (exclude)
          const line = content.substring(0, simpleMatch.index).split(/\r?\n/).pop() + 
                      content.substring(simpleMatch.index, simpleMatch.index + 50);
          if (!/\.\.\./.test(line)) {
            hasDirectStateMutation = true;
            break;
          }
        }
      }
    }
  }

  // Violation checks
  if (hasHooks || hasEventHandlers || hasBrowserAPI) {
    if (!isClientComponent) {
      violations.push({
        type: 'missing-client-directive',
        line: findLineNumber(lines, /export|function|const/),
      });
    }
  }

  if (hasConditionalHook) {
    violations.push({
      type: 'conditional-hook',
      line: findLineNumber(lines, /if.*use[A-Z]/),
    });
  }

  if (hasUseEffect && !hasCleanup && /setInterval|setTimeout|addEventListener/.test(content)) {
    violations.push({
      type: 'missing-cleanup',
      line: findLineNumber(lines, /useEffect/),
    });
  }

  if (hasUseEffectWithoutDeps && !hasUseEffectWithDeps) {
    // This is a warning - useEffect should have dependency array
    violations.push({
      type: 'missing-dependency-array',
      line: findLineNumber(lines, /useEffect/),
    });
  }

  if (hasDirectStateMutation && !hasFunctionalUpdate) {
    violations.push({
      type: 'direct-state-mutation',
      line: findLineNumber(lines, /\[.*\]\s*=/),
    });
  }

  // Performance warnings (not critical)
  // Only flag if computation is expensive and not already memoized
  if (shouldFlagMemoization) {
    violations.push({
      type: 'missing-memoization',
      line: findLineNumber(lines, /\.map\(|\.filter\(|\.reduce\(/),
      severity: 'warning',
    });
  }

  return violations;
}

function findLineNumber(lines, pattern) {
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return undefined;
}

/**
 * Check React patterns
 */
async function checkReactPatterns(files = null) {
  const filesToCheck = files || findReactFiles();
  const violations = [];
  const standardConfig = getStandardConfig('react-patterns');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = analyzeReactPatterns(content, file);

    for (const violation of found) {
      let message;
      let reference =
        'See cleanup.mdc (React Patterns) and development.mdc (Code Quality Requirements)';

      switch (violation.type) {
        case 'missing-client-directive':
          message = 'Component uses hooks or browser APIs but missing "use client" directive';
          break;
        case 'conditional-hook':
          message = 'Hooks should not be called conditionally - move hook call to top level';
          break;
        case 'missing-cleanup':
          message = 'useEffect with timers or event listeners should have cleanup function';
          break;
        case 'missing-dependency-array':
          message = 'useEffect should have dependency array (empty [] if no dependencies)';
          break;
        case 'direct-state-mutation':
          message = 'State should be updated using setState, not direct mutation';
          break;
        case 'missing-memoization':
          message = 'Consider using useMemo/useCallback for expensive computations';
          break;
        default:
          message = 'React pattern violation detected';
      }

      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message,
          severity: violation.severity || standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference,
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All React patterns check passed'
        : `⚠️ ${violations.length} React pattern violation(s) found`,
  };
}

module.exports = {
  name: 'react-patterns',
  check: checkReactPatterns,
};
