## 2025-05-15 - Unprotected Public POST Routes
**Vulnerability:** Public POST routes `/api/opportunities/[id]/vote` and `/api/opportunities/ai-filter` were missing bot detection (`checkBotId()`), unlike other sensitive endpoints in the application.
**Learning:** Even if a route doesn't perform a "critical" state change (like voting), missing bot protection allows for automated abuse, resource exhaustion (especially for AI/LLM routes), and data manipulation.
**Prevention:** Audit all public POST routes to ensure they consistently implement `checkBotId()` to prevent automated exploitation and protect expensive resources.
