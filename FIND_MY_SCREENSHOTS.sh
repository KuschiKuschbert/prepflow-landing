#!/bin/bash

# Script to help find and organize your screenshots

echo "🔍 Looking for screenshot files..."
echo ""

# Search common locations
SEARCH_DIRS=(
  "$HOME/Downloads"
  "$HOME/Desktop"
  "$HOME/Documents"
  "$HOME/Pictures"
  "$HOME/Desktop/Screenshots"
  "."
)

for DIR in "${SEARCH_DIRS[@]}"; do
  if [ -d "$DIR" ]; then
    echo "📁 Searching in: $DIR"
    find "$DIR" -maxdepth 2 -name "*.png" -type f -mtime -30 2>/dev/null | while read -r file; do
      basename "$file"
      echo "   └─ $file"
    done
    echo ""
  fi
done

echo "✅ If you see your screenshots above, tell me the full file paths and I'll copy them!"
echo ""
echo "Or if you need to take new screenshots, visit:"
echo "  - http://localhost:3000/webapp/ingredients"
echo "  - http://localhost:3000/webapp/cogs"
echo "  - http://localhost:3000/webapp/cleaning"








