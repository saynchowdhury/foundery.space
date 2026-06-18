## 2025-05-24 - JSON-LD XSS Prevention
**Vulnerability:** XSS via `<script>` tag breakout in JSON-LD structured data.
**Learning:** `JSON.stringify` does not escape `<` and `>` characters by default. If user-controlled or scraped content contains `</script>`, it can break out of the JSON-LD script block and execute arbitrary JavaScript.
**Prevention:** Always use the `safeJsonLd` utility in `lib/utils.ts` instead of `JSON.stringify` for structured data in React components. It handles `null`/`undefined` and escapes tag markers to `\u003c` and `\u003e`.
