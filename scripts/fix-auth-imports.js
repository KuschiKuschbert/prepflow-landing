#!/usr/bin/env node
/**
 * Script to replace NextAuth imports with Auth0 SDK imports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { logger } = require('../lib/logger');

const files = execSync(
  `find app/api -name "*.ts" -type f -exec grep -l "from '@/lib/auth-options'" {} \\;`,
  { encoding: 'utf-8' },
)
  .trim()
  .split('\n')
  .filter(Boolean);

logger.dev(`Found ${files.length} files to update`);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');

  // Replace import
  let updated = content.replace(
    /import\s+{\s*authOptions\s*}\s+from\s+['"]@\/lib\/auth-options['"];?\s*\n/g,
    "import { requireAuth } from '@/lib/auth0-api-helpers';\n",
  );

  // Remove getServerSession import if present
  updated = updated.replace(
    /import\s+{\s*getServerSession\s*}\s+from\s+['"]next-auth['"];?\s*\n/g,
    '',
  );

  // Replace getServerSession(authOptions) calls
  updated = updated.replace(
    /const\s+session\s*=\s*await\s+getServerSession\(authOptions\);?\s*\n\s*if\s*\(\s*!session\?\.\s*user\?\.\s*email\s*\)\s*\{/g,
    'const user = await requireAuth(req);\n    if (!user?.email) {',
  );

  // Replace session?.user?.email with user.email
  updated = updated.replace(/session\?\.\s*user\?\.\s*email/g, 'user.email');
  updated = updated.replace(/session\.user\.email/g, 'user.email');

  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf-8');
    logger.dev(`Updated: ${file}`);
  }
});

logger.dev('Done!');
