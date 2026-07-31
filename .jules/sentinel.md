## 2025-05-14 - XSS via JSON-LD injection
**Vulnerability:** Cross-Site Scripting (XSS) breakout from `<script type="application/ld+json">` tags when using raw `JSON.stringify` on data containing `</script>` or other HTML tags.
**Learning:** Even though JSON is data, the browser's HTML parser treats everything inside a `<script>` tag as part of the script until it sees `</script>`. If user-controlled data contains `</script><script>alert(1)</script>`, it can break out and execute arbitrary JS.
**Prevention:** Always escape `<` and `>` characters as `\u003c` and `\u003e` when stringifying objects for JSON-LD. Use a dedicated `safeJsonLd` utility instead of raw `JSON.stringify`.
