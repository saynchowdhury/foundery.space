## 2026-07-07 - [XSS Prevention in JSON-LD Scripts]
**Vulnerability:** Directly embedding `JSON.stringify()` output into `dangerouslySetInnerHTML` within script tags (specifically for `application/ld+json`) allows for XSS via script tag breakout (e.g., including `</script><script>alert(1)</script>` in a data field).
**Learning:** Standard JSON stringification does not escape `<` and `>` characters, which are problematic when the resulting string is placed directly into a `<script>` tag in an HTML document.
**Prevention:** Use a dedicated utility like `safeJsonLd` that escapes `<` to `\u003c` and `>` to `\u003e` before injecting JSON into script tags.
