#!/bin/bash
# Search for recipes using the existing CLI
# Usage: ./recipe_search.sh <query>

QUERY=$1

if [ -z "$QUERY" ]; then
  echo "🔍 Please provide a search query."
  exit 1
fi

echo "🍳 Searching Recipe Database for '$QUERY'..."
# Using the existing npm script shortcut if available, or direct tsx
npx tsx lib/recipes/cli.ts --search "$QUERY"
