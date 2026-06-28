## 2025-05-15 - [XSS] Unsafe JSON-LD Stringification
**Vulnerability:** Embedding `JSON.stringify` output directly into `dangerouslySetInnerHTML` within script tags (e.g., for JSON-LD) creates XSS risks if any field contains `</script>`.
**Learning:** Standard `JSON.stringify` does not escape `<` or `>` characters. While most data is cleaned, some fields like opportunity descriptions or blog content may contain user-controllable or scraped data that could break out of the script tag.
**Prevention:** Always use a utility like `safeJsonLd` to escape `<` and `>` characters (converting them to `\u003c` and `\u003e`) before injecting JSON into the DOM via `dangerouslySetInnerHTML`.
