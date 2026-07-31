## 2025-05-15 - XSS Prevention in JSON-LD
**Vulnerability:** Embedding `JSON.stringify` output directly into `dangerouslySetInnerHTML` within script tags (e.g., for JSON-LD) creates XSS risks.
**Learning:** `JSON.stringify` does not escape `<` and `>` characters. If data contains `</script><script>alert(1)</script>`, it can break out of the JSON-LD script block and execute arbitrary code.
**Prevention:** Use the `safeJsonLd` utility in `lib/utils.ts` to escape `<` and `>` as Unicode sequences (`\u003c` and `\u003e`) which JSON parsers understand but browsers don't execute as HTML tags.
