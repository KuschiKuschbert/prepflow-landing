# Generated Secrets for .env.local

Run the setup script to automatically add these to your .env.local:

```bash
bash scripts/setup-env-secrets.sh
```

Or manually add these to your `.env.local` file:

## Required Secrets

### AUTH0_SECRET

Generate with: `openssl rand -hex 32`

### SEED_ADMIN_KEY

Generate with: `openssl rand -hex 32`

### SQUARE_TOKEN_ENCRYPTION_KEY

Generate with: `openssl rand -hex 32`

## Quick Generate Commands

```bash
# Generate all three at once
echo "AUTH0_SECRET=$(openssl rand -hex 32)"
echo "SEED_ADMIN_KEY=$(openssl rand -hex 32)"
echo "SQUARE_TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)"
```

Copy the output and add to your `.env.local` file, replacing the placeholder values.


