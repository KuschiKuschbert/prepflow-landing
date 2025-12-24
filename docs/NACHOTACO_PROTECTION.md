# Nachotaco Area Protection

The `app/nachotaco/` directory is a **protected area** that is **completely excluded from all scans, checks, and optimizations**. Files in this area are tracked in git and will be pushed/committed, but:

- ❌ **Modifications are blocked** by the pre-commit hook
- ❌ **Excluded from ESLint** - No linting checks
- ❌ **Excluded from TypeScript** - No type checking
- ❌ **Excluded from Prettier** - No code formatting
- ❌ **Excluded from file size checks** - No size limit enforcement
- ❌ **Excluded from cleanup scripts** - No code quality checks
- ❌ **Excluded from bundle analysis** - Not included in optimization
- ❌ **Excluded from all pre-commit checks** - Completely bypassed

## How It Works

1. **Pre-commit Hook Protection**: The Husky pre-commit hook automatically checks if any files in `app/nachotaco/` are being committed
2. **Automatic Blocking**: If nachotaco files are detected in staged changes, the commit is blocked with a helpful error message
3. **Files Still Tracked**: The files remain tracked in git and will be pushed/committed normally (they just can't be modified)

## Usage

### Check Status

Check if any nachotaco files have been modified:

```bash
npm run nachotaco:status
```

Or directly:

```bash
node scripts/protect-nachotaco.js status
```

### Reset Modified Files

If you've accidentally modified nachotaco files, reset them to their last committed state:

```bash
npm run nachotaco:reset
```

Or directly:

```bash
node scripts/protect-nachotaco.js reset
```

### Unstage Files

If you've accidentally staged nachotaco files, unstage them:

```bash
npm run nachotaco:unstage
```

Or directly:

```bash
node scripts/protect-nachotaco.js unstage
```

## Emergency Bypass

If you **absolutely need** to modify nachotaco files (emergency only), you can bypass the protection:

```bash
ALLOW_NACHOTACO_MODIFY=1 git commit -m "Emergency: modify nachotaco area"
```

**⚠️ Warning**: Only use the bypass in true emergencies. The nachotaco area should remain untouched during normal development.

## What Gets Protected

All files and directories under `app/nachotaco/` are protected, including:

- `app/nachotaco/page.tsx`
- `app/nachotaco/layout.tsx`
- `app/nachotaco/components/`
- `app/nachotaco/modifiers/`
- `app/nachotaco/stats/`
- `app/nachotaco/login/`
- `app/nachotaco/actions.ts`
- `app/nachotaco/seed-actions.ts`
- Any other files in the nachotaco directory

## Implementation Details

### Complete Exclusion Configuration

The nachotaco area is excluded from all tools and checks:

- **ESLint** (`eslint.config.mjs`): Added `**/app/nachotaco/**` to ignores
- **TypeScript** (`tsconfig.json`): Added `app/nachotaco` to exclude array
- **Prettier** (`.prettierignore`): Added `app/nachotaco/` to ignore list
- **File Size Checks** (`scripts/check-file-sizes.js`): Filters out nachotaco files
- **Cleanup Scripts** (`scripts/cleanup.js`): Filters out nachotaco files from all checks
- **Pre-commit Hook** (`.husky/pre-commit`): Blocks commits AND filters from checks
- **Bundle Analysis**: Not included in optimization analysis

### Protection Mechanisms

- **Pre-commit Hook**: `.husky/pre-commit` checks for nachotaco files before allowing commits
- **Protection Script**: `scripts/protect-nachotaco.js` provides utilities to check and reset nachotaco files
- **Bypass Mechanism**: Environment variable `ALLOW_NACHOTACO_MODIFY=1` allows emergency modifications

## Troubleshooting

### "Commit blocked" error

If you see an error about nachotaco files being blocked:

1. Check what files were modified: `npm run nachotaco:status`
2. Reset the files: `npm run nachotaco:reset`
3. Unstage if needed: `npm run nachotaco:unstage`
4. Try committing again

### Files were accidentally modified

1. Run `npm run nachotaco:status` to see what changed
2. Run `npm run nachotaco:reset` to restore files
3. Continue with your normal workflow

### Need to modify nachotaco files

1. Use the emergency bypass: `ALLOW_NACHOTACO_MODIFY=1 git commit ...`
2. Document why the modification was necessary
3. Consider if the change should be in a different location
