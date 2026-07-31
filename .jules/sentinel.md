## 2026-07-03 - [Bot Protection Gap in Public POST Routes]
**Vulnerability:** Public POST routes (`/api/opportunities/[id]/vote`, `/api/opportunities/ai-filter`) were missing bot detection, leaving them vulnerable to automated abuse (vote manipulation, LLM resource exhaustion).
**Learning:** While `botid` is globally integrated via `withBotId` in `next.config.ts`, individual server routes still require explicit calls to `checkBotId()` to identify and block automated traffic on specific sensitive endpoints.
**Prevention:** Always verify if public-facing POST routes include `checkBotId()` protection, especially those that trigger expensive operations or manipulate community-ranked data.
