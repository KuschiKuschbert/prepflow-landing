#!/usr/bin/env node

/**
 * Fix Detection Script
 * Monitors admin_error_logs for status changes and detects fixes via git diffs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to import supabase (may not be available in all contexts)
let supabaseAdmin = null;
try {
  const supabaseModule = require('../../lib/supabase');
  supabaseAdmin = supabaseModule.supabaseAdmin;
} catch (err) {
  console.warn('[Fix Detection] Supabase not available:', err.message);
}

const CAPTURED_ERRORS_FILE = path.join(__dirname, '../../.error-capture/captured-errors.json');
const FIXES_FILE = path.join(__dirname, '../../docs/errors/fixes.json');
const LAST_CHECK_FILE = path.join(__dirname, '../../.error-capture/last-fix-check.json');

/**
 * Get git diff for a file
 */
function getGitDiff(filePath, sinceCommit = 'HEAD~1') {
  try {
    const diff = execSync(`git diff ${sinceCommit} HEAD -- "${filePath}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return diff || null;
  } catch (err) {
    // File might not exist or might be new
    return null;
  }
}

/**
 * Get all changed files since a commit
 */
function getChangedFiles(sinceCommit = 'HEAD~1') {
  try {
    const output = execSync(`git diff --name-only ${sinceCommit} HEAD`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (err) {
    return [];
  }
}

/**
 * Extract fix pattern from git diff
 */
function extractFixPattern(diff) {
  const patterns = [];
  
  // Check for common fix patterns
  if (diff.includes('+try {') || diff.includes('+try{')) {
    patterns.push('Added try-catch block');
  }
  
  if (diff.includes('+ApiErrorHandler')) {
    patterns.push('Added ApiErrorHandler');
  }
  
  if (diff.includes('+logger.')) {
    patterns.push('Added error logging');
  }
  
  if (diff.includes('+await ') && diff.includes('-')) {
    patterns.push('Fixed async/await pattern');
  }
  
  if (diff.includes('+:') && diff.match(/\+.*:\s*[a-zA-Z]/)) {
    patterns.push('Added type annotation');
  }
  
  if (diff.includes('+z.')) {
    patterns.push('Added Zod validation');
  }
  
  return patterns;
}

/**
 * Load captured errors
 */
function loadCapturedErrors() {
  if (!fs.existsSync(CAPTURED_ERRORS_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(CAPTURED_ERRORS_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[Fix Detection] Failed to load captured errors:', err);
    return [];
  }
}

/**
 * Load existing fixes
 */
function loadFixes() {
  if (!fs.existsSync(FIXES_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(FIXES_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

/**
 * Save fixes
 */
function saveFixes(fixes) {
  const fixesDir = path.dirname(FIXES_FILE);
  if (!fs.existsSync(fixesDir)) {
    fs.mkdirSync(fixesDir, { recursive: true });
  }
  
  fs.writeFileSync(FIXES_FILE, JSON.stringify(fixes, null, 2));
}

/**
 * Get last check timestamp
 */
function getLastCheck() {
  if (!fs.existsSync(LAST_CHECK_FILE)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(LAST_CHECK_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Save last check timestamp
 */
function saveLastCheck(data) {
  const lastCheckDir = path.dirname(LAST_CHECK_FILE);
  if (!fs.existsSync(lastCheckDir)) {
    fs.mkdirSync(lastCheckDir, { recursive: true });
  }
  
  fs.writeFileSync(LAST_CHECK_FILE, JSON.stringify(data, null, 2));
}

/**
 * Detect fixes from git history
 */
async function detectFixes() {
  const capturedErrors = loadCapturedErrors();
  const existingFixes = loadFixes();
  const lastCheck = getLastCheck();
  
  const fixedErrorIds = new Set(existingFixes.map(fix => fix.errorId));
  const newFixes = [];
  
  // Get recent git commits
  let sinceCommit = 'HEAD~10'; // Check last 10 commits by default
  if (lastCheck && lastCheck.lastCommit) {
    sinceCommit = lastCheck.lastCommit;
  }
  
  try {
    const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const changedFiles = getChangedFiles(sinceCommit);
    
    // For each captured error, check if it might have been fixed
    for (const error of capturedErrors) {
      if (error.status === 'resolved' || error.status === 'documented') {
        continue; // Already resolved
      }
      
      if (fixedErrorIds.has(error.id)) {
        continue; // Already has a fix documented
      }
      
      // Check if error's file was changed
      if (error.context && error.context.file) {
        const errorFile = error.context.file;
        const wasChanged = changedFiles.some(file => file.includes(errorFile) || errorFile.includes(file));
        
        if (wasChanged) {
          // Get git diff for this file
          const diff = getGitDiff(errorFile, sinceCommit);
          
          if (diff) {
            const fixPatterns = extractFixPattern(diff);
            
            if (fixPatterns.length > 0) {
              // Potential fix detected
              const fix = {
                errorId: error.id,
                fixId: `fix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                rootCause: 'Auto-detected from git history',
                solution: `Fix detected: ${fixPatterns.join(', ')}`,
                codeChanges: diff.substring(0, 5000), // Limit size
                preventionStrategies: [
                  'Auto-detected fix pattern - manual review recommended',
                ],
                relatedErrors: [],
                documentedAt: new Date().toISOString(),
                documentedBy: 'system',
                detectedFrom: {
                  file: errorFile,
                  commit: currentCommit,
                  patterns: fixPatterns,
                },
              };
              
              newFixes.push(fix);
              error.status = 'resolved';
            }
          }
        }
      }
    }
    
    // Also check admin_error_logs for resolved errors
    if (supabaseAdmin) {
      try {
        const { data: resolvedErrors, error: dbError } = await supabaseAdmin
          .from('admin_error_logs')
          .select('*')
          .in('status', ['resolved', 'documented'])
          .gte('updated_at', lastCheck ? lastCheck.lastCheck : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        
        if (!dbError && resolvedErrors) {
          for (const dbError of resolvedErrors) {
            if (!fixedErrorIds.has(dbError.id)) {
              // Error was resolved but no fix documented yet
              // Try to detect fix from git history
              if (dbError.endpoint || dbError.context) {
                const errorContext = dbError.context || {};
                const errorFile = errorContext.file || dbError.endpoint;
                
                if (errorFile) {
                  const diff = getGitDiff(errorFile, sinceCommit);
                  
                  if (diff) {
                    const fixPatterns = extractFixPattern(diff);
                    
                    if (fixPatterns.length > 0) {
                      const fix = {
                        errorId: dbError.id,
                        fixId: `fix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        rootCause: dbError.error_message || 'Auto-detected from git history',
                        solution: `Fix detected: ${fixPatterns.join(', ')}`,
                        codeChanges: diff.substring(0, 5000),
                        preventionStrategies: [
                          'Auto-detected fix pattern - manual review recommended',
                        ],
                        relatedErrors: [],
                        documentedAt: new Date().toISOString(),
                        documentedBy: 'system',
                        detectedFrom: {
                          file: errorFile,
                          commit: currentCommit,
                          patterns: fixPatterns,
                        },
                      };
                      
                      newFixes.push(fix);
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('[Fix Detection] Failed to check database errors:', err.message);
      }
    }
    
    // Save new fixes
    if (newFixes.length > 0) {
      const allFixes = [...existingFixes, ...newFixes];
      saveFixes(allFixes);
      
      console.log(`✅ Detected ${newFixes.length} new fix(es)`);
      newFixes.forEach(fix => {
        console.log(`   - ${fix.errorId}: ${fix.solution.substring(0, 60)}...`);
      });
    } else {
      console.log('✅ No new fixes detected');
    }
    
    // Update captured errors
    fs.writeFileSync(CAPTURED_ERRORS_FILE, JSON.stringify(capturedErrors, null, 2));
    
    // Save last check timestamp
    saveLastCheck({
      lastCheck: new Date().toISOString(),
      lastCommit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    });
    
    return newFixes;
  } catch (err) {
    console.error('[Fix Detection] Failed to detect fixes:', err);
    throw err;
  }
}

/**
 * Main CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'detect';
  
  switch (command) {
    case 'detect':
      await detectFixes();
      break;
      
    case 'list':
      const fixes = loadFixes();
      console.log(`Found ${fixes.length} documented fixes:`);
      fixes.slice(-10).forEach(fix => {
        console.log(`  - ${fix.fixId}: ${fix.errorId} - ${fix.solution.substring(0, 60)}...`);
      });
      break;
      
    default:
      console.log(`
Fix Detection Script

Usage:
  detect-fixes.js [command]

Commands:
  detect  Detect fixes from git history (default)
  list    List recent fixes
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = {
  detectFixes,
  loadFixes,
};
