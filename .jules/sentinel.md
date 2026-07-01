## 2025-05-15 - [XSS prevention in JSON-LD]
**Vulnerability:** Cross-Site Scripting (XSS) via JSON-LD structured data.
**Learning:** Using `JSON.stringify()` within `dangerouslySetInnerHTML` for script tags is unsafe if the data contains user-controlled strings (like scraped content). `JSON.stringify()` doesn't escape `<` or `>` characters, allowing an attacker to close the script tag and inject malicious scripts (e.g., `</script><script>alert(1)</script>`).
**Prevention:** Use a utility function like `safeJsonLd` that stringifies the object and then replaces `<` and `>` with their Unicode escape sequences (`\u003c` and `\u003e`).
