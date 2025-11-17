#!/bin/bash

# Script to help add new screenshots to the project
# This script will help you copy and rename screenshot files

echo "=========================================="
echo "PrepFlow Screenshot Setup"
echo "=========================================="
echo ""
echo "This script will help you add the new screenshots."
echo ""
echo "Required screenshots:"
echo "  1. ingredients-management-screenshot.png"
echo "  2. cogs-calculator-screenshot.png"
echo "  3. cleaning-roster-screenshot.png"
echo ""
echo "If you have these files ready, you can:"
echo "  - Drag and drop them into public/images/ folder"
echo "  - Or use this script to copy them from another location"
echo ""
echo "Current files in public/images/:"
ls -1 public/images/*.png 2>/dev/null | xargs -n1 basename
echo ""

# Check if files already exist
if [ -f "public/images/ingredients-management-screenshot.png" ]; then
  echo "✅ ingredients-management-screenshot.png exists"
else
  echo "❌ ingredients-management-screenshot.png missing"
fi

if [ -f "public/images/cogs-calculator-screenshot.png" ]; then
  echo "✅ cogs-calculator-screenshot.png exists"
else
  echo "❌ cogs-calculator-screenshot.png missing"
fi

if [ -f "public/images/cleaning-roster-screenshot.png" ]; then
  echo "✅ cleaning-roster-screenshot.png exists"
else
  echo "❌ cleaning-roster-screenshot.png missing"
fi

echo ""
echo "To add screenshots manually:"
echo "  1. Take screenshots of:"
echo "     - Ingredients Management page"
echo "     - COGS Calculator page"
echo "     - Cleaning Roster page"
echo "  2. Save them to public/images/ with the exact names above"
echo "  3. Run this script again to verify"








