## 2025-05-14 - Bot protection for sensitive endpoints
**Vulnerability:** Publicly accessible POST endpoints (/api/opportunities/[id]/vote and /api/opportunities/ai-filter) were missing bot protection, making them susceptible to automated vote manipulation and expensive AI resource exhaustion.
**Learning:** While the app used `botid` for some routes, it wasn't consistently applied to all mutation or high-cost endpoints.
**Prevention:** Always apply bot detection to any endpoint that modifies state or consumes significant external API credits (like LLMs).
