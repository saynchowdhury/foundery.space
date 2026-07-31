## 2026-06-02 - [XSS Protection in JSON-LD]
**Vulnerability:** Cross-Site Scripting (XSS) via structured data in `<script type="application/ld+json">` tags.
**Learning:** Using `JSON.stringify` inside `dangerouslySetInnerHTML` for JSON-LD is dangerous because data containing `</script>` can break out of the script block.
**Prevention:** Use a `safeJsonLd` utility that escapes `<` and `>` as `\u003c` and `\u003e` to prevent script tag injection while remaining valid JSON.
