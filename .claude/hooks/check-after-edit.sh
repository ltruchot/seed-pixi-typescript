#!/usr/bin/env bash
# PostToolUse hook (Edit|Write|MultiEdit): after a TS/JS/CSS/HTML/JSON/MD edit,
# format + lint + type check the file (`vp check --fix <file>`); for a game
# source or unit test, also run that game's unit tests.
# Exit 2 sends the output back to Claude.
set -uo pipefail

file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path??"")}catch{}})')
case "$file" in
  *.ts | *.js | *.css | *.html | *.json | *.md | *.yaml) ;;
  *) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
cd "$root" || exit 0
rel="${file#"$root"/}"
case "$rel" in
  /* | node_modules/* | */node_modules/* | .claude/skills/pixijs*) exit 0 ;;
esac

if ! out=$(vp check --fix "$rel" 2>&1); then
  printf 'vp check --fix %s failed:\n%s\n' "$rel" "$out" >&2
  exit 2
fi

case "$rel" in
  apps/*/src/*.ts | apps/*/tests/*.ts)
    app="${rel%%/src/*}" app="${app%%/tests/*}"
    if ! out=$(vp -C "$app" test 2>&1); then
      printf 'Checked %s, but the unit tests of %s fail:\n%s\n' "$rel" "$app" "$out" >&2
      exit 2
    fi
    ;;
esac
exit 0
