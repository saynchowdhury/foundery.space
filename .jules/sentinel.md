## 2025-05-15 - Prevent XSS in JSON-LD
**Vulnerability:** Embedding `JSON.stringify` output directly into `dangerouslySetInnerHTML` within script tags (e.g., for JSON-LD) creates XSS risks if the data contains `</script>`.
**Learning:** Standard JSON stringification does not escape `<` and `>` which can be used to break out of script tags.
**Prevention:** Use a `safeJsonLd` utility to replace `<` with `\u003c` and `>` with `\u003e` before injecting into the DOM.
