## 2026-06-21 - [ARIA Labels for Icon-Only Buttons]
**Learning:** Icon-only buttons (mobile menu, search clear) lacked descriptive labels, making them inaccessible to screen readers. Additionally, stateful toggles like the mobile menu should use `aria-expanded` to communicate current state.
**Action:** Always audit for icon-only buttons and provide `aria-label`. Use `aria-expanded` for toggles.

## 2026-06-21 - [Navigation Breakpoint Constraints]
**Learning:** The navigation layout has a visibility gap on medium-sized screens (768px to 1024px) because the mobile toggle is hidden at `md` but the desktop menu only appears at `lg`. However, changing the breakpoint to `lg` is a significant layout change that requires broader validation.
**Action:** Document the visibility gap but prioritize non-breaking accessibility improvements first.
