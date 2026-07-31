## 2025-06-15 - [AppliedButton Accessibility & Feedback]
**Learning:** Icon-only buttons (like mobile menus and clear search) require explicit `aria-label` for screen reader accessibility. Immediate visual feedback (toasts) significantly improves the perceived reliability of local state toggles like "Mark as Applied".
**Action:** Always include `aria-label` for `lucide-react` icons inside buttons. Use `sonner` for non-critical state confirmations.
