#!/bin/bash

# 🌀 The Teleport Script
# Dumps the current context to clipboard for instant AI session switching.

OUTPUT_FILE="teleport_context.txt"

echo "🌀 Initiating Teleport Protocol..."

# 1. Header
echo "# 🌀 Teleport Context Dump" > $OUTPUT_FILE
echo "Use this context to resume work. Created at $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 2. The Brain (Modular Selection)
echo "## 🧠 AI Rules (Source of Truth)" >> $OUTPUT_FILE
if [[ "$*" == *"--full"* ]]; then
  cat docs/AI_RULES.md >> $OUTPUT_FILE
  cat docs/brain/*.md >> $OUTPUT_FILE
else
  # Default to essential modules
  cat docs/brain/SSOT.md >> $OUTPUT_FILE
  cat docs/brain/LAWS.md >> $OUTPUT_FILE
  echo "> Note: Only essential rules included. Use --full for all rules." >> $OUTPUT_FILE
fi
echo "" >> $OUTPUT_FILE

# 3. Directory Structure (Filtered)
echo "## 📂 File Structure" >> $OUTPUT_FILE
tree -L 2 -I "node_modules|.next|.git|dist|public|assets" --dirsfirst >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 4. Recent Changes (Smart Diff)
echo "## 📝 Recent Changes (Staged)" >> $OUTPUT_FILE
git diff --staged --stat >> $OUTPUT_FILE  # Add stat for overview
echo "---" >> $OUTPUT_FILE
git diff --staged >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 5. Recent Dev Logs (Last 3)
echo "## 📝 Recent Dev History" >> $OUTPUT_FILE
tail -n 15 docs/DEV_LOG.md >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 6. Copy to Clipboard (Mac)
cat $OUTPUT_FILE | pbcopy

# Cleanup
rm $OUTPUT_FILE

echo "✨ Teleport Context (Optimized) copied to clipboard!"
echo "👉 Essential context only. Use --full for complete brain dump."
