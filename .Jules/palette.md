## 2025-05-15 - [Layered Share Strategy]
**Learning:** Native sharing via the Web Share API (`navigator.share`) provides the best UX on mobile, but needs a robust fallback chain (Social Intent -> Copy to Clipboard) to work everywhere. Visual feedback (toasts) is essential when falling back to clipboard actions.
**Action:** Implement a three-tier sharing pattern: 1. `navigator.share`, 2. Primary social intent (e.g., X), 3. Clipboard copy with toast.

## 2025-05-15 - [ARIA Labels for Action Buttons]
**Learning:** Buttons with generic labels like "Share" or "Applied" benefit from specific `aria-label` attributes (e.g., "Share [Opportunity Name]") to provide better context for screen reader users in dense interfaces.
**Action:** Always include dynamic, descriptive `aria-label` props on global action components that accept item-specific data.
