#!/usr/bin/env bash
# Build, serve, verify, tear down — in one command.
#
#   npm run verify
#
# Exists because the obvious incantation is a trap: `npm run build && npx next
# start && ./scripts/verify.sh` never reaches the verify step, since `next
# start` blocks forever. Running them as separate lines races the server's
# startup and reports every check as unreachable.

set -uo pipefail

cd "$(dirname "$0")/.."

PORT="${PORT:-3123}"
SERVER_PID=""

cleanup() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null
    wait "$SERVER_PID" 2>/dev/null
  fi
}
trap cleanup EXIT INT TERM

echo "Building..."
if ! npm run build --silent; then
  echo "Build failed — not starting the server." >&2
  exit 1
fi

echo "Starting on port ${PORT}..."
NODE_ENV=production npx next start -p "$PORT" >/tmp/bouldhq-verify-server.log 2>&1 &
SERVER_PID=$!

# Poll rather than sleep: the server is usually up in well under a second, and a
# fixed sleep would either waste time or race it on a cold start.
for _ in $(seq 1 40); do
  if curl -sf "http://localhost:$PORT/" -o /dev/null; then break; fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Server exited during startup. Log:" >&2
    cat /tmp/bouldhq-verify-server.log >&2
    exit 1
  fi
  sleep 0.5
done

./scripts/verify.sh "http://localhost:$PORT"
