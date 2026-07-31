## 2025-05-15 - Improving Accessibility in Interactive Elements

**Learning:** Interactive elements such as icon-only buttons, search inputs without labels, and state-driven filter buttons often lack proper ARIA attributes (`aria-label`, `aria-expanded`, `aria-pressed`). This makes them inaccessible to screen reader users and obscures their state.

**Action:** Always ensure that:
1. Icon-only buttons have descriptive `aria-label` attributes.
2. Menu toggles include `aria-expanded` to reflect their open/closed state.
3. Filter or toggle buttons use `aria-pressed` to communicate their active state.
4. Input fields without visible labels have `aria-label` or `aria-labelledby`.
