import fs from 'fs';
import path from 'path';

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m';

const KB_PATH = path.join(process.cwd(), 'docs/errors/knowledge-base.json');
const AI_RULES_PATH = path.join(process.cwd(), 'docs/AI_RULES.md');
const FIXES_DIR = path.join(process.cwd(), 'docs/errors/fixes');

interface KBEntry {
  id: string;
  errorType: string;
  category: string;
  severity: string;
  pattern: string;
  context: {
    source?: string;
    date?: string;
    file?: string;
    environment?: string;
  };
  fixes: {
    id: string;
    solution: string;
    prevention: string;
    documentedAt: string;
    documentedBy: string;
  }[];
  similarErrors: string[];
  preventionRules: string[];
}

interface KBPattern {
  id: string;
  name: string;
  description: string;
  detection: string;
  fix: string;
  prevention: string;
}

interface KBRule {
  id: string;
  name: string;
  source: string;
  enforcement: string;
}

interface KB {
  version: string;
  lastUpdated: string;
  errors: KBEntry[];
  patterns: KBPattern[];
  rules: KBRule[];
}

function syncFromAiRules(kb: KB) {
  if (!fs.existsSync(AI_RULES_PATH)) return;
  const content = fs.readFileSync(AI_RULES_PATH, 'utf-8');
  const memoryBankMatch = content.match(
    /## 4\. 🧠 Memory Bank \(Lessons Learned\)\n\n([\s\S]*?)\n##/,
  );

  if (memoryBankMatch) {
    const entries = memoryBankMatch[1].split('\n').filter(l => l.trim().startsWith('-'));
    entries.forEach(l => {
      const match = l.match(/- \[(.*?)\] \*\*(.*?)\*\*: (.*)/);
      if (match) {
        const date = match[1];
        const title = match[2];
        const desc = match[3];
        const id = `ERR-RULE-${title.replace(/\s+/g, '-').toUpperCase()}`;

        if (!kb.errors.find(e => e.id === id)) {
          kb.errors.push({
            id,
            errorType: 'BestPractice',
            category: 'Architecture',
            severity: 'Medium',
            pattern: title,
            context: { source: 'AI_RULES.md', date },
            fixes: [
              {
                id: `FIX-${id}`,
                solution: desc,
                prevention: 'Follow AI Rules strictly',
                documentedAt: new Date().toISOString(),
                documentedBy: 'The Documenter',
              },
            ],
            similarErrors: [],
            preventionRules: [],
          });
          console.log(`${GREEN}  + Added rule from AI_RULES: ${title}${NC}`);
        }
      }
    });
  }
}

function syncFromFixes(kb: KB) {
  if (!fs.existsSync(FIXES_DIR)) return;
  const files = fs.readdirSync(FIXES_DIR).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const content = fs.readFileSync(path.join(FIXES_DIR, file), 'utf-8');
    const titleMatch = content.match(/# (.*)/);
    const id = `ERR-FIX-${file.replace('.md', '').toUpperCase()}`;

    if (titleMatch && !kb.errors.find(e => e.id === id)) {
      kb.errors.push({
        id,
        errorType: 'HistoricalFix',
        category: 'Development',
        severity: 'Medium',
        pattern: titleMatch[1],
        context: { file },
        fixes: [
          {
            id: `FIX-${id}`,
            solution: `See docs/errors/fixes/${file}`,
            prevention: 'Check historical fixes before refactoring',
            documentedAt: new Date().toISOString(),
            documentedBy: 'The Documenter',
          },
        ],
        similarErrors: [],
        preventionRules: [],
      });
      console.log(`${GREEN}  + Added fix from ${file}${NC}`);
    }
  });
}

function main() {
  console.log(`${BLUE}📖 The Documenter: Syncing Knowledge Base...${NC}`);

  let kb: KB = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    errors: [],
    patterns: [],
    rules: [],
  };

  if (fs.existsSync(KB_PATH)) {
    kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf-8'));
  }

  syncFromAiRules(kb);
  syncFromFixes(kb);

  kb.lastUpdated = new Date().toISOString();
  fs.writeFileSync(KB_PATH, JSON.stringify(kb, null, 2));
  console.log(`${GREEN}✅ Knowledge Base Sync Complete.${NC}`);
}

main();
