#!/bin/bash

# Script to install git hooks

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
GIT_HOOKS_DIR="$PROJECT_ROOT/.git/hooks"
CUSTOM_HOOKS_DIR="$PROJECT_ROOT/.githooks"

echo "🔧 Installing Git hooks..."
echo "=========================="

# Check if .git directory exists
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo "❌ Error: .git directory not found. Are you in a Git repository?"
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p "$GIT_HOOKS_DIR"

# Copy pre-push hook
if [ -f "$CUSTOM_HOOKS_DIR/pre-push" ]; then
  cp "$CUSTOM_HOOKS_DIR/pre-push" "$GIT_HOOKS_DIR/pre-push"
  chmod +x "$GIT_HOOKS_DIR/pre-push"
  echo "✅ Installed pre-push hook"
else
  echo "⚠️  Warning: pre-push hook not found in .githooks/"
fi

echo ""
echo "✅ Git hooks installation complete!"
echo ""
echo "The following hooks have been installed:"
echo "  - pre-push: Runs tests before each push"
echo ""
echo "To bypass hooks temporarily, use: git push --no-verify"
