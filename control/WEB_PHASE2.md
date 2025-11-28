# Phase 2 — UI Modernization (Full Specification)

## Mission

Make the site visually modern, branded, warm, crisp, and premium.

**NO new backend logic. NO accounts yet. NO saved recipes.**

Just style upgrades, layout organization, structure improvement, brand integration, and real SaaS polish.

## Brand System Reference

### Colors
- `bg`: `#F7F3EE` (warm neutral)
- `ink`: `#1E2220` (charcoal)
- `accent-primary`: `#4F7C63` (sage)
- `accent-secondary`: `#F4A87A` (apricot/coral)
- `lane-bg`: `#E7E0D9` (subtle warm gray)
- `card`: `#FFFFFF`

### Typography
- Headings: Inter Tight / 700
- Body: Inter / 400–500

### Taglines
- Primary: "Host the meal. We've got the rest."
- Secondary: "You know what looks good. We know how to get you there."

## Components to Create

1. **Header** (`components/Header.tsx`)
   - Sticky header
   - Logo + wordmark
   - Navigation links
   - CTA button
   - Mobile hamburger menu

2. **Footer** (`components/Footer.tsx`)
   - Logo + tagline
   - Three-column layout (Product, Company, More)

3. **Button** (`components/ui/Button.tsx`)
   - Primary, secondary, tertiary variants
   - Brand colors
   - Hover effects

## Page Redesigns

1. **Landing Page** (`app/page.tsx`)
   - Modern hero section
   - "How It Works" section
   - "Built for Hosts Like You" section
   - App preview section

2. **App Layout** (where recipe form + schedule live)
   - Two-column desktop layout
   - Stacked mobile layout
   - Card-based design
   - Brand colors throughout

## Next Phase (Phase 3)

- User accounts (Magic Link login)
- Recipe bank / library
- Saved events
- Event types (prep-week vs event)

## Notes

- Use `messages.ts` for microcopy hooks
- All components must be responsive
- Keep code clean and modular
- Use Tailwind classes exclusively

