## 2025-05-14 - JSON-LD XSS Vulnerability via Script Breakout
**Vulnerability:** XSS via `</script>` injection in JSON-LD blocks.
**Learning:** Using `JSON.stringify()` inside `dangerouslySetInnerHTML` for `<script type="application/ld+json">` is unsafe because it doesn't escape `<` and `>`, allowing an attacker to close the script tag and inject malicious HTML/JS.
**Prevention:** Always use a utility like `safeJsonLd` that escapes `<` to `\u003c` and `>` to `\u003e`.
