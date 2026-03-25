#!/bin/bash
# Check that every ev-component with a __tests__/ directory includes
# at least one call to validateAccessibility.
# Exit 0 if all pass, exit 1 with list of missing.

COMPONENTS_DIR="src/ev-components"
MISSING=()

for dir in "$COMPONENTS_DIR"/*/; do
  [ -d "$dir" ] || continue

  component_name=$(basename "$dir")
  tests_dir="$dir__tests__"

  # Only check components that have a __tests__/ directory
  [ -d "$tests_dir" ] || continue

  # Search for validateAccessibility in any test file
  if ! grep -rql "validateAccessibility" "$tests_dir" 2>/dev/null; then
    MISSING+=("$component_name")
  fi
done

if [ ${#MISSING[@]} -eq 0 ]; then
  echo "All ev-components with tests include validateAccessibility checks."
  exit 0
else
  echo "ERROR: The following ev-components have tests but no validateAccessibility call:"
  for name in "${MISSING[@]}"; do
    echo "  - $name"
  done
  echo ""
  echo "${#MISSING[@]} component(s) missing accessibility tests."
  exit 1
fi
