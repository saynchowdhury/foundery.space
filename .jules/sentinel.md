## 2025-05-24 - [XSS in JSON-LD]
**Vulnerability:** Cross-site scripting (XSS) via script tag breakout in structured data.
**Learning:** Using `JSON.stringify` directly in `dangerouslySetInnerHTML` for `<script>` tags allows attackers to inject their own script tags if the data contains `</script>`.
**Prevention:** Use a utility like `safeJsonLd` to escape `<` and `>` characters (e.g., to `\u003c` and `\u003e`) before injection.
