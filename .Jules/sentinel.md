# Sentinel's Journal - Critical Security Learnings

## 2025-06-03 - [XSS in JSON-LD structured data]
**Vulnerability:** Embedding `JSON.stringify` output directly into `dangerouslySetInnerHTML` within script tags (e.g., for JSON-LD) creates XSS risks because `JSON.stringify` does not escape `<` and `>` characters.
**Learning:** Malicious data (from scraped sources or user input) can break out of the `<script>` tag using `</script><script>alert(1)</script>`.
**Prevention:** Use a dedicated `safeJsonLd` utility that replaces `<` with `\u003c` and `>` with `\u003e` after stringification.

## 2025-06-03 - [Bot protection on public POST routes]
**Vulnerability:** Publicly accessible POST routes without bot protection are susceptible to automated abuse, such as vote manipulation or resource exhaustion (LLM costs).
**Learning:** Routes like `/api/opportunities/[id]/vote` and `/api/opportunities/ai-filter` were unprotected.
**Prevention:** Integrate `checkBotId()` from `botid/server` in all public POST endpoints to identify and block automated traffic.
