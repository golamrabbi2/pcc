# DESIGN.md — Project Command Center

## Stitch Project
- **Title:** PCC Project Management System
- **Project ID:** `14642847543273888601`
- **Stitch Link:** https://stitch.withgoogle.com/projects/14642847543273888601
- **Device Target:** Desktop-first with mobile variant
- **Theme:** Light mode
- **Font Family:** Inter / Google Sans
- **Border Radius (global):** 8px (large), 4px (small/internal)
- **Grid:** 4px baseline

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#004ac6` | Primary interactive elements |
| `--primary-container` | `#2563eb` / `#d7e2ff` | Primary surface variations |
| `--on-primary` | `#ffffff` | Text on primary |
| `--on-primary-container` | `#001945` | Text on container |
| `--secondary` | `#565e71` | Secondary actions |
| `--secondary-container` | `#dae2f9` | Secondary surfaces |
| `--on-secondary-container` | `#131c2b` | Text on secondary container |
| `--tertiary` | `#6f5676` | Tertiary accents |
| `--tertiary-container` | `#f9d8ff` | Tertiary surfaces |
| `--background` | `#faf8ff` | Page background |
| `--on-background` | `#1a1b20` | Body text |
| `--surface` | `#faf8ff` | Card/sheet surface |
| `--on-surface` | `#1a1b20` | Text on surface |
| `--surface-container` | `#f1eff7` | Muted container surface |
| `--surface-container-high` | `#ebe9f1` | Elevated containers |
| `--surface-bright` | `#faf8ff` | Bright surface |
| `--surface-dim` | `#dad8e0` | Dim surface |
| `--outline` | `#737686` | Borders, dividers |
| `--outline-variant` | `#c3c6d7` | Subtle borders |
| `--error` | `#ba1a1a` | Error/destructive |
| `--on-error` | `#ffffff` | Text on error |
| `--error-container` | `#ffdad6` | Error surface |
| `--shadow` | `#000000` | Drop shadow base |

---

## Typography

| Role | Family | Weight | Size/Line Height |
|---|---|---|---|
| **Headline Large** | Inter / Google Sans | 600 | 32px / 40px |
| **Headline Medium** | Inter / Google Sans | 600 | 28px / 36px |
| **Headline Small** | Inter / Google Sans | 600 | 24px / 32px |
| **Title Large** | Inter / Google Sans | 500 | 22px / 28px |
| **Title Medium** | Inter / Google Sans | 500 | 16px / 24px |
| **Title Small** | Inter / Google Sans | 500 | 14px / 20px |
| **Body Large** | Inter / Google Sans | 400 | 16px / 24px |
| **Body Medium** | Inter / Google Sans | 400 | 14px / 20px |
| **Body Small** | Inter / Google Sans | 400 | 12px / 16px |
| **Label Large** | Inter / Google Sans | 500 | 14px / 20px |
| **Label Medium** | Inter / Google Sans | 500 | 12px / 16px |
| **Label Small** | Inter / Google Sans | 500 | 11px / 16px |
| **Code** | `'JetBrains Mono'` / monospace | 400 | 13px / 20px |

---

## Spacing (4px grid)

| Token | Pixels |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

---

## Component Specs

### Sidebar (App Shell)
- **Width:** 240px desktop, 64px tablet (rail), hidden overlay mobile
- **Background:** `--surface-container`
- **Border-right:** `1px solid --outline-variant`
- **Nav item:** 40px height, 8px border-radius, `--on-surface-variant` text
- **Nav item active:** `--secondary-container` bg, `--on-secondary-container` text

### Buttons
| Variant | Height | Padding | Radius | Typography |
|---|---|---|---|---|
| Filled (Primary) | 40px | 16px 24px | 20px | Label Large |
| Tonal (Secondary) | 40px | 16px 24px | 20px | Label Large |
| Outlined | 40px | 16px 24px | 20px | Label Large |
| Text / Ghost | 40px | 12px 16px | 20px | Label Large |
| Icon-only | 40px × 40px | — | 20px | — |

