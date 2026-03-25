#!/bin/bash
# Check that every ev-component has a Storybook story
# Exit 0 if all components have stories, exit 1 if any are missing.

COMPONENTS_DIR="src/ev-components"
MISSING=()

for dir in "$COMPONENTS_DIR"/*/; do
  # Skip if not a directory
  [ -d "$dir" ] || continue

  component_name=$(basename "$dir")

  # Check for any .stories.tsx file in the component directory (or subdirectories)
  if ! find "$dir" -name "*.stories.tsx" -print -quit 2>/dev/null | grep -q .; then
    MISSING+=("$component_name")
  fi
done

if [ ${#MISSING[@]} -eq 0 ]; then
  echo "All ev-components have Storybook stories."
  exit 0
else
  echo "ERROR: The following ev-components are missing .stories.tsx files:"
  for name in "${MISSING[@]}"; do
    echo "  - $name"
  done
  echo ""
  echo "${#MISSING[@]} component(s) missing stories."
  exit 1
fi
