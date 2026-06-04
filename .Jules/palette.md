## 2025-05-15 - [Multi-Tiered Share Strategy]
**Learning:** The Web Share API provides the best native experience on mobile, but lacks support on many desktop browsers. A multi-tiered fallback (Native -> Clipboard -> Intent) ensures a smooth experience for all users.
**Action:** Always implement a clipboard fallback with clear toast feedback when using the Web Share API to prevent "dead" buttons on unsupported platforms.
