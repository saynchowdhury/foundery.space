## 2026-06-14 - JSON-LD XSS Prevention
**Vulnerability:** Cross-Site Scripting (XSS) via structured data injection. Raw `JSON.stringify()` output was used in `dangerouslySetInnerHTML` within `<script type="application/ld+json">` tags.
**Learning:** Even though JSON is valid inside script tags, the HTML parser looks for `</script>` tags regardless of whether they are inside a string. This allows an attacker to break out of the script context if they can control any part of the JSON data (e.g., via scraped content or user submissions).
**Prevention:** Always use a utility that escapes angle brackets (`<` and `>`) to their Unicode equivalents (`\u003c` and `\u003e`) when embedding JSON structured data in HTML.
