#!/bin/bash
# Lists available UI components
# Usage: ./list_components.sh [optional_filter]

FILTER=$1

echo "📚 Searching UI Library..."

if [ -z "$FILTER" ]; then
  find components/ui -name "*.tsx" -not -name "*.test.tsx" | sed 's|components/ui/||' | sed 's|.tsx||' | sort
else
  find components/ui -name "*.tsx" -not -name "*.test.tsx" | grep -i "$FILTER" | sed 's|components/ui/||' | sed 's|.tsx||' | sort
fi
