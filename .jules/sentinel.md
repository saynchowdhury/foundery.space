## 2026-06-02 - JSON-LD XSS Vulnerability
**Vulnerability:** Cross-Site Scripting (XSS) via unescaped JSON-LD structured data in <script> tags.
**Learning:** Using JSON.stringify() to embed data directly into a <script type="application/ld+json"> block via dangerouslySetInnerHTML is unsafe if the data contains "</script>". This allows an attacker to break out of the script block and execute arbitrary JavaScript.
**Prevention:** Always use a utility like safeJsonLd that stringifies data and escapes "<" and ">" characters to their Unicode equivalents (\u003c and \u003e) to prevent script tag breakouts.
