import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const type = process.argv[2];
const name = process.argv[3];

if (!type || !name) {
  console.log('Usage: npm run scaffold <type> <name>');
  console.log('Types: component, hook, api-route');
  process.exit(1);
}

const templates = {
  component: {
    path: `components/${name}.tsx`,
    content: `'use client';

import React from 'react';
import { logger } from '@/lib/logger';

interface ${name}Props {
  className?: string;
}

export const ${name}: React.FC<${name}Props> = ({ className }) => {
  return (
    <div className={className}>
      <h1>${name}</h1>
    </div>
  );
};
`,
  },
  hook: {
    path: `hooks/use${name}.ts`,
    content: `import { useState, useCallback } from 'react';

export const use${name} = () => {
  const [data, setData] = useState(null);

  const execute = useCallback(() => {
    // Implementation
  }, []);

  return { data, execute };
};
`,
  },
  'api-route': {
    path: `app/api/${name}/route.ts`,
    content: `import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('API Error in ${name}:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
`,
  },
};

const template = templates[type as keyof typeof templates];
if (!template) {
  console.error(`Unknown type: ${type}`);
  process.exit(1);
}

const fullPath = join(process.cwd(), template.path);
const dir = join(fullPath, '..');

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

if (existsSync(fullPath)) {
  console.error(`File already exists: ${fullPath}`);
  process.exit(1);
}

writeFileSync(fullPath, template.content);
console.log(`✅ Scaffolded ${type} at ${template.path}`);
