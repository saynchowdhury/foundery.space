## 2026-06-03 - [Cross-Site Scripting (XSS) in JSON-LD]
**Vulnerability:** Directly using `JSON.stringify()` on user-influenced data within `<script type="application/ld+json">` tags via `dangerouslySetInnerHTML`.
**Learning:** Even though JSON-LD is data, it resides within a `<script>` tag. An attacker can break out of the script tag by including `</script>` in a text field, followed by malicious JavaScript.
**Prevention:** Always use a utility like `safeJsonLd` that escapes `<` and `>` to their Unicode equivalents (`\u003c` and `\u003e`) before injecting JSON into a `<script>` tag.
