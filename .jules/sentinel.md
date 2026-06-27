## 2025-05-15 - [Security Enhancement] Unified Bot Protection for Public POST Routes
**Vulnerability:** Public POST endpoints (`/api/opportunities/[id]/vote` and `/api/opportunities/ai-filter`) were exposed to automated abuse and resource exhaustion (expensive AI calls) because they lacked bot detection.
**Learning:** While the project globally integrates `botid` in `next.config.ts`, individual server-side routes that handle state changes or heavy computations must explicitly call `checkBotId()` to verify requests at the application layer.
**Prevention:** Always verify client requests using `checkBotId()` at the beginning of any new public POST route handler to ensure defense-in-depth against automated exploitation.
