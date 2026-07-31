## 2025-05-14 - JSON-LD XSS Prevention
**Vulnerability:** XSS via JSON-LD structured data injection. Directly using `JSON.stringify` in `dangerouslySetInnerHTML` within a `<script type="application/ld+json">` tag allows attackers to break out of the script context using `</script>` tags in database content.
**Learning:** Standard JSON stringification does not escape HTML-sensitive characters like `<` and `>`, which are interpreted by the browser's HTML parser even inside script tags when using `dangerouslySetInnerHTML`.
**Prevention:** Use the `safeJsonLd` utility (or similar) to escape `<` and `>` to their Unicode equivalents (`\u003c` and `\u003e`) when embedding JSON in HTML script tags.
