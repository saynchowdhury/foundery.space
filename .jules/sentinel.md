## 2025-06-29 - [JSON-LD XSS Protection]
**Vulnerability:** Cross-Site Scripting (XSS) via `JSON.stringify` in `dangerouslySetInnerHTML`.
**Learning:** Embedding `JSON.stringify` output directly into a `<script>` tag via `dangerouslySetInnerHTML` is dangerous if the data contains `</script>`, `<`, or `>`. Browsers will prioritize the HTML parser over the script context, allowing an attacker to break out of the script tag and inject malicious HTML/JS.
**Prevention:** Always use a helper like `safeJsonLd` to escape `<` and `>` characters (using `\u003c` and `\u003e`) before injecting JSON into a script tag. This ensures the HTML parser does not see any tag boundaries.
