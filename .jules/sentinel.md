## 2025-05-15 - XSS via JSON-LD script tags
**Vulnerability:** `JSON.stringify` used in `dangerouslySetInnerHTML` for `<script type="application/ld+json">` tags is vulnerable to XSS. An attacker can break out of the script block using `</script>` if it appears in user-generated or external content.
**Learning:** Next.js `Script` components with `dangerouslySetInnerHTML` do not automatically escape characters that can terminate the script block. Standard `JSON.stringify` does not escape `<` or `>`, which are dangerous in an HTML script context.
**Prevention:** Always use the `safeJsonLd` utility function (from `lib/utils.ts`) instead of `JSON.stringify` when embedding structured data in `<script>` tags to prevent XSS vulnerabilities.
