## 2025-05-25 - [JSON-LD XSS Injection]
**Vulnerability:** XSS via `dangerouslySetInnerHTML` when embedding structured data in `<script>` tags.
**Learning:** Standard `JSON.stringify` does not escape `<` or `>`. If user-controlled data (like descriptions or titles) contains `</script>`, it terminates the JSON block and allows arbitrary script execution.
**Prevention:** Use the `safeJsonLd` utility in `lib/utils.ts` for all JSON-LD injections. It replaces `<` with `\u003c` which is safe for HTML parsers but valid for JSON-LD readers.
