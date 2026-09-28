#!/usr/bin/env bash
# Post-deploy verification for bouldhq.com.
#
# Runs the SEO checks that are easy to get wrong and impossible to notice by
# looking at the site: canonicals pointing at the wrong origin, a share card
# that silently lost its image, redirects that 404 instead of 308, structured
# data that stopped emitting. Works against localhost, a Vercel preview, or
# production.
#
#   ./scripts/verify.sh http://localhost:3000
#   ./scripts/verify.sh https://bouldhq-web-xxxx.vercel.app
#   ./scripts/verify.sh https://bouldhq.com
#
# Exits non-zero if any check fails, so it can gate a promotion to production.

set -uo pipefail

BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"
FAILED=0

pass() { printf '  \033[32m✓\033[0m %s\n' "$1"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; FAILED=1; }

# Reachability first. Without this, an origin that is simply not running
# produces forty identical "returned 000" failures and buries the real problem,
# which is that there is no server.
probe=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$BASE/")
if [ "$probe" = "000" ]; then
  echo "Nothing responded at $BASE."
  echo
  echo "  Start the site first, or use the one-shot runner:"
  echo "    npm run verify"
  echo
  echo "  Running it by hand takes two terminals, because 'next start' blocks:"
  echo "    npm run build && npm start -- -p 3000    # terminal 1"
  echo "    ./scripts/verify.sh http://localhost:3000  # terminal 2"
  exit 2
fi

# A Vercel preview may sit behind Deployment Protection. Detect that early:
# every check below would otherwise fail against a login page.
if [ "$probe" = "401" ] || [ "$probe" = "403" ]; then
  echo "Deployment is protected (HTTP $probe)."
  echo "Either disable Deployment Protection for this preview, or run:"
  echo "  vercel curl $BASE/   # authenticates with your Vercel session"
  exit 2
fi

echo "Verifying $BASE"
# Printed first, so a run against a stale server is obvious before reading any
# of the results below it.
stamp=$(curl -sL "$BASE/" | grep -o 'name="build-stamp" content="[^"]*"' | sed 's/.*content="//;s/"//')
[ -n "$stamp" ] && echo "Build: $stamp"

echo
echo "Pages return 200 and carry one H1"
for path in / /how-it-works /pricing /visibility-audit /work \
            /work/rubio-brothers-concrete /industries/contractors \
            /web-design-utah-county /about /contact /services/shopify-stores \
            /privacy /terms; do
  body=$(curl -sL -w '\n%{http_code}' "$BASE$path")
  code=$(printf '%s' "$body" | tail -1)
  html=$(printf '%s' "$body" | sed '$d')
  h1s=$(printf '%s' "$html" | grep -o '<h1' | wc -l | tr -d ' ')
  title=$(printf '%s' "$html" | grep -o '<title>[^<]*</title>' | head -1)

  if [ "$code" != "200" ]; then
    fail "$path returned $code"
  elif [ "$h1s" != "1" ]; then
    fail "$path has $h1s <h1> elements (expected exactly 1)"
  elif [ -z "$title" ]; then
    fail "$path has no <title>"
  # The old site's fatal flaw: a title that is only the brand name.
  elif printf '%s' "$title" | grep -qE '<title>(Bould|Bould Inc)</title>'; then
    fail "$path title is the bare brand name"
  else
    pass "$path  ${title}"
  fi
done

echo
echo "Canonicals are absolute and point at the right path"
# Canonicals are built from NEXT_PUBLIC_SITE_URL, which stays production even on
# a preview — and that is correct: a preview must never tell Google it is the
# canonical copy. So the PATH is what gets asserted; a differing origin is a note
# rather than a failure, because on a preview it is the expected state.
for path in / /pricing /work/rubio-brothers-concrete; do
  canon=$(curl -sL "$BASE$path" | grep -o 'rel="canonical" href="[^"]*"' | sed 's/.*href="//;s/"//')
  result=$(BASE="$BASE" WANT="$path" CANON="$canon" python3 -c '
import os, sys
from urllib.parse import urlparse
canon, want, base = os.environ["CANON"], os.environ["WANT"], os.environ["BASE"]
if not canon:
    print("FAIL|no canonical"); sys.exit()
u = urlparse(canon)
if u.scheme not in ("http", "https") or not u.netloc:
    print(f"FAIL|canonical is not absolute: {canon}"); sys.exit()
got = u.path or "/"
if got.rstrip("/") != want.rstrip("/"):
    print(f"FAIL|canonical path is {got}, expected {want}"); sys.exit()
origin = f"{u.scheme}://{u.netloc}"
print(("PASS|" if origin == base.rstrip("/") else "NOTE|") + canon)
')
  case "$result" in
    PASS\|*) pass "$path -> ${result#PASS|}" ;;
    NOTE\|*) printf '  \033[33m·\033[0m %s -> %s (production origin; expected off production)\n' "$path" "${result#NOTE|}" ;;
    *)       fail "$path ${result#FAIL|}" ;;
  esac
done

