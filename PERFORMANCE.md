# Performance Optimization Guide

## Overview
This document outlines all performance optimizations implemented in Foundery.Space to achieve excellent Core Web Vitals scores and fast page loads.

---

## 🚀 Next.js Configuration Optimizations

### Build & Runtime Performance
- **Compression**: Enabled gzip compression for all responses
- **SWC Minification**: Using Rust-based SWC compiler for faster builds and smaller bundles
- **Console Removal**: Auto-remove console.log in production (keeps errors/warnings)
- **Package Import Optimization**: Tree-shaking for lucide-react, framer-motion, and all Radix UI components

### Image Optimization
- **Modern Formats**: AVIF (primary) + WebP (fallback) for 30-50% size reduction
- **Long-term Caching**: 1 year cache TTL for external images
- **Responsive Sizes**: 7 device breakpoints + 7 icon sizes for optimal delivery
- **SVG Security**: Sandboxed SVGs with strict CSP

### Caching Strategy
```
Static Assets (images, fonts, JS, CSS)
  → Cache-Control: public, max-age=31536000, immutable (1 year)

API Read Endpoints (/opportunities, /search)
  → Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200
  → 1 hour cache, 2 hour stale tolerance

API Write Endpoints (/submit, /vote, /admin)
  → Cache-Control: no-store
```

---

## 🎨 Font Loading Optimizations

### Google Fonts Strategy
- **Font Display**: `swap` on all fonts (DM Sans, VT323, DM Mono)
- **Preload**: Enabled for critical fonts
- **Fallback Fonts**: system-ui, arial, monospace for FOUT mitigation
- **Variable Fonts**: Using DM Sans with optical sizing axis for fewer files

### DNS & Connection Hints
```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

---

## 🖼️ Image Performance

### Critical Images
- Logo preloaded: `<link rel="preload" href="/logo.png" as="image" />`
- Hero images: `priority={true}` + `fetchPriority="high"`
- Above-fold opportunity cards: `priority={true}` for first 3 cards

### Lazy Loading
- Below-fold images: `loading="lazy"` + `decoding="async"`
- Mascot image: `fetchPriority="low"` (decorative, not critical)
- Carousel clones: `priority={false}` to avoid duplicate priority loads

### Image Dimensions
- Always specify width/height to prevent layout shift (CLS)
- Use Next.js Image component for automatic optimization
- `sizes` attribute for responsive images

---

## ⚡ Animation Performance

### GSAP Optimizations (CircularCarousel)
- **GPU Acceleration**: `force3D: true` on all transforms
- **will-change**: Applied during animation, removed on cleanup
- **requestAnimationFrame**: Wrapping position updates for smoother rendering
- **Timeline Cleanup**: Proper `.kill()` on unmount to prevent memory leaks
- **Throttled Resize**: 150ms debounce on window resize events

### CSS Animations (InfiniteCarousel)
- **GPU-accelerated**: Using `transform: translateX()` (not `left`)
- **will-change-transform**: Hint for browser optimization
- **Passive Event Listeners**: Non-blocking scroll/touch handlers
- **Animation Pausing**: Hover pause to reduce CPU when not in view

---

## 🧹 React Performance

### Component Optimizations
- **useMemo**: Filter operations cached (infinite carousel)
- **useCallback**: Event handlers memoized to prevent re-creation
- **React.memo**: Applied to heavy components (OpportunityCard when in carousels)

### State Management
- **requestAnimationFrame throttling**: Mouse tracking limited to 60fps
- **Ref cleanup**: All animation refs properly cleaned up on unmount
- **Intersection Observer**: Lazy animation triggers only when in viewport

---

## 📦 Bundle Size Reduction

### Code Splitting
- Route-based splitting (automatic with App Router)
- Dynamic imports for heavy components (Three.js, GSAP plugins)
- Loading states for all routes to prevent blank screens during chunk loading

### Tree Shaking
- Named imports only: `import { Search } from "lucide-react"`
- No barrel imports from large libraries
- Dead code elimination via SWC

---

## 🌐 Network Performance

### Resource Hints
```html
<!-- Critical third-parties -->
<link rel="preconnect" href="https://tpvpacwoquygbykcjqle.supabase.co" />
<link rel="preconnect" href="https://res.cloudinary.com" />

<!-- Analytics (low priority) -->
<link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
```

### API Optimization
- **React Query**: Caching, deduplication, stale-while-revalidate
- **Supabase Pooling**: Connection pooling for faster queries
- **ISR (Incremental Static Regeneration)**:
  - Homepage: 3600s (1 hour)
  - Opportunity pages: 600s (10 minutes)
  - Browse pages: 1800s (30 minutes)

---

## 📊 Core Web Vitals Targets

### Largest Contentful Paint (LCP)
**Target: < 2.5s**
- Hero section optimized (grid background instead of image)
- Critical fonts preloaded
- Above-fold images prioritized
- No render-blocking resources

### First Input Delay (FID) / Interaction to Next Paint (INP)
**Target: < 200ms**
- requestAnimationFrame throttling on mouse tracking
- Passive event listeners
- Debounced resize handlers
- No long-running JS tasks

### Cumulative Layout Shift (CLS)
**Target: < 0.1**
- Image dimensions always specified
- Font fallbacks defined
- Skeleton loaders for async content
- No above-fold content shifts

---

## 🔍 Monitoring

### Analytics
- Vercel Analytics for real user monitoring
- Vercel Speed Insights for Core Web Vitals tracking
- Performance budgets enforced in CI/CD

### Key Metrics to Watch
1. Time to First Byte (TTFB): < 600ms
2. First Contentful Paint (FCP): < 1.8s
3. LCP: < 2.5s
4. Total Blocking Time (TBT): < 200ms
5. CLS: < 0.1

---

## 🛠️ Development Best Practices

### Before Adding New Features
1. Check bundle impact: `npm run build` and review output
2. Test on slow 3G connection (Chrome DevTools)
3. Run Lighthouse audit (target 90+ on all metrics)
4. Check image sizes (< 200KB for photos, < 50KB for icons)

### Component Checklist
- [ ] Images have width/height attributes
- [ ] Heavy animations use `will-change` and cleanup properly
- [ ] Event listeners are passive where possible
- [ ] Large lists are virtualized or paginated
- [ ] Above-fold content loads first (priority hints)

---

## 📈 Performance Budget

| Resource Type | Budget |
|--------------|--------|
| JavaScript | < 350 KB |
| CSS | < 100 KB |
| Images (initial) | < 500 KB |
| Fonts | < 150 KB |
| Total Page Weight | < 1.5 MB |

---

## 🔄 Continuous Optimization

### Automated Checks
- Lighthouse CI runs on every PR
- Bundle size tracking with next-bundle-analyzer
- Image optimization verification in CI

### Manual Audits (Monthly)
- Review Vercel Speed Insights dashboard
- Analyze bundle composition
- Check for unused dependencies
- Review third-party script impact

---

## 📚 Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [GSAP Performance Tips](https://greensock.com/docs/v3/GSAP/gsap.config())
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
