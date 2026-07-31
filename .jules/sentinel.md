## 2025-06-16 - [Inconsistent Bot Protection on Public POST Endpoints]
**Vulnerability:** Some public POST endpoints (e.g., voting, AI filtering) were missing `checkBotId()` protection, making them susceptible to automated abuse and resource exhaustion.
**Learning:** While `botid` was integrated into the project and used in some endpoints like feedback and submission, it wasn't consistently applied to all public-facing write/compute-heavy endpoints.
**Prevention:** Always call `checkBotId()` from `botid/server` at the beginning of any public POST or resource-intensive route handler.
