#!/usr/bin/env bash
set -euo pipefail

UPSTREAM_REPO="victordibia/skyfall"
WORKDIR="${1:-$PWD}"
TARGET_DIR="${WORKDIR}/skyfall"
BRANCH_NAME="feature/orion-coop"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "error: required command '$1' is not installed" >&2
    exit 1
  fi
}

require_cmd git

mkdir -p "$WORKDIR"

if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "Cloning upstream repository into: $TARGET_DIR"
  git clone "https://github.com/${UPSTREAM_REPO}.git" "$TARGET_DIR"
else
  echo "Repository already exists at: $TARGET_DIR"
fi

cd "$TARGET_DIR"

if ! git remote get-url upstream >/dev/null 2>&1; then
  git remote add upstream "https://github.com/${UPSTREAM_REPO}.git"
fi

if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    echo "GitHub CLI authenticated. Attempting fork setup..."
    gh repo fork "$UPSTREAM_REPO" --remote=true --default-branch-only || true
  else
    echo "gh is installed but not authenticated; run: gh auth login"
  fi
else
  echo "gh not installed; fork manually in browser: https://github.com/${UPSTREAM_REPO}"
fi

DEFAULT_BRANCH="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@' || echo master)"

git fetch --all --prune

git checkout "$DEFAULT_BRANCH"
git pull --ff-only origin "$DEFAULT_BRANCH"

if git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
  git checkout "$BRANCH_NAME"
else
  git checkout -b "$BRANCH_NAME"
fi

cat <<MSG

Done.

Next steps:
1) Edit static/js/handcontrol.js to map two players (You + Orion).
2) Test locally:
   pip install -r requirements.txt
   python app.py
3) Commit and push:
   git add .
   git commit -m "Add Orion co-op mode"
   git push -u origin ${BRANCH_NAME}
MSG
