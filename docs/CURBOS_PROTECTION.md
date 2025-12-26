# Curbos Area Protection

The `app/curbos/` directory is a **protected area** that is **completely excluded from all scans, checks, and optimizations**. Files in this area are tracked in git and will be pushed/committed, but:

- ❌ **Modifications are blocked** by the pre-commit hook
- ❌ **Excluded from ESLint** - No linting checks
- ❌ **Excluded from TypeScript** - No type checking
- ❌ **Excluded from Prettier** - No code formatting
- ❌ **Excluded from file size checks** - No size limit enforcement
- ❌ **Excluded from cleanup scripts** - No code quality checks
- ❌ **Excluded from bundle analysis** - Not included in optimization
- ❌ **Excluded from all pre-commit checks** - Completely bypassed

## How It Works

1. **Pre-commit Hook Protection**: The Husky pre-commit hook automatically checks if any files in `app/curbos/` are being committed
2. **Automatic Blocking**: If curbos files are detected in staged changes, the commit is blocked with a helpful error message
3. **Files Still Tracked**: The files remain tracked in git and will be pushed/committed normally (they just can't be modified)

## Usage

### Check Status

Check if any curbos files have been modified:

```bash
npm run curbos:status
```

Or directly:

```bash
node scripts/protect-curbos.js status
```

### Reset Modified Files

If you've accidentally modified curbos files, reset them to their last committed state:

```bash
npm run curbos:reset
```

Or directly:

```bash
node scripts/protect-curbos.js reset
```

### Unstage Files

If you've accidentally staged curbos files, unstage them:

```bash
npm run curbos:unstage
```

Or directly:

```bash
node scripts/protect-curbos.js unstage
```

## Emergency Bypass

If you **absolutely need** to modify curbos files (emergency only), you can bypass the protection:

```bash
ALLOW_CURBOS_MODIFY=1 git commit -m "Emergency: modify curbos area"
```

**⚠️ Warning**: Only use the bypass in true emergencies. The curbos area should remain untouched during normal development.

## What Gets Protected

All files and directories under `app/curbos/` are protected, including:

- `app/curbos/page.tsx`
- `app/curbos/layout.tsx`
- `app/curbos/components/`
- `app/curbos/modifiers/`
- `app/curbos/stats/`
- `app/curbos/login/`
- `app/curbos/actions.ts`
- `app/curbos/seed-actions.ts`
- Any other files in the curbos directory

## Implementation Details

### Complete Exclusion Configuration

The curbos area is excluded from all tools and checks:

- **ESLint** (`eslint.config.mjs`): Added `**/app/curbos/**` to ignores
- **TypeScript** (`tsconfig.json`): Added `app/curbos` to exclude array
- **Prettier** (`.prettierignore`): Added `app/curbos/` to ignore list
- **File Size Checks** (`scripts/check-file-sizes.js`): Filters out curbos files
- **Cleanup Scripts** (`scripts/cleanup.js`): Filters out curbos files from all checks
- **Pre-commit Hook** (`.husky/pre-commit`): Blocks commits AND filters from checks
- **Bundle Analysis**: Not included in optimization analysis

### Protection Mechanisms

- **Pre-commit Hook**: `.husky/pre-commit` checks for curbos files before allowing commits
- **Protection Script**: `scripts/protect-curbos.js` provides utilities to check and reset curbos files
- **Bypass Mechanism**: Environment variable `ALLOW_CURBOS_MODIFY=1` allows emergency modifications

## Troubleshooting

### "Commit blocked" error

If you see an error about curbos files being blocked:

1. Check what files were modified: `npm run curbos:status`
2. Reset the files: `npm run curbos:reset`
3. Unstage if needed: `npm run curbos:unstage`
4. Try committing again

### Files were accidentally modified

1. Run `npm run curbos:status` to see what changed
2. Run `npm run curbos:reset` to restore files
3. Continue with your normal workflow

### Need to modify curbos files

1. Use the emergency bypass: `ALLOW_CURBOS_MODIFY=1 git commit ...`
2. Document why the modification was necessary
3. Consider if the change should be in a different location
