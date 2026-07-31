## 2025-05-15 - [Accessibility Audit & Enhancements]
**Learning:** Found several common accessibility patterns that were missing:
1. Icon-only buttons (mobile menu, clear search, close filter, expand region) lacked descriptive ARIA labels.
2. The logo had redundant alt text ("Foundery") immediately followed by the same brand name in text, which causes screen readers to announce it twice.
3. Active navigation states were visual-only and lacked `aria-current="page"`.
4. Interactive toggle buttons (Filter status, Region expansion) lacked state feedback for assistive technologies (aria-pressed, aria-expanded).

**Action:**
1. Always add `aria-label` to icon-only buttons.
2. Set `alt=""` for logos that are immediately followed by brand text.
3. Use `aria-current="page"` for active navigation links.
4. Use `aria-pressed` for filter buttons and `aria-expanded` for collapsible regions.
5. In the Browse page, ensure a clear search button is available when a query exists to improve UX.