echo
echo "Share card is present on every page"
for path in / /pricing /visibility-audit /work/rubio-brothers-concrete /about; do
  if curl -sL "$BASE$path" | grep -q 'property="og:image"'; then
    pass "$path has og:image"
  else
    fail "$path is missing og:image"
  fi
done

echo
echo "Structured data parses and carries the business"
curl -sL "$BASE/" | python3 -c '
import sys, re, json
html = sys.stdin.read()
blocks = re.findall(r"<script type=\"application/ld\+json\">(.*?)</script>", html, re.S)
if not blocks:
    print("  MISSING"); sys.exit(1)
found = set()
for b in blocks:
    try:
        data = json.loads(b)
    except json.JSONDecodeError as e:
        print(f"  INVALID JSON: {e}"); sys.exit(1)
    for node in data.get("@graph", [data]):
        t = node.get("@type")
        for one in (t if isinstance(t, list) else [t]):
            found.add(one)
        if one == "ProfessionalService" or "ProfessionalService" in (t or []):
            if not node.get("telephone"):
                print("  ProfessionalService has no telephone"); sys.exit(1)
            if not node.get("areaServed"):
                print("  ProfessionalService has no areaServed"); sys.exit(1)
print("  types:", ", ".join(sorted(found)))
' && pass "homepage JSON-LD valid" || fail "homepage JSON-LD invalid or incomplete"

echo
echo "Old Shopify URLs redirect (308), not 404"
check_redirect() {
  got=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$BASE$1")
  code=${got%% *}
  target=${got#* }
  if [ "$code" = "308" ] || [ "$code" = "301" ]; then
    case "$target" in
      *"$2") pass "$1 -> $2" ;;
      *) fail "$1 redirects to $target (expected $2)" ;;
    esac
  else
    fail "$1 returned $code (expected a redirect)"
  fi
}
check_redirect /pages/studio /about
check_redirect /pages/build /how-it-works
check_redirect /pages/work /work
check_redirect /pages/contact /contact
check_redirect /pages/joon-distribution /work/joon-distribution
check_redirect /collections/all /work
check_redirect /products/globalheart /
check_redirect /cart /
check_redirect /policies/refund-policy /terms

echo
echo "robots.txt and sitemap.xml"
robots=$(curl -sL "$BASE/robots.txt")
printf '%s' "$robots" | grep -q 'Allow: /' && pass "robots allows crawling" || fail "robots does not allow crawling"
# The brief is explicit that AI crawlers stay allowed; a stray disallow here
# would quietly remove Bould from assistant answers.
if printf '%s' "$robots" | grep -qiE 'GPTBot|ClaudeBot|PerplexityBot|CCBot'; then
  fail "robots.txt blocks an AI crawler (the brief keeps them allowed)"
else
  pass "no AI crawler blocks"
fi
printf '%s' "$robots" | grep -q 'Sitemap:' && pass "robots links the sitemap" || fail "robots has no Sitemap line"

urls=$(curl -sL "$BASE/sitemap.xml" | grep -c '<loc>')
if [ "$urls" -ge 16 ]; then pass "sitemap lists $urls URLs"; else fail "sitemap lists only $urls URLs"; fi

echo
echo "Lead API accepts a valid lead and rejects an invalid one"
ok=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/lead" \
  -H 'Content-Type: application/json' \
  -d '{"source":"contact","name":"Verify","business":"Verify Co","email":"verify@example.com","elapsedMs":9000}')
[ "$ok" = "200" ] && pass "valid lead accepted (200)" || fail "valid lead returned $ok"

bad=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/lead" \
  -H 'Content-Type: application/json' \
  -d '{"source":"contact","name":"","business":"","email":"nope","elapsedMs":9000}')
[ "$bad" = "422" ] && pass "invalid lead rejected (422)" || fail "invalid lead returned $bad"

hp=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/lead" \
  -H 'Content-Type: application/json' \
  -d '{"source":"contact","name":"Bot","business":"B","email":"b@e.com","company_website_confirm":"x","elapsedMs":9000}')
[ "$hp" = "200" ] && pass "honeypot accepted-and-dropped (200)" || fail "honeypot returned $hp"

# A site can look perfectly healthy while filing every lead to a log nobody
# reads. On production that is a silent revenue leak, so it fails the run;
# locally and on previews it is the expected state and only warrants a note.
delivery=$(curl -s "$BASE/api/lead" | grep -o '"delivery":"[^"]*"' | sed 's/.*:"//;s/"//')
if [ "$delivery" = "email" ]; then
  pass "leads are emailed"
elif printf '%s' "$BASE" | grep -q 'bouldhq\.com'; then
  fail "PRODUCTION is log-only — set RESEND_API_KEY and LEAD_TO_EMAIL, leads are reaching nobody"
else
  printf '  \033[33m·\033[0m leads are log-only (set RESEND_API_KEY + LEAD_TO_EMAIL to email them)\n'
fi

echo
if [ "$FAILED" -eq 0 ]; then
  printf '\033[32mAll checks passed.\033[0m\n'
else
  printf '\033[31mSome checks failed.\033[0m\n'
fi
exit "$FAILED"
