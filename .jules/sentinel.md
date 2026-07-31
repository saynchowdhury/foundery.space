# Sentinel's Security Journal

## 2025-05-14 - Bot Protection on Public POST Routes
**Vulnerability:** Public POST routes `/api/opportunities/[id]/vote` and `/api/opportunities/ai-filter` were missing automated abuse protection.
**Learning:** Even if a global `withBotId` configuration exists in `next.config.ts`, individual server routes in this architecture still require explicit `checkBotId()` calls to enforce protection. Missing this on high-value or resource-intensive endpoints leads to vote manipulation and LLM cost risks.
**Prevention:** Always verify that public-facing state-changing or expensive API endpoints call `checkBotId()` at the beginning of the handler.
