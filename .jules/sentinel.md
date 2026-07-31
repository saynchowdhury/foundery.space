## 2025-05-15 - Inconsistent Bot Protection on Public Endpoints
**Vulnerability:** Public POST endpoints (`/api/opportunities/[id]/vote` and `/api/opportunities/ai-filter`) were missing bot protection, unlike other submission and search endpoints.
**Learning:** Security measures like bot protection are often applied to obvious "entry" points (search, feedback) but can be overlooked on specialized endpoints (voting, AI filtering), leading to inconsistent defense-in-depth.
**Prevention:** Audit all public-facing POST and resource-intensive GET endpoints for consistent application of middleware-like security checks (e.g., `checkBotId`).
