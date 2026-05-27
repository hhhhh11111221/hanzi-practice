#!/usr/bin/env bash
set -euo pipefail

commit_message="${1:-Finalize development snapshot}"
tag_name="${2:-snapshot-$(date +%Y%m%d-%H%M)}"

cd "$(git rev-parse --show-toplevel)"

echo "==> Checking repository"
git status --short --branch

if git status --porcelain | grep -E '(^.. |^\?\? )(.env($|\.)|.*\.pem$|.*\.key$|.*id_ed25519.*|.*id_rsa.*)' >/dev/null; then
  echo "Refusing to continue: possible secret or private key file is present in the worktree."
  echo "Please remove it from the commit or add an ignore rule before finalizing."
  exit 1
fi

echo "==> Staging changes"
git add -A

if git diff --cached --quiet; then
  echo "==> No file changes to commit; tag will point at current HEAD"
else
  echo "==> Creating commit"
  git commit -m "$commit_message"
fi

if git rev-parse -q --verify "refs/tags/$tag_name" >/dev/null; then
  echo "Refusing to continue: tag already exists: $tag_name"
  exit 1
fi

echo "==> Creating tag $tag_name"
git tag -a "$tag_name" -m "Snapshot ${tag_name#snapshot-}"

echo "==> Pushing branch"
git push

echo "==> Pushing tag"
git push origin "$tag_name"

echo "==> Final status"
git status --short --branch
git log --oneline --decorate -1
echo "Finalized with tag: $tag_name"
