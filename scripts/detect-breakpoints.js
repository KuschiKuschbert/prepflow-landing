#!/usr/bin/env node

/**
 * Breakpoint Detection Script
 * Detects all breakpoint usage across the codebase and identifies:
 * - Active breakpoints (used in project)
 * - Unused breakpoints (defined but not used)
 * - Rogue breakpoints (used but not defined)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Breakpoints defined in tailwind.config.ts
const DEFINED_BREAKPOINTS = {
  tablet: '481px',
  desktop: '1025px',
  'large-desktop': '1440px',
  xl: '1920px',
  '2xl': '2560px',
};

// Standard Tailwind breakpoints (disabled but might be used)
const STANDARD_BREAKPOINTS = ['sm', 'md', 'lg'];

// Files to search
const SEARCH_PATTERNS = ['app/**/*.{ts,tsx,js,jsx}', 'components/**/*.{ts,tsx,js,jsx}'];

// Find all files
function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components'];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walkDir(fullPath);
        }
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      walkDir(dir);
    }
  });

  return files;
}

// Extract breakpoint usage from file content
function extractBreakpoints(content) {
  const breakpoints = new Set();

  // Match patterns like: tablet:, desktop:, large-desktop:, xl:, 2xl:
  // Only match in className strings, template literals, or JSX attributes
  // Ignore object keys (e.g., sm: 'h-4 w-4' in Record<string, string>)

  // Strategy: Only match breakpoints that appear in className attributes or template literals
  // Exclude object key patterns like: sm: 'value' or sm: "value"

  // Match breakpoints in className attributes (most common case)
  const classNameBreakpointPattern =
    /(?:className|class)=["'`][^"'`]*(?:tablet|desktop|large-desktop|xl|2xl|sm|md|lg):[^"'`]*["'`]/g;
  let match;
  while ((match = classNameBreakpointPattern.exec(content)) !== null) {
    const breakpointMatch = match[0].match(/\b(tablet|desktop|large-desktop|xl|2xl|sm|md|lg):/);
    if (breakpointMatch) {
      breakpoints.add(breakpointMatch[1]);
    }
  }

  // Match breakpoints in template literals that look like className strings
  // Exclude object key patterns (sm: 'value' or sm: "value")
  const templateLiteralPattern = /`([^`]*(?:tablet|desktop|large-desktop|xl|2xl|sm|md|lg):[^`]*)`/g;
  while ((match = templateLiteralPattern.exec(content)) !== null) {
    const templateContent = match[1];
    // Exclude if it looks like an object key (followed by colon and then a string value)
    if (!templateContent.match(/:\s*['"]/)) {
      // Only include if it looks like a className (contains Tailwind utility classes)
      if (
        templateContent.includes('px-') ||
        templateContent.includes('py-') ||
        templateContent.includes('text-') ||
        templateContent.includes('bg-') ||
        templateContent.includes('flex') ||
        templateContent.includes('rounded') ||
        templateContent.includes('border') ||
        templateContent.includes('hover:') ||
        templateContent.includes('transition')
      ) {
        const breakpointMatch = templateContent.match(
          /\b(tablet|desktop|large-desktop|xl|2xl|sm|md|lg):/,
        );
        if (breakpointMatch) {
          breakpoints.add(breakpointMatch[1]);
        }
      }
    }
  }

  return Array.from(breakpoints);
}

// Main analysis
function analyzeBreakpoints() {
  const files = findFiles();
  const activeBreakpoints = new Set();
  const fileUsage = new Map();
  const rogueBreakpoints = new Set();

  console.log(`\n🔍 Analyzing ${files.length} files for breakpoint usage...\n`);

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const breakpoints = extractBreakpoints(content);

      if (breakpoints.length > 0) {
        fileUsage.set(file, breakpoints);
        breakpoints.forEach(bp => {
          activeBreakpoints.add(bp);
          // Check if it's a rogue breakpoint (standard Tailwind but not in our config)
          if (STANDARD_BREAKPOINTS.includes(bp)) {
            rogueBreakpoints.add(bp);
          }
        });
      }
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
    }
  });

  // Determine unused breakpoints
  const unusedBreakpoints = Object.keys(DEFINED_BREAKPOINTS).filter(
    bp => !activeBreakpoints.has(bp),
  );

  // Remove standard breakpoints from active (they're rogue)
  const validActiveBreakpoints = Array.from(activeBreakpoints).filter(
    bp => !STANDARD_BREAKPOINTS.includes(bp),
  );

  // Generate report
  console.log('='.repeat(80));
  console.log('📊 BREAKPOINT USAGE REPORT');
  console.log('='.repeat(80));

  console.log('\n✅ ACTIVE BREAKPOINTS (Used in project):');
  if (validActiveBreakpoints.length === 0) {
    console.log('   None found');
  } else {
    validActiveBreakpoints.forEach(bp => {
      const px = DEFINED_BREAKPOINTS[bp] || 'N/A';
      const usageCount = Array.from(fileUsage.values())
        .flat()
        .filter(b => b === bp).length;
      console.log(`   • ${bp.padEnd(20)} ${px.padEnd(10)} (used ${usageCount} times)`);
    });
  }

  console.log('\n❌ UNUSED BREAKPOINTS (Defined but not used):');
  if (unusedBreakpoints.length === 0) {
    console.log('   None - all defined breakpoints are in use');
  } else {
    unusedBreakpoints.forEach(bp => {
      const px = DEFINED_BREAKPOINTS[bp];
      console.log(`   • ${bp.padEnd(20)} ${px}`);
    });
  }

  console.log('\n⚠️  ROGUE BREAKPOINTS (Used but not defined - DISABLED):');
  if (rogueBreakpoints.size === 0) {
    console.log('   None found');
  } else {
    Array.from(rogueBreakpoints).forEach(bp => {
      const fileList = Array.from(fileUsage.entries())
        .filter(([_, bps]) => bps.includes(bp))
        .map(([file]) => file)
        .slice(0, 5);
      console.log(`   • ${bp.padEnd(20)} Found in ${fileList.length} file(s)`);
      if (fileList.length > 0) {
        fileList.forEach(file => console.log(`     - ${file}`));
        if (fileList.length === 5) {
          console.log(`     ... and more`);
        }
      }
    });
  }

  console.log('\n📁 BREAKPOINT USAGE BY FILE:');
  console.log(`   Total files using breakpoints: ${fileUsage.size}`);
  if (fileUsage.size > 0) {
    const sortedFiles = Array.from(fileUsage.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);
    sortedFiles.forEach(([file, bps]) => {
      console.log(`   ${file}: ${bps.join(', ')}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('📋 SUMMARY');
  console.log('='.repeat(80));
  console.log(`   Active breakpoints:   ${validActiveBreakpoints.length}`);
  console.log(`   Unused breakpoints:   ${unusedBreakpoints.length}`);
  console.log(`   Rogue breakpoints:    ${rogueBreakpoints.size}`);
  console.log(`   Files using breakpoints: ${fileUsage.size}`);
  console.log('='.repeat(80) + '\n');

  // Return data for potential removal script
  return {
    active: validActiveBreakpoints,
    unused: unusedBreakpoints,
    rogue: Array.from(rogueBreakpoints),
    fileUsage: Object.fromEntries(fileUsage),
  };
}

// Run analysis
if (require.main === module) {
  analyzeBreakpoints();
}

module.exports = { analyzeBreakpoints };
