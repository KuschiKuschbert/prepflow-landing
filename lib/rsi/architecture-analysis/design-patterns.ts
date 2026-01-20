import * as fs from 'fs/promises';
import * as path from 'path';
import type { DesignPattern } from './types';

const PATTERNS_FILE = path.join(process.cwd(), 'docs/architecture/design-patterns.json');

/**
 * Detect design patterns in code
 */
export function detectDesignPatterns(content: string, filePath: string): DesignPattern[] {
  const patterns: DesignPattern[] = [];

  // Singleton pattern
  if (/class\s+\w+\s*\{[^}]*private\s+static\s+instance[^}]*getInstance\(\)/.test(content)) {
    patterns.push({
      name: 'Singleton',
      type: 'creational',
      description: 'Ensures a class has only one instance',
      usage: [filePath],
      benefits: ['Single instance', 'Global access'],
      drawbacks: ['Hard to test', 'Tight coupling'],
    });
  }

  // Factory pattern
  if (/class\s+\w+Factory\s*\{/.test(content)) {
    patterns.push({
      name: 'Factory',
      type: 'creational',
      description: 'Creates objects without specifying exact classes',
      usage: [filePath],
      benefits: ['Flexible object creation', 'Decouples creation from usage'],
      drawbacks: ['Can become complex'],
    });
  }

  // Repository pattern
  if (/class\s+\w+Repository\s*\{/.test(content)) {
    patterns.push({
      name: 'Repository',
      type: 'structural',
      description: 'Abstraction layer for data access',
      usage: [filePath],
      benefits: ['Decouples data access', 'Easier testing'],
      drawbacks: ['Additional abstraction layer'],
    });
  }

  // Strategy pattern
  if (/interface\s+\w+Strategy|class\s+\w+Strategy/.test(content)) {
    patterns.push({
      name: 'Strategy',
      type: 'behavioral',
      description: 'Defines family of algorithms, makes them interchangeable',
      usage: [filePath],
      benefits: ['Flexible algorithms', 'Easy to extend'],
      drawbacks: ['More classes'],
    });
  }

  // Observer pattern
  if (
    /\.subscribe\(|\.on\(|addEventListener\(/.test(content) &&
    /\.notify\(|\.emit\(|dispatchEvent\(/.test(content)
  ) {
    patterns.push({
      name: 'Observer',
      type: 'behavioral',
      description: 'One-to-many dependency between objects',
      usage: [filePath],
      benefits: ['Loose coupling', 'Dynamic relationships'],
      drawbacks: ['Memory leaks if not cleaned up'],
    });
  }

  return patterns;
}

/**
 * Load saved design patterns
 */
export async function loadDesignPatterns(): Promise<DesignPattern[]> {
  try {
    const content = await fs.readFile(PATTERNS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}
