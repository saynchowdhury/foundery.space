## 2025-05-15 - [XSS Protection in JSON-LD]
**Vulnerability:** XSS via `JSON.stringify` in `dangerouslySetInnerHTML` for script tags.
**Learning:** Embedding unsanitized JSON directly into `<script type="application/ld+json">` allows script tag breakouts (e.g., `</script><script>alert(1)</script>`).
**Prevention:** Use a `safeJsonLd` utility to escape `<` and `>` as `\u003c` and `\u003e`, which are safe in HTML but valid in JSON.
