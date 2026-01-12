/**
 * Dependency Analyzer
 * Learns from dependency issues and tracks health
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

export interface DependencyIssue {
  package: string;
  type: 'security' | 'breaking-change' | 'performance' | 'compatibility' | 'unused';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  currentVersion: string;
  recommendedVersion?: string;
  breakingChanges?: string[];
  learnedFrom?: string[]; // Error IDs that taught us about this
}

export interface DependencyHealth {
  package: string;
  version: string;
  healthScore: number; // 0-100
  issues: DependencyIssue[];
  lastUpdated: string;
  updateFrequency: 'frequent' | 'moderate' | 'rare';
  securityVulnerabilities: number;
}

const DEPENDENCY_ISSUES_FILE = path.join(process.cwd(), 'docs/autonomous-developer/dependency-issues.json');
const DEPENDENCY_HEALTH_FILE = path.join(process.cwd(), 'docs/autonomous-developer/dependency-health.json');

/**
 * Load dependency issues
 */
export async function loadDependencyIssues(): Promise<DependencyIssue[]> {
  try {
    const content = await fs.readFile(DEPENDENCY_ISSUES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Save dependency issue
 */
export async function saveDependencyIssue(issue: DependencyIssue): Promise<void> {
  const issues = await loadDependencyIssues();
  issues.push(issue);

  const dir = path.dirname(DEPENDENCY_ISSUES_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DEPENDENCY_ISSUES_FILE, JSON.stringify(issues, null, 2));
}

/**
 * Learn from dependency upgrade errors
 */
export async function learnFromDependencyError(
  packageName: string,
  errorMessage: string,
  errorId: string,
): Promise<void> {
  // Analyze error to determine issue type
  let issueType: DependencyIssue['type'] = 'compatibility';
  let description = errorMessage;

  if (errorMessage.includes('security') || errorMessage.includes('vulnerability')) {
    issueType = 'security';
  } else if (errorMessage.includes('breaking') || errorMessage.includes('incompatible')) {
    issueType = 'breaking-change';
  } else if (errorMessage.includes('performance') || errorMessage.includes('slow')) {
    issueType = 'performance';
  }

  // Check if we already know about this issue
  const existingIssues = await loadDependencyIssues();
  const existingIssue = existingIssues.find(i => i.package === packageName && i.type === issueType);

  if (existingIssue) {
    // Add to learned from
    if (!existingIssue.learnedFrom) {
      existingIssue.learnedFrom = [];
    }
    existingIssue.learnedFrom.push(errorId);
    await saveDependencyIssues(existingIssues);
  } else {
    // Create new issue
    const issue: DependencyIssue = {
      package: packageName,
      type: issueType,
      severity: issueType === 'security' ? 'critical' : 'high',
      description,
      currentVersion: await getPackageVersion(packageName),
      learnedFrom: [errorId],
    };

    await saveDependencyIssue(issue);
  }
}

/**
 * Save all dependency issues
 */
async function saveDependencyIssues(issues: DependencyIssue[]): Promise<void> {
  const dir = path.dirname(DEPENDENCY_ISSUES_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DEPENDENCY_ISSUES_FILE, JSON.stringify(issues, null, 2));
}

/**
 * Get package version
 */
async function getPackageVersion(packageName: string): Promise<string> {
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    return deps[packageName] || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Analyze dependency health
 */
export async function analyzeDependencyHealth(packageName: string): Promise<DependencyHealth> {
  const issues = await loadDependencyIssues();
  const packageIssues = issues.filter(i => i.package === packageName && !i.learnedFrom?.some(id => {
    // Check if issue was resolved
    return false; // Would need to check if errors were fixed
  }));

  const securityIssues = packageIssues.filter(i => i.type === 'security').length;
  const version = await getPackageVersion(packageName);
  const updateFrequency = await getUpdateFrequency(packageName);

  // Calculate health score
  let healthScore = 100;
  healthScore -= securityIssues * 20; // -20 per security issue
  healthScore -= packageIssues.filter(i => i.type === 'breaking-change').length * 15;
  healthScore -= packageIssues.filter(i => i.type === 'performance').length * 10;
  healthScore = Math.max(0, healthScore);

  return {
    package: packageName,
    version,
    healthScore,
    issues: packageIssues,
    lastUpdated: new Date().toISOString(),
    updateFrequency,
    securityVulnerabilities: securityIssues,
  };
}

/**
 * Get update frequency
 */
async function getUpdateFrequency(packageName: string): Promise<DependencyHealth['updateFrequency']> {
  try {
    // Check npm registry for update frequency
    const result = execSync(`npm view ${packageName} time --json`, { encoding: 'utf8', stdio: 'pipe' });
    const timeData = JSON.parse(result);
    const versions = Object.keys(timeData);
    const daysSinceLastUpdate = (Date.now() - new Date(timeData[versions[versions.length - 1]]).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLastUpdate < 30) return 'frequent';
    if (daysSinceLastUpdate < 90) return 'moderate';
    return 'rare';
  } catch {
    return 'moderate';
  }
}

/**
 * Predict breaking changes
 */
export async function predictBreakingChanges(
  packageName: string,
  targetVersion: string,
): Promise<DependencyIssue[]> {
  const issues = await loadDependencyIssues();
  const packageIssues = issues.filter(i => i.package === packageName);

  // Check if we've learned about breaking changes for this package
  const breakingChangeIssues = packageIssues.filter(i => i.type === 'breaking-change');

  if (breakingChangeIssues.length > 0) {
    return breakingChangeIssues.map(issue => ({
      ...issue,
      description: `Predicted breaking change based on ${issue.learnedFrom?.length || 0} previous error(s)`,
    }));
  }

  // Check npm for breaking changes
  try {
    const changelog = execSync(`npm view ${packageName} versions --json`, { encoding: 'utf8', stdio: 'pipe' });
    const versions = JSON.parse(changelog);
    const currentVersion = await getPackageVersion(packageName);
    const currentIndex = versions.indexOf(currentVersion);
    const targetIndex = versions.indexOf(targetVersion);

    if (targetIndex > currentIndex + 5) {
      // Major version jump - likely breaking changes
      return [{
        package: packageName,
        type: 'breaking-change',
        severity: 'high',
        description: `Major version jump from ${currentVersion} to ${targetVersion} - likely breaking changes`,
        currentVersion,
        recommendedVersion: targetVersion,
        breakingChanges: ['Check changelog for breaking changes'],
      }];
    }
  } catch {
    // Can't determine, return empty
  }

  return [];
}

/**
 * Detect unused dependencies
 */
export async function detectUnusedDependencies(): Promise<DependencyIssue[]> {
  const issues: DependencyIssue[] = [];

  try {
    // Use depcheck or similar to detect unused
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Simple heuristic: check if package is imported anywhere
    for (const [pkg, version] of Object.entries(allDeps)) {
      const importPattern = new RegExp(`from\\s+['"]${pkg}|require\\(['"]${pkg}`, 'g');
      
      // Search in common directories
      const searchDirs = ['app', 'components', 'lib', 'scripts'];
      let found = false;

      for (const dir of searchDirs) {
        try {
          const files = await findFiles(dir, /\.(ts|tsx|js|jsx)$/);
          for (const file of files.slice(0, 10)) { // Limit search
            const content = await fs.readFile(file, 'utf8');
            if (importPattern.test(content)) {
              found = true;
              break;
            }
          }
          if (found) break;
        } catch {
          // Directory doesn't exist, skip
        }
      }

      if (!found && !pkg.startsWith('@types/')) {
        issues.push({
          package: pkg,
          type: 'unused',
          severity: 'low',
          description: `Package ${pkg} may be unused`,
          currentVersion: version as string,
        });
      }
    }
  } catch (err) {
    // Error detecting, skip
  }

  return issues;
}

/**
 * Find files recursively
 */
async function findFiles(dir: string, pattern: RegExp): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          files.push(...await findFiles(fullPath, pattern));
        }
      } else if (pattern.test(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist or can't read
  }

  return files;
}

/**
 * Get dependency upgrade recommendations
 */
export interface UpgradeRecommendation {
  package: string;
  currentVersion: string;
  recommendedVersion: string;
  type: 'patch' | 'minor' | 'major';
  risk: 'low' | 'medium' | 'high';
  reason: string;
  breakingChanges?: string[];
}

export async function getUpgradeRecommendations(): Promise<UpgradeRecommendation[]> {
  const recommendations: UpgradeRecommendation[] = [];
  const issues = await loadDependencyIssues();

  // Group by package
  const byPackage = issues.reduce((acc, issue) => {
    if (!acc[issue.package]) acc[issue.package] = [];
    acc[issue.package].push(issue);
    return acc;
  }, {} as Record<string, DependencyIssue[]>);

  for (const [pkg, pkgIssues] of Object.entries(byPackage)) {
    const securityIssues = pkgIssues.filter(i => i.type === 'security');
    const breakingIssues = pkgIssues.filter(i => i.type === 'breaking-change');

    if (securityIssues.length > 0) {
      // Security issues - recommend patch/minor upgrade
      recommendations.push({
        package: pkg,
        currentVersion: pkgIssues[0].currentVersion,
        recommendedVersion: 'latest',
        type: 'patch',
        risk: 'low',
        reason: `${securityIssues.length} security issue(s) detected`,
      });
    } else if (breakingIssues.length === 0) {
      // No breaking changes learned - safe to upgrade
      recommendations.push({
        package: pkg,
        currentVersion: pkgIssues[0].currentVersion,
        recommendedVersion: 'latest',
        type: 'minor',
        risk: 'low',
        reason: 'No breaking changes learned from previous upgrades',
      });
    }
  }

  return recommendations;
}
