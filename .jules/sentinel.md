## 2025-06-13 - JSON-LD XSS Prevention
**Vulnerability:** Cross-Site Scripting (XSS) via `dangerouslySetInnerHTML` in JSON-LD `<script>` tags.
**Learning:** Using `JSON.stringify` directly on data containing user-controlled input (like opportunity names or descriptions) inside a `<script>` tag is dangerous. An attacker can inject `</script><script>alert(1)</script>` to break out of the JSON-LD context and execute arbitrary JavaScript.
**Prevention:** Always use the `safeJsonLd` utility function from `lib/utils.ts` instead of `JSON.stringify` for structured data. This function escapes `<` and `>` characters to `\u003c` and `\u003e`, which are safe for the HTML parser but correctly interpreted by JSON parsers and search engines.
