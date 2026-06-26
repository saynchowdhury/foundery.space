## 2025-05-15 - XSS in JSON-LD Scripts
**Vulnerability:** Cross-Site Scripting (XSS) via script tag breakout in JSON-LD structured data.
**Learning:** Using `dangerouslySetInnerHTML` with `JSON.stringify()` in `<script type="application/ld+json">` is unsafe if the data contains user-controlled strings with `</script>`. Standard JSON stringification does not escape `<` or `>`.
**Prevention:** Implement a `safeJsonLd` utility that performs `JSON.stringify()` and then replaces `<` and `>` with their Unicode escapes (`\u003c` and `\u003e`). Browsers and SEO crawlers correctly parse these escapes.