### Cards
- **Radius:** 12px (large), 8px (small)
- **Background:** `--surface-container-low`
- **Border:** `1px solid --outline-variant`
- **Shadow:** `0 1px 3px rgba(0,0,0,0.08)`
- **Padding:** 16px (body), 12px 16px (header/footer)

### Input Fields
- **Height:** 56px (with label), 40px (without)
- **Radius:** 4px
- **Border:** `1px solid --outline`
- **Focus:** `2px solid --primary`
- **Label:** Body Medium, `--on-surface-variant`
- **Helper/Error:** Body Small

### Badge / Chip
- **Height:** 24px
- **Radius:** 12px
- **Padding:** 8px 12px
- **Typography:** Label Small
- **Variants:** filled, tonal, outlined

### Tables
- **Header:** Label Medium, `--on-surface-variant`, 40px height
- **Cell:** Body Medium, 48px height
- **Border:** `1px solid --outline-variant`
- **Row hover:** `--surface-container-high`

### Dialogs / Sheets
- **Sheet:** 300px–500px width, full height
- **Dialog:** max 560px width, centered
- **Overlay:** `rgba(0,0,0,0.32)`
- **Radius:** 16px (dialog top), 0 (sheet side)
- **Padding:** 24px

### Progress / Loading
- **Linear:** 4px height, `--primary` track
- **Circular:** 40px diameter
- **Skeleton:** `--surface-container-high` with shimmer

---

## Layout Structure

```
┌─────────────────────────────────────────────┐
│  App Bar                          [avatar ▼]│ 56px
├──────────┬──────────────────────────────────┤
│          │                                   │
│ Sidebar  │         Main Content              │
│  240px   │    (max-width: 1280px)            │
│          │                                   │
│          │  ┌─── Breadcrumb ──────────────┐  │
│          │  │  Dashboard > Project Alpha  │  │ 32px
│          │  ├─────────────────────────────┤  │
│          │  │                             │  │
│          │  │      Page Content           │  │
│          │  │                             │  │
│          │  └─────────────────────────────┘  │
├──────────┴──────────────────────────────────┤
│  Footer (minimal, copyright)                 │ 40px
└─────────────────────────────────────────────┘
```

### Responsive Breakpoints
| Breakpoint | Width | Sidebar |
|---|---|---|
| Desktop | > 1024px | 240px (full) |
| Tablet | 640–1024px | 64px (icon rail) |
| Mobile | < 640px | Hidden (drawer overlay) |

---

## States

### Loading
- Skeleton blocks matching final layout dimensions
- Pulse animation: `opacity` 0.3–1.0 over 1.5s
- No text, icons, or data visible

### Empty
- Centered illustration or icon (96px)
- Headline: "No [items] yet"
- Body: Helper text explaining how to create first item
- CTA: Primary button to create

### Error
- Inline error banner below app bar: `--error-container` bg, `--on-error-container` text
- Toast (Sonner) for transient errors
- Full-page error for 404/500: illustration + "Something went wrong" + retry button

---

## Screen-Specific Notes

| Screen | Key Layout | Special Components |
|---|---|---|
| Login | Centered card (400px), full-screen bg | Social login buttons (GitHub) |
| Register | Centered card (400px), full-screen bg | Name + email + password fields |
| Dashboard | Sidebar + 3-column grid (stats, activity, health) | Stat cards, activity feed, health ring |
| WBS Editor | Sidebar + tree panel + detail panel | Indented tree, inline add/edit, drag handles |
| Project Health | Sidebar + gauge + radar + issues list | Health gauge (green/amber/red), issue table |
| Setup | Sidebar + stepper (multi-step form) | Repository picker, team selector, webhook status |
| Handovers | Sidebar + card list + preview panel | Capsule cards, markdown preview, "Generate" button |
| Settings | Sidebar + tabbed form | Profile, notifications, GitHub, danger zone |
| 404 | Centered illustration + link home | Large 404 text, illustration, "Go Home" button |

---

## Accessibility
- All interactive elements: minimum 44×44px touch target
- Color contrast ratios ≥ 4.5:1 for text, ≥ 3:1 for large text
- Focus indicators: `2px solid --primary` with `2px` offset
- ARIA labels on all icon-only buttons
- Form errors: inline + `aria-describedby`
