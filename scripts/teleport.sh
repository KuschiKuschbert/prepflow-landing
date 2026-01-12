#!/bin/bash

# 🌀 The Teleport Script
# Dumps the current context to clipboard for instant AI session switching.

OUTPUT_FILE="teleport_context.txt"

echo "🌀 Initiating Teleport Protocol..."

# 1. Header
echo "# 🌀 Teleport Context Dump" > $OUTPUT_FILE
echo "Use this context to resume work on the current task." >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 2. The Brain (AI Rules)
echo "## 🧠 AI Rules (Source of Truth)" >> $OUTPUT_FILE
cat docs/AI_RULES.md >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 3. Directory Structure (Depth 2)
echo "## 📂 File Structure" >> $OUTPUT_FILE
tree -L 2 -I "node_modules|.next|.git|dist" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 4. Recent Changes (Git Diff)
echo "## 📝 Recent Changes (Staged)" >> $OUTPUT_FILE
git diff --staged >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# 5. Copy to Clipboard (Mac)
cat $OUTPUT_FILE | pbcopy

# Cleanup
rm $OUTPUT_FILE

echo "✨ Teleport Context copied to clipboard!"
echo "👉 Paste into a new AI session to resume instantly."
