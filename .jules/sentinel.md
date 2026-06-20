## 2025-05-26 - Missing Bot Protection on Public Write/Resource-Intensive Endpoints
**Vulnerability:** The `vote` and `ai-filter` endpoints were exposed to automated abuse. The `vote` endpoint could be manipulated for voter fraud, and the `ai-filter` endpoint could be used for resource exhaustion and LLM API cost attacks.
**Learning:** While most public POST endpoints (`/api/feedback`, `/api/submit`) implemented `checkBotId()`, newer or more specialized endpoints were overlooked, leading to inconsistent security coverage.
**Prevention:** Audit all public-facing POST and search endpoints for `checkBotId()` implementation. Ensure that any endpoint performing database writes or calling expensive external APIs includes bot detection as a standard defensive layer.
