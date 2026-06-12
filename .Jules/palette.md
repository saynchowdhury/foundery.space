## 2025-05-14 - [Applied Status Feedback]
**Learning:** Actions that persist to `localStorage` but don't provide immediate UI feedback can leave users uncertain if the action succeeded.
**Action:** Use toast notifications (e.g., `sonner`) for silent persistence actions to confirm state changes.

## 2025-05-14 - [Cyberpunk Aesthetic Consistency]
**Learning:** In a themed UI (like this "technical" or "cyberpunk" theme), utility buttons that don't match the localized aesthetic (e.g., standard buttons in a terminal-like sidebar) can feel out of place.
**Action:** Provide component variants (e.g., `technical`) that adapt to the surrounding design language while maintaining the same core functionality.

## 2025-05-14 - [Hydration Mismatch in Persistence]
**Learning:** Accessing `localStorage` during the initial render in Next.js causes hydration mismatches.
**Action:** Use a `mounted` state check or `useEffect` to safely access client-side only APIs like `localStorage` and ensure the UI matches the server-side render initially.
