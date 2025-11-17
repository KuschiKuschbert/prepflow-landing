#!/bin/bash

# Script to copy screenshot files to the project
# Usage: ./scripts/copy-screenshots.sh [source_directory]

SOURCE_DIR="${1:-$HOME/Downloads}"
TARGET_DIR="public/images"

echo "Looking for screenshots in: $SOURCE_DIR"
echo "Target directory: $TARGET_DIR"
echo ""

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Source directory not found: $SOURCE_DIR"
  echo "Usage: ./scripts/copy-screenshots.sh [source_directory]"
  exit 1
fi

# Function to copy file if it exists
copy_if_exists() {
  local source_file="$1"
  local target_file="$2"
  local display_name="$3"

  if [ -f "$source_file" ]; then
    cp "$source_file" "$target_file"
    echo "✅ Copied: $display_name"
    return 0
  else
    echo "❌ Not found: $display_name"
    return 1
  fi
}

# Try to find and copy screenshots
echo "Searching for screenshot files..."
echo ""

# Try common file name variations
FOUND=0

# Ingredients Management
if [ -f "$SOURCE_DIR/ingredients-management-screenshot.png" ]; then
  copy_if_exists "$SOURCE_DIR/ingredients-management-screenshot.png" "$TARGET_DIR/ingredients-management-screenshot.png" "Ingredients Management"
  FOUND=$((FOUND + 1))
elif [ -f "$SOURCE_DIR/ingredients.png" ]; then
  copy_if_exists "$SOURCE_DIR/ingredients.png" "$TARGET_DIR/ingredients-management-screenshot.png" "Ingredients Management (from ingredients.png)"
  FOUND=$((FOUND + 1))
elif [ -f "$SOURCE_DIR/Screenshot"*"ingredients"*.png ]; then
  FILE=$(ls "$SOURCE_DIR"/Screenshot*ingredients*.png 2>/dev/null | head -1)
  if [ -n "$FILE" ]; then
    copy_if_exists "$FILE" "$TARGET_DIR/ingredients-management-screenshot.png" "Ingredients Management (from Screenshot)"
    FOUND=$((FOUND + 1))
  fi
fi

# COGS Calculator
if [ -f "$SOURCE_DIR/cogs-calculator-screenshot.png" ]; then
  copy_if_exists "$SOURCE_DIR/cogs-calculator-screenshot.png" "$TARGET_DIR/cogs-calculator-screenshot.png" "COGS Calculator"
  FOUND=$((FOUND + 1))
elif [ -f "$SOURCE_DIR/cogs.png" ]; then
  copy_if_exists "$SOURCE_DIR/cogs.png" "$TARGET_DIR/cogs-calculator-screenshot.png" "COGS Calculator (from cogs.png)"
  FOUND=$((FOUND + 1))
elif [ -f "$SOURCE_DIR/Screenshot"*"cogs"*.png ]; then
  FILE=$(ls "$SOURCE_DIR"/Screenshot*cogs*.png 2>/dev/null | head -1)
  if [ -n "$FILE" ]; then
    copy_if_exists "$FILE" "$TARGET_DIR/cogs-calculator-screenshot.png" "COGS Calculator (from Screenshot)"
    FOUND=$((FOUND + 1))
  fi
fi

# Cleaning Roster
if [ -f "$SOURCE_DIR/cleaning-roster-screenshot.png" ]; then
  copy_if_exists "$SOURCE_DIR/cleaning-roster-screenshot.png" "$TARGET_DIR/cleaning-roster-screenshot.png" "Cleaning Roster"
  FOUND=$((FOUND + 1))
elif [ -f "$SOURCE_DIR/cleaning.png" ]; then
  copy_if_exists "$SOURCE_DIR/cleaning.png" "$TARGET_DIR/cleaning-roster-screenshot.png" "Cleaning Roster (from cleaning.png)"
  FOUND=$((FOUND + 1))
elif [ -f "$SOURCE_DIR/Screenshot"*"cleaning"*.png ]; then
  FILE=$(ls "$SOURCE_DIR"/Screenshot*cleaning*.png 2>/dev/null | head -1)
  if [ -n "$FILE" ]; then
    copy_if_exists "$FILE" "$TARGET_DIR/cleaning-roster-screenshot.png" "Cleaning Roster (from Screenshot)"
    FOUND=$((FOUND + 1))
  fi
fi

echo ""
if [ $FOUND -eq 0 ]; then
  echo "❌ No screenshot files found in $SOURCE_DIR"
  echo ""
  echo "Please:"
  echo "  1. Save your screenshots with one of these names:"
  echo "     - ingredients-management-screenshot.png"
  echo "     - cogs-calculator-screenshot.png"
  echo "     - cleaning-roster-screenshot.png"
  echo "  2. Or use names like: ingredients.png, cogs.png, cleaning.png"
  echo "  3. Place them in: $SOURCE_DIR"
  echo "  4. Run this script again"
  echo ""
  echo "Or specify a different source directory:"
  echo "  ./scripts/copy-screenshots.sh /path/to/your/screenshots"
else
  echo "✅ Copied $FOUND screenshot(s)"
  echo ""
  echo "Verifying files..."
  ls -lh "$TARGET_DIR"/*-screenshot.png 2>/dev/null | awk '{print $9, $5}'
fi









