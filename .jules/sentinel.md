## 2025-05-15 - Prevent XSS in JSON-LD structured data
**Vulnerability:** XSS via JSON-LD injection when using `JSON.stringify` inside `dangerouslySetInnerHTML` for `<script type="application/ld+json">` tags.
**Learning:** If structured data (like blog titles or descriptions) contains `</script>`, it breaks out of the JSON block and can execute arbitrary JS.
**Prevention:** Always use the `safeJsonLd` utility (in `lib/utils.ts`) which escapes `<` and `>` as `\u003c` and `\u003e`.
