## 2025-05-15 - [Native Sharing & Theme Consistency]
**Learning:** Native sharing via Web Share API provides a much better experience on mobile than hardcoded intent URLs, but a robust clipboard fallback is essential for desktop support. When styling components in a system with light/dark mode support, it's critical to use theme-aware CSS variables (e.g., `border-border`, `bg-card`) rather than hardcoded opacities that assume a specific background.
**Action:** Always check `navigator.share` availability first, and prioritize theme-aware utility classes from the existing design system.
