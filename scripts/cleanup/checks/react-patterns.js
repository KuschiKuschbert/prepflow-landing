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
  const useEffectWithoutDepsLines = [];

  if (hasUseEffect) {
    // Find all useEffect call positions
    const useEffectMatches = [];
    const useEffectRegex = /useEffect\s*\(/g;
    let match;
    while ((match = useEffectRegex.exec(content)) !== null) {
      useEffectMatches.push(match.index);
    }

    // For each useEffect, check if it has a dependency array
    // Use line-based approach for better multi-line detection
    for (let i = 0; i < lines.length; i++) {
      if (/useEffect\s*\(/.test(lines[i])) {
        // Found a useEffect, check if it has dependency array
        // Look ahead up to 150 lines for dependency array pattern (increased for very complex useEffects)
        let foundDeps = false;
        const window = lines.slice(i, Math.min(i + 150, lines.length));
        const windowText = window.join('\n');

        // Look for dependency array pattern in multiple ways:
        // 1. }, [deps]) - single line with deps
        // 2. }, [ - multi-line start (deps on following lines)
        // 3. [deps] - on separate line after }
        // 4. }, []) - empty array
        // 5. }, [deps]); - with semicolon
        const hasDepsPattern = /,\s*\[/.test(windowText);
        const hasDepsOnNewLine = window.some((line, idx) => {
          // Check if this line starts with [ and is after a line ending with },
          if (idx > 0 && /^\s*\[/.test(line) && /,\s*$/.test(window[idx - 1])) {
            return true;
          }
          return false;
        });

        // Also check for pattern where }, [ appears and ]) appears later (even across multiple lines)
        const depsStartIndex = windowText.search(/,\s*\[/);
        const depsEndIndex = windowText.search(/\]\s*\)/);
        const hasMultiLineDeps =
          depsStartIndex !== -1 && depsEndIndex !== -1 && depsStartIndex < depsEndIndex;

        if (hasDepsPattern || hasDepsOnNewLine || hasMultiLineDeps) {
          // Verify the dependency array is part of this useEffect (before closing paren)
          // Look for the pattern: }, [ ... ]) or }, [ ... ]); or just [ ... ])
          // Also match }, [] on same line
          const depsMatch = windowText.match(
            /(,\s*\[[^\]]*\]\s*\)|^\s*\[[^\]]*\]\s*\)|,\s*\[\]\s*\))/,
          );
          if (depsMatch) {
            foundDeps = true;
            hasUseEffectWithDeps = true;
          } else {
            // Check for multi-line pattern: }, [ on one line, deps on next lines, ]) on last line
            // Look for }, [ or }, [ followed by ]) later
            const hasMultiLineStart = /,\s*\[/.test(windowText);
            const hasMultiLineEnd = /\]\s*\)/.test(windowText);
            if (hasMultiLineStart && hasMultiLineEnd) {
              // Check if the [ comes before the ])
              const depsStart = windowText.search(/,\s*\[/);
              const depsEnd = windowText.search(/\]\s*\)/);
              if (depsStart !== -1 && depsEnd !== -1 && depsStart < depsEnd) {
                foundDeps = true;
                hasUseEffectWithDeps = true;
              }
            }
          }
        }

        // Additional check: If we found }, [ anywhere and ]) anywhere later, it's likely a dependency array
        // This handles cases where the dependency array is far from the useEffect start
        if (!foundDeps) {
          const commaBracketIndex = windowText.search(/,\s*\[/);
          const bracketParenIndex = windowText.search(/\]\s*\)/);
          if (
            commaBracketIndex !== -1 &&
            bracketParenIndex !== -1 &&
            commaBracketIndex < bracketParenIndex
          ) {
            // Make sure there's a closing brace before the dependency array
            const beforeCommaBracket = windowText.substring(0, commaBracketIndex);
            // Check if there's a } before the , [
            const lastBraceIndex = beforeCommaBracket.lastIndexOf('}');
            if (lastBraceIndex !== -1) {
              // Check if the }, [ pattern is valid (not inside a string or comment)
              const textBetween = windowText.substring(lastBraceIndex, commaBracketIndex + 2);
              if (/}\s*,\s*\[/.test(textBetween)) {
                foundDeps = true;
                hasUseEffectWithDeps = true;
              }
            }
          }
        }

        // Final fallback: If we see }, [ and ]) in the window, and they're in the right order, assume deps exist
        // This catches cases where the pattern matching above missed it
        if (!foundDeps) {
          const hasCommaBracket = /,\s*\[/.test(windowText);
          const hasBracketParen = /\]\s*\)/.test(windowText);
          if (hasCommaBracket && hasBracketParen) {
            const commaBracketPos = windowText.search(/,\s*\[/);
            const bracketParenPos = windowText.search(/\]\s*\)/);
            if (
              commaBracketPos !== -1 &&
              bracketParenPos !== -1 &&
              commaBracketPos < bracketParenPos
            ) {
              // Verify it's not inside a string or comment by checking for } before , [
              const beforeComma = windowText.substring(0, commaBracketPos);
              if (/\}/.test(beforeComma)) {
                foundDeps = true;
                hasUseEffectWithDeps = true;
              }
            }
          }
        }

        // Check if useEffect ends without dependency array
        if (!foundDeps) {
          // Look for end of useEffect: }); or });
          const endMatch = windowText.match(/\}\);?/);
          if (endMatch) {
            // Check if there's a dependency array before the end
            const beforeEnd = windowText.substring(0, endMatch.index);
            // Check for dependency array: , [ or just [ (multi-line)
            // Also check if there's a line that starts with [ after a line ending with },
            const hasDepsBeforeEnd = /,\s*\[/.test(beforeEnd);

            // Check for multi-line dependency array: }, [ on one line, deps on next, ]) on last
            let hasDepsOnSeparateLine = false;
            for (let j = 0; j < window.length - 1; j++) {
              // Check if line j ends with }, and line j+1 starts with [
              if (/,\s*$/.test(window[j].trim()) && /^\s*\[/.test(window[j + 1].trim())) {
                // Check if there's a closing ]) later
                const remaining = window.slice(j + 1).join('\n');
                if (/\]\s*\)/.test(remaining)) {
                  hasDepsOnSeparateLine = true;
                  break;
                }
              }
            }

            // Also check for pattern: }, [deps]) on same line or }, [ on one line, deps on next, ]) on last
            // Improved: Also match }, [] on same line
            const hasDepsPattern =
              /,\s*\[[^\]]*\]\s*\)/.test(windowText) ||
              (/,\s*\[/.test(windowText) && /\]\s*\)/.test(windowText)) ||
              /,\s*\[\]\s*\)/.test(windowText);

            // Additional check: Look for }, [ on any line followed by ]) on any later line
            const hasDepsAnywhere = /,\s*\[/.test(windowText) && /\]\s*\)/.test(windowText);

            if (
              !hasDepsBeforeEnd &&
              !hasDepsOnSeparateLine &&
              !hasDepsPattern &&
              !hasDepsAnywhere
            ) {
              // Check for eslint-disable comment
              const contextLines = lines
                .slice(Math.max(0, i - 3), Math.min(i + 50, lines.length))
                .join('\n');
              const hasEslintDisable =
                /eslint-disable.*exhaustive-deps|eslint-disable-next-line.*exhaustive-deps/.test(
                  contextLines,
                );
              if (!hasEslintDisable) {
                useEffectWithoutDepsLines.push(i + 1);
                hasUseEffectWithoutDeps = true;
              }
            }
          }
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
  const hasChainedOperations = /\.(map|filter|reduce)\([^)]*\)\.(map|filter|reduce|sort)\(/.test(
    content,
  );

  // Check if the expensive computation is already wrapped in useMemo/useCallback
  // Look for useMemo/useCallback patterns that wrap the expensive computation
  const hasMemoizedComputationWrapper =
    /useMemo\s*\([^)]*=>\s*\{[^}]*\.(map|filter|reduce|sort|find|some|every)/.test(content) ||
    /useCallback\s*\([^)]*=>\s*\{[^}]*\.(map|filter|reduce|sort|find|some|every)/.test(content);

  // Check if the computation is inside a useMemo/useCallback by looking at line context
  // Improved: Use line-based detection for better accuracy
  let isAlreadyMemoized = false;

  // Also check for constant arrays (UPPER_CASE variables) - these don't need memoization
  // Pattern: UPPER_CASE_VAR.map(...) or {UPPER_CASE_VAR.map(...)}
  const hasConstantArray = /[A-Z_][A-Z0-9_]*\s*\.(map|filter|reduce|sort)/.test(content);

  if (hasExpensiveComputation) {
    // For each line with expensive operations, check if it's within a useMemo/useCallback
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/\.(map|filter|reduce|sort|find|some|every)\s*\(/.test(line)) {
        // Found an expensive operation, check if it's within useMemo/useCallback
        // Look backwards up to 30 lines for useMemo/useCallback declaration
        let foundMemo = false;
        let braceCount = 0;
        let inMemoBlock = false;

        for (let j = i; j >= Math.max(0, i - 30); j--) {
          const prevLine = lines[j];

          // Check if this line starts a useMemo/useCallback
          if (/useMemo\s*\(|useCallback\s*\(/.test(prevLine)) {
            // Found useMemo/useCallback, check if we're still in its block
            // Count braces from this line to the current line
            braceCount = 0;
            for (let k = j; k <= i; k++) {
              const countLine = lines[k];
              const openBraces = (countLine.match(/\{/g) || []).length;
              const closeBraces = (countLine.match(/\}/g) || []).length;
              braceCount += openBraces - closeBraces;

              // Check if we've closed the useMemo/useCallback (ends with ])
              if (k > j && /\]\s*\)/.test(countLine) && braceCount <= 0) {
                // We've reached the end of useMemo/useCallback
                break;
              }
            }

            // If braceCount > 0, we're still in the useMemo/useCallback block
            if (braceCount > 0 || /\]\s*\)/.test(lines[i])) {
              foundMemo = true;
              break;
            }
          }
        }

        if (foundMemo) {
          isAlreadyMemoized = true;
          break;
        }
      }
    }
  }

  // Also check for simple .map() in JSX (not expensive - just rendering)
  // Pattern: {array.map(...)} or {array?.map(...)} in JSX context
  // Exclude if it's already in useMemo/useCallback
  let hasSimpleJSXMap = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if line has .map() or .filter() in JSX context (starts with { or contains =>)
    if (/[\{\(]|=>/.test(line) && /\.(map|filter)\s*\([^)]*\)\s*=>/.test(line)) {
      // Check if this is NOT within a useMemo/useCallback
      let inMemo = false;
      for (let j = i; j >= Math.max(0, i - 20); j--) {
        if (/useMemo\s*\(|useCallback\s*\(/.test(lines[j])) {
          inMemo = true;
          break;
        }
      }
      if (!inMemo) {
        hasSimpleJSXMap = true;
        break;
      }
    }
  }

  // Check if operations are in useEffect for logging (not expensive)
  const hasLoggingInEffect = /useEffect\s*\([^}]*\.(map|filter)\s*\([^}]*logger/.test(content);

  // Check if operations are in setState callbacks (optimistic updates, fine)
  const hasSetStateCallback = /set\w+\s*\([^)]*=>\s*[^}]*\.(map|filter)/.test(content);

  // Check if operations are in print/export functions (happens once, not expensive)
  const hasPrintExport = /print|export|generatePrint|formatForPrint/.test(content.toLowerCase());

  // Only flag if:
  // 1. Has expensive computation (multiple operations or chained)
  // 2. Not already memoized (either by wrapper or by context)
  // 3. Not in a hook file (hooks can handle memoization internally)
  // 4. Component receives props (memoization is most beneficial with props)
  // 5. Not already wrapped in useMemo/useCallback
  // 6. Not a constant array (UPPER_CASE variables)
  // 7. Not simple JSX rendering (.map in JSX without computation)
  // 8. Not logging operations in useEffect
  // 9. Not setState callbacks (optimistic updates)
  // 10. Not print/export functions (happens once)
  const shouldFlagMemoization =
    hasExpensiveComputation &&
    !hasMemoizedComputation &&
    !isAlreadyMemoized &&
    !isHookFile &&
    hasProps &&
    !hasConstantArray &&
    !hasSimpleJSXMap &&
    !hasLoggingInEffect &&
    !hasSetStateCallback &&
    !hasPrintExport &&
    (hasChainedOperations || totalArrayOps > 2);

  // Check for proper state updates
  // Improved detection: Only flag actual state mutations, not helper function operations
  // Strategy: Check if mutation is on a variable that comes from useState destructuring

  let hasDirectStateMutation = false;
  const hasFunctionalUpdate = /set\w+\(.*prev/.test(content);

  if (/useState/.test(content)) {
    // Find all useState declarations: const [varName, setVarName] = useState(...)
    const useStateMatches = content.match(/const\s+\[(\w+),\s*set\w+\]\s*=\s*useState/g) || [];
    const stateVars = useStateMatches
      .map(m => {
        const varMatch = m.match(/\[(\w+),/);
        return varMatch ? varMatch[1] : null;
      })
      .filter(Boolean);

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
        const functionParamPattern = new RegExp(`function\\s+\\w+\\s*\\([^)]*\\b${varName}\\b`);
        const arrowParamPattern = new RegExp(`\\([^)]*\\b${varName}\\b`);
        const isInFunctionParam =
          functionParamPattern.test(beforeMatch) || arrowParamPattern.test(beforeMatch);

        if (isStateVar && !isInFunctionParam) {
          // Check if it's a spread operator (exclude)
          const line =
            content.substring(0, simpleMatch.index).split(/\r?\n/).pop() +
            content.substring(simpleMatch.index, simpleMatch.index + 50);
          if (!/\.\.\./.test(line)) {
            hasDirectStateMutation = true;
            break;
          }
        }
      }
    }
  }

  // Exclude root layout.tsx from "use client" check (it's a server component)
  const isRootLayout =
    filePath.includes('app/layout.tsx') && !filePath.includes('app/webapp/layout.tsx');

  // Violation checks
  if ((hasHooks || hasEventHandlers || hasBrowserAPI) && !isClientComponent && !isRootLayout) {
    violations.push({
      type: 'missing-client-directive',
      line: findLineNumber(lines, /export|function|const/),
    });
  }

  if (hasConditionalHook) {
    violations.push({
      type: 'conditional-hook',
      line: findLineNumber(lines, /if.*use[A-Z]/),
    });
  }

  // Improved cleanup detection: Only flag if setTimeout/setInterval/addEventListener are actually IN a useEffect
  // Check each useEffect individually to see if it contains timers/listeners
  if (hasUseEffect) {
    const useEffectBlocks = [];
    for (let i = 0; i < lines.length; i++) {
      if (/useEffect\s*\(/.test(lines[i])) {
        // Find the end of this useEffect
        let braceCount = 0;
        let inUseEffect = false;
        let useEffectStart = i;
        let useEffectEnd = i;

        for (let j = i; j < Math.min(i + 100, lines.length); j++) {
          const line = lines[j];
          // Count braces to find the end of useEffect
          const openBraces = (line.match(/\{/g) || []).length;
          const closeBraces = (line.match(/\}/g) || []).length;

          if (line.includes('useEffect')) {
            inUseEffect = true;
            braceCount += openBraces;
          }

          if (inUseEffect) {
            braceCount += openBraces - closeBraces;
            if (braceCount === 0 && /\}\);?/.test(line)) {
              useEffectEnd = j;
              break;
            }
          }
        }

        // Extract this useEffect block
        const useEffectBlock = lines.slice(useEffectStart, useEffectEnd + 1).join('\n');
        useEffectBlocks.push({ start: useEffectStart + 1, block: useEffectBlock });
      }
    }

    // Check each useEffect block for timers/listeners and cleanup
    for (const { start, block } of useEffectBlocks) {
      const hasTimerInBlock = /setTimeout|setInterval/.test(block);
      const hasListenerInBlock = /addEventListener/.test(block);
      const hasCleanupInBlock = /return\s+\([^)]*\)\s*=>|return\s+function|return\s+\(\)\s*=>/.test(
        block,
      );

      if ((hasTimerInBlock || hasListenerInBlock) && !hasCleanupInBlock) {
        // Check for eslint-disable comment
        const contextStart = Math.max(0, start - 3);
        const contextEnd = Math.min(start + 50, lines.length);
        const contextLines = lines.slice(contextStart, contextEnd).join('\n');
        const hasEslintDisable =
          /eslint-disable.*exhaustive-deps|eslint-disable-next-line.*exhaustive-deps/.test(
            contextLines,
          );

        if (!hasEslintDisable) {
          violations.push({
            type: 'missing-cleanup',
            line: start,
          });
        }
      }
    }
  }

  // Only flag if we're confident there's a useEffect without dependency array
  if (hasUseEffectWithoutDeps && useEffectWithoutDepsLines.length > 0) {
    // Use the lines we already identified
    for (const lineNum of useEffectWithoutDepsLines) {
      violations.push({
        type: 'missing-dependency-array',
        line: lineNum,
      });
    }
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
