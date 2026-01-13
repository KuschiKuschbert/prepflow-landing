#!/usr/bin/env node

/**
 * Enhanced Error Capture Script
 * Captures errors from multiple sources: runtime, build, pre-commit, CI/CD
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ERROR_CAPTURE_DIR = path.join(__dirname, '../../.error-capture');
const CAPTURED_ERRORS_FILE = path.join(ERROR_CAPTURE_DIR, 'captured-errors.json');

// Ensure error capture directory exists
if (!fs.existsSync(ERROR_CAPTURE_DIR)) {
  fs.mkdirSync(ERROR_CAPTURE_DIR, { recursive: true });
}

/**
 * Get git information for error context
 */
function getGitContext() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const isDirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;

    return {
      branch,
      commit,
      isDirty,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      branch: 'unknown',
      commit: 'unknown',
      isDirty: false,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get environment information
 */
function getEnvironmentContext() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    platform: process.platform,
    nodeVersion: process.version,
    cwd: process.cwd(),
  };
}

/**
 * Load existing captured errors
 */
function loadCapturedErrors() {
  if (!fs.existsSync(CAPTURED_ERRORS_FILE)) {
    return [];
  }

  try {
    const content = fs.readFileSync(CAPTURED_ERRORS_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[Error Capture] Failed to load captured errors:', err);
    return [];
  }
}

/**
 * Save captured errors
 */
function saveCapturedErrors(errors) {
  try {
    fs.writeFileSync(CAPTURED_ERRORS_FILE, JSON.stringify(errors, null, 2));
  } catch (err) {
    console.error('[Error Capture] Failed to save captured errors:', err);
  }
}

/**
 * Capture an error from any source
 */
function captureError(errorData) {
  const errors = loadCapturedErrors();

  const capturedError = {
    id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: errorData.source, // 'runtime' | 'build' | 'pre-commit' | 'ci-cd'
    errorType: errorData.errorType, // 'TypeScript' | 'ESLint' | 'Runtime' | etc.
    category: errorData.category || 'other',
    severity: errorData.severity || 'medium',
    message: errorData.message,
    stackTrace: errorData.stackTrace,
    context: {
      file: errorData.file,
      line: errorData.line,
      column: errorData.column,
      ...errorData.context,
    },
    git: getGitContext(),
    environment: getEnvironmentContext(),
    capturedAt: new Date().toISOString(),
    status: 'new', // 'new' | 'resolved' | 'documented'
    fixId: null,
  };

  errors.push(capturedError);
  saveCapturedErrors(errors);

  return capturedError.id;
}

/**
 * Capture runtime error from admin_error_logs
 */
async function captureRuntimeError(errorId) {
  try {
    // Import Supabase dynamically to avoid issues if not available
    const { supabaseAdmin } = await import('../../lib/supabase');

    const { data, error } = await supabaseAdmin
      .from('admin_error_logs')
      .select('*')
      .eq('id', errorId)
      .single();

    if (error || !data) {
      console.error('[Error Capture] Failed to fetch runtime error:', error);
      return null;
    }

    return captureError({
      source: 'runtime',
      errorType: 'Runtime',
      category: data.category || 'other',
      severity: data.severity || 'medium',
      message: data.error_message,
      stackTrace: data.stack_trace,
      context: {
        endpoint: data.endpoint,
        userId: data.user_id,
        ...(data.context || {}),
      },
    });
  } catch (err) {
    console.error('[Error Capture] Failed to capture runtime error:', err);
    return null;
  }
}

/**
 * Capture build error from TypeScript/ESLint output
 */
function captureBuildError(errorOutput, errorType = 'Build') {
  // Parse error output to extract structured information
  const lines = errorOutput.split('\n');
  const errors = [];

  let currentError = null;

  for (const line of lines) {
    // TypeScript error pattern: file.ts(line,col): error TS####: message
    const tsMatch = line.match(/^(.+?)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$/);
    if (tsMatch) {
      if (currentError) {
        errors.push(currentError);
      }
      currentError = {
        source: 'build',
        errorType: 'TypeScript',
        category: 'type-error',
        severity: 'high',
        message: tsMatch[5],
        stackTrace: line,
        file: tsMatch[1],
        line: parseInt(tsMatch[2], 10),
        column: parseInt(tsMatch[3], 10),
        context: {
          errorCode: tsMatch[4],
        },
      };
      continue;
    }

    // ESLint error pattern: file.ts:line:col error message (rule)
    const eslintMatch = line.match(/^(.+?):(\d+):(\d+)\s+error\s+(.+?)\s+\((.+?)\)$/);
    if (eslintMatch) {
      if (currentError) {
        errors.push(currentError);
      }
      currentError = {
        source: 'build',
        errorType: 'ESLint',
        category: 'lint-error',
        severity: 'medium',
        message: eslintMatch[4],
        stackTrace: line,
        file: eslintMatch[1],
        line: parseInt(eslintMatch[2], 10),
        column: parseInt(eslintMatch[3], 10),
        context: {
          rule: eslintMatch[5],
        },
      };
      continue;
    }

    // Next.js build error pattern
    const nextjsMatch = line.match(/Error:\s+(.+)$/);
    if (nextjsMatch && !currentError) {
      currentError = {
        source: 'build',
        errorType: 'Next.js',
        category: 'build-error',
        severity: 'high',
        message: nextjsMatch[1],
        stackTrace: line,
      };
    }

    // Append to current error's stack trace
    if (currentError && line.trim()) {
      currentError.stackTrace += '\n' + line;
    }
  }

  if (currentError) {
    errors.push(currentError);
  }

  // Capture all errors
  const capturedIds = errors.map(err => captureError(err));
  return capturedIds;
}

/**
 * Capture pre-commit error
 */
function capturePreCommitError(checkName, errorOutput) {
  return captureError({
    source: 'pre-commit',
    errorType: checkName, // 'Lint' | 'TypeCheck' | 'Format' | 'FileSize'
    category: 'code-quality',
    severity: 'medium',
    message: `Pre-commit check failed: ${checkName}`,
    stackTrace: errorOutput,
    context: {
      checkName,
    },
  });
}

/**
 * Main CLI interface
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'runtime':
      if (args[1]) {
        captureRuntimeError(args[1]).then(id => {
          if (id) {
            console.log(`✅ Captured runtime error: ${id}`);
          }
        });
      } else {
        console.error('Usage: capture-error.js runtime <error-id>');
        process.exit(1);
      }
      break;

    case 'build':
      if (args[1]) {
        const errorOutput = fs.readFileSync(args[1], 'utf8');
        const ids = captureBuildError(errorOutput);
        console.log(`✅ Captured ${ids.length} build error(s): ${ids.join(', ')}`);
      } else {
        // Read from stdin
        let input = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => {
          input += chunk;
        });
        process.stdin.on('end', () => {
          const ids = captureBuildError(input);
          console.log(`✅ Captured ${ids.length} build error(s): ${ids.join(', ')}`);
        });
      }
      break;

    case 'pre-commit':
      if (args[1] && args[2]) {
        const id = capturePreCommitError(args[1], args[2]);
        console.log(`✅ Captured pre-commit error: ${id}`);
      } else {
        console.error('Usage: capture-error.js pre-commit <check-name> <error-output>');
        process.exit(1);
      }
      break;

    case 'list':
      const errors = loadCapturedErrors();
      console.log(`Found ${errors.length} captured errors:`);
      errors.slice(-10).forEach(err => {
        console.log(
          `  - ${err.id}: ${err.source}/${err.errorType} - ${err.message.substring(0, 60)}...`,
        );
      });
      break;

    default:
      console.log(`
Error Capture Script

Usage:
  capture-error.js runtime <error-id>     Capture runtime error from admin_error_logs
  capture-error.js build [file]           Capture build errors (from file or stdin)
  capture-error.js pre-commit <check> <output>  Capture pre-commit error
  capture-error.js list                   List recent captured errors
      `);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  captureError,
  captureRuntimeError,
  captureBuildError,
  capturePreCommitError,
  loadCapturedErrors,
};
