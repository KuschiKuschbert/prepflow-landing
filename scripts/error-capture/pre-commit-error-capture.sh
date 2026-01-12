#!/bin/sh

# Pre-commit Error Capture Integration
# Captures errors from pre-commit hooks for learning

ERROR_CAPTURE_SCRIPT="$(dirname "$0")/capture-error.js"
CAPTURED_ERRORS=""

# Function to capture error from a command
capture_error() {
  local check_name="$1"
  local command="$2"
  
  # Run command and capture output
  if ! output=$($command 2>&1); then
    # Command failed, capture the error
    local error_id=$(node "$ERROR_CAPTURE_SCRIPT" pre-commit "$check_name" "$output" 2>/dev/null || echo "")
    if [ -n "$error_id" ]; then
      CAPTURED_ERRORS="${CAPTURED_ERRORS}${CAPTURED_ERRORS:+ }$check_name:$error_id"
      echo "[Error Capture] Captured $check_name error: $error_id"
    fi
    return 1
  fi
  return 0
}

# Capture errors from cleanup checks
if [ -n "$FILTERED_STAGED_FILES" ]; then
  echo "Running cleanup checks on staged files..."
  if ! npm run cleanup:staged 2>&1 | tee /tmp/cleanup-output.txt; then
    CLEANUP_OUTPUT=$(cat /tmp/cleanup-output.txt)
    node "$ERROR_CAPTURE_SCRIPT" pre-commit "Cleanup" "$CLEANUP_OUTPUT" 2>/dev/null || true
  fi
fi

# Capture errors from format checks
if ! npm run format:staged 2>&1 | tee /tmp/format-output.txt; then
  FORMAT_OUTPUT=$(cat /tmp/format-output.txt)
  node "$ERROR_CAPTURE_SCRIPT" pre-commit "Format" "$FORMAT_OUTPUT" 2>/dev/null || true
fi

# If errors were captured, log them (but don't block commit - that's handled by the checks themselves)
if [ -n "$CAPTURED_ERRORS" ]; then
  echo "[Error Capture] Pre-commit errors captured: $CAPTURED_ERRORS"
fi
