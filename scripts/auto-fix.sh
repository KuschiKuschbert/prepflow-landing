#!/bin/bash

# Setup colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

LOG_FILE="docs/TROUBLESHOOTING_LOG.md"

if [ -z "$1" ]; then
    echo "Usage: ./scripts/auto-fix.sh \"<command-to-run>\""
    exit 1
fi

CMD="$1"
OUTPUT_FILE=$(mktemp)

echo -e "${BLUE}🤖 Auto-Fixer: Running command '${CMD}'...${NC}"

# Run command and capture output (both stdout and stderr) to file and console
if eval "$CMD" > "$OUTPUT_FILE" 2>&1; then
    cat "$OUTPUT_FILE"
    echo -e "\n${GREEN}✅ Command succeeded! No fix needed.${NC}"
    rm "$OUTPUT_FILE"
    exit 0
else
    cat "$OUTPUT_FILE"
    echo -e "\n${RED}❌ Command failed. Checking Solution Bank...${NC}"
fi

# Simple heuristic matching
# We read the log file and look for "Symptom" lines.
# If a symptom keyword matches the output in $OUTPUT_FILE, we show the Fix.

FOUND_MATCH=0

# Read the log file line by line looking for Symptoms
# Note: This is a basic parser. For advanced use, we'd use a Node script or Python.
while IFS= read -r line; do
    if [[ "$line" == "**Symptom**"* ]]; then
        # Extract matches: split by colon, take 2nd part, remove backticks, trim whitespace
        SYMPTOM=$(echo "$line" | awk -F': ' '{print $2}' | tr -d '`' | xargs)

        # Debug output (enabled)
        # echo "Checking against known symptom: '$SYMPTOM'"

        # Check if this symptom exists in our command output
        # We use grep -F (fixed string) to avoid regex issues
        if grep -Fq "$SYMPTOM" "$OUTPUT_FILE"; then
            FOUND_MATCH=1
            echo -e "\n${YELLOW}💡 Match Found in Solution Bank!${NC}"
            echo -e "   ${YELLOW}Symptom:${NC} $SYMPTOM"

            # Now we want to show the context/fix for this block
            # Use grep -F -A to print context from the log file safely
            echo -e "${GREEN}🔍 Suggested Fix:${NC}"
            grep -F -A 10 "$line" "$LOG_FILE" | grep -F "**Fix**" -A 5 | head -n 5

            echo -e "\n${BLUE}👉 Verify this fix and try again.${NC}"
        fi
    fi
done < "$LOG_FILE"

rm "$OUTPUT_FILE"

if [ $FOUND_MATCH -eq 0 ]; then
    echo -e "${YELLOW}🤷 No known fix found in $LOG_FILE.${NC}"
    echo "Please debug manually and ADD the solution to the log!"
    exit 1
fi

exit 1
