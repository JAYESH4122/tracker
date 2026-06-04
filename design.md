# Design System

This project now treats the home screen as the visual source of truth. The goal is to keep every route consistent with the same dark, premium training aesthetic instead of letting each screen drift into its own one-off style.

## Visual Direction

- Mood: premium, focused, cinematic, performance-first
- Base: charcoal surfaces with soft transparency and subtle borders
- Accent: warm gold for primary actions, active states, and progress
- Secondary signal: muted green for positive trend states
- Motion: quick, springy, and restrained

The home screen already establishes the target language:

- A dark full-bleed background
- Gold-forward hierarchy
- Elevated cards with thin borders
- Section dividers that feel energetic, not decorative
- Strong, condensed headings paired with clean body text

## Tokens

Use the shared `theme` module for all new work.

### Color

- `background`: `#0F0F0F`
- `card`: `#1C1C1C`
- `cardElevated`: `#242424`
- `primary`: `#D4AF37`
- `primaryMuted`: `#6E5A1F`
- `text`: `#E5E2E1`
- `subtext`: `#A0A0A0`
- `border`: `rgba(255, 255, 255, 0.08)`
- `overlay`: `rgba(0, 0, 0, 0.4)`
- `danger`: `#FF5A6A`

### Radius

- `sm`: 4
- `md`: 8
- `lg`: 12
- `xl`: 16
- `pill`: 999

### Typography

- `display`: `ArchivoNarrow_700Bold`, large and condensed
- `title`: `ArchivoNarrow_700Bold`
- `sectionTitle`: `ArchivoNarrow_600SemiBold`
- `body`: `Inter_400Regular`
- `caption`: `Inter_400Regular`
- `statValue`: `ArchivoNarrow_700Bold`
- `button`: `Inter_600SemiBold`

## Shared Layout Rules

- Keep a dark full-screen background on every route.
- Use safe areas consistently on top-level screens.
- Prefer cards and stacked sections over raw blocks of text.
- Use gold for primary actions only. Reserve it for the most important action in a view.
- Keep content widths controlled on larger screens where possible.
- When a page has several sections, separate them with spacing and/or a subtle divider instead of hard visual breaks.

## Shared Components

These components are the preferred building blocks for the rest of the app:

- `ScreenContainer` for safe-area page shells
- `Card` for elevated content blocks
- `SectionHeader` for section titles and optional actions
- `AppText` for all typography
- `Button` for primary, ghost, and destructive actions
- `InputField` for consistent form fields
- `StatCard` for compact metric tiles

If a screen needs custom UI, it should still borrow these tokens and spacing patterns.

## Screen Patterns

### Home

Home is the reference implementation.

- Big dashboard header
- Hero session card
- Weekly progress strip
- Yesterday summary
- Snapshot tiles
- Recent sessions list
- Floating primary action and bottom dock

### History

- Use a timeline or grouped list
- Keep workout cards consistent with the home card language
- Surface PR chips and workout metadata in a compact way

### Workout

- Use a strong top bar and clear state separation
- Keep the active workout area visually dense but readable
- Inputs should feel like the same system as cards, not a different app

### Library

- Treat as a builder or editor screen
- Use the same charcoal surfaces, gold highlight, and bordered cards
- Forms should feel like part of the same product family as home and workout

### Stats

- Keep charts inside cards
- Pair every chart with a short explanatory label
- Use the same summary-card pattern as the home snapshot tiles

### Profile

- Keep it minimal and utility-first
- Use the same card and section-header primitives
- Avoid introducing a lighter or flatter visual style here

## Interaction Rules

- Press states should be subtle and quick
- Preferred press scale for cards: around `0.96`
- Fade-up entrance animations should be short and staggered
- Gold glow or pulse effects should be reserved for active session state, completion, or progress moments

## Content Tone

- Labels should be short and uppercase when they are structural
- Body copy should be concise and direct
- Metrics should be easy to scan at a glance
- Empty states should explain what to do next, not just say that something is missing

## Implementation Notes

- Prefer theme tokens over hardcoded color literals.
- If a screen needs a new semantic color, add it to `theme/colors.ts` first.
- If a card or control needs a new shape convention, add it to the shared `theme/radius.ts` scale before duplicating it locally.
- When updating a screen, check whether the same pattern should be pushed into `components/` instead of being repeated.

## Source Of Truth

- Theme tokens: `theme/colors.ts`, `theme/radius.ts`, `theme/spacing.ts`, `theme/typography.ts`
- Shared primitives: `components/card.tsx`, `components/button.tsx`, `components/section-header.tsx`, `components/app-text.tsx`
- Reference screen: `features/home/screens/home-screen.tsx`
