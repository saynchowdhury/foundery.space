## 2025-05-14 - [JSON-LD XSS Prevention]
**Vulnerability:** XSS via `JSON.stringify` in `<script type="application/ld+json">` tags.
**Learning:** Even though JSON-LD is data, when embedded directly into an HTML `<script>` block using `dangerouslySetInnerHTML`, certain characters like `</script>` can cause the browser to exit the script context and execute arbitrary HTML/JS.
**Prevention:** Use a utility like `safeJsonLd` that stringifies the object and escapes `<` and `>` to their Unicode equivalents (`\u003c` and `\u003e`).
