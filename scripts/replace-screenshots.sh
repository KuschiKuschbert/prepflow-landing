#!/bin/bash

# Script to replace old screenshots with new ones
# Run this after adding the new screenshot files

echo "Replacing old screenshots with new ones..."

cd "$(dirname "$0")/.." || exit

# Delete old screenshots
echo "Deleting old screenshots..."
rm -f public/images/recipe-screenshot.png
rm -f public/images/recipe-screenshot.webp
rm -f public/images/recipe-screenshot.avif
rm -f public/images/stocklist-screenshot.png
rm -f public/images/stocklist-screenshot.webp
rm -f public/images/stocklist-screenshot.avif

echo "Old screenshots deleted."
echo ""
echo "New screenshots needed:"
echo "  - public/images/ingredients-management-screenshot.png (and .webp, .avif)"
echo "  - public/images/cogs-calculator-screenshot.png (and .webp, .avif)"
echo "  - public/images/cleaning-roster-screenshot.png (and .webp, .avif)"
echo ""
echo "Files to keep:"
echo "  - public/images/dashboard-screenshot.png (and variants)"
echo "  - public/images/settings-screenshot.png (and variants)"
echo "  - public/images/prepflow-logo.png (and variants)"





