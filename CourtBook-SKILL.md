---
name: courtbook-design-system
description: >
  Complete design system and UI specification for CourtBook — an institute
  sports court booking web application. Use this skill whenever building any
  page or component for this project. It is self-contained and sufficient to
  independently produce any screen in the app without asking for design decisions.
stack: React + Tailwind (desktop-first, min-width 1024px)
---

# CourtBook Design System

This file is the single source of truth for every visual and interaction decision
in the CourtBook application. Read it fully before writing any component.

---

## 1. Brand Identity

**Product name:** CourtBook  
**Logotype:** `Court` in white + `Book` in Accent Green (`#1D7A4A`), weight 700  
**Tagline:** "Reserve your court, play your game."  
**Tone:** Institutional but approachable. Efficient. Zero decoration for decoration's sake.

---

## 2. Colour Palette

All colours are defined as CSS custom properties on `:root`. Every component
uses these tokens — never hardcode a hex value in a component.

```css
:root {
  /* --- PRIMARY (Navy) --- */
  --color-primary-900: #07182E;   /* deepest navy, rarely used */
  --color-primary-800: #0F2B52;   /* PRIMARY — nav bg, page titles, btn bg */
  --color-primary-700: #1A3F72;   /* primary hover state */
  --color-primary-600: #1E4D8C;
  --color-primary-100: #D0DCF0;   /* primary tint borders */
  --color-primary-50:  #E8EDF5;   /* primary wash bg */

  /* --- ACCENT (Turf Green) --- */
  --color-accent-800:  #0A3D25;
  --color-accent-700:  #0F5C30;   /* accent text on light */
  --color-accent-600:  #166038;   /* accent hover */
  --color-accent-500:  #1D7A4A;   /* ACCENT — book btn, available dot, success */
  --color-accent-100:  #A8DABB;
  --color-accent-50:   #D6F0E3;   /* approved badge bg */

  /* --- SURFACE & LAYOUT --- */
  --color-surface:     #F0F3F8;   /* page background */
  --color-card:        #FFFFFF;   /* card / modal background */
  --color-card-alt:    #F5F7FC;   /* inset panel within a card */
  --color-border:      #E2E8F0;   /* default border */
  --color-border-strong: #C5D3EC; /* hovered / focused border */

  /* --- TEXT --- */
  --color-text-primary:   #0F2B52; /* headings, body on white */
  --color-text-body:      #1A2B4A; /* table cell content */
  --color-text-secondary: #3D4F6B; /* labels, field names */
  --color-text-muted:     #6B7A99; /* subtitles, meta, timestamps */
  --color-text-disabled:  #A0A9B8;

  /* --- STATUS --- */
  --color-pending-bg:   #FFF3D6;
  --color-pending-text: #8A5E00;
  --color-pending-dot:  #D4900A;

  --color-approved-bg:   #D6F0E3;
  --color-approved-text: #0F5C30;
  --color-approved-dot:  #1D7A4A;

  --color-rejected-bg:   #FFE8E8;
  --color-rejected-text: #8A1A1A;
  --color-rejected-dot:  #B52A2A;

  /* --- SPORT TINTS --- */
  --color-badminton-bg:   #E8F5EE;
  --color-badminton-text: #0F5C30;
  --color-squash-bg:      #E8EEF8;
  --color-squash-text:    #1A3A6B;
  --color-tennis-bg:      #FFF3D6;
  --color-tennis-text:    #7A5000;
}
```

### Colour usage rules
- Page background is always `--color-surface` (#F0F3F8). Never white.
- Cards always use `--color-card` (#FFFFFF) with `border: 1px solid var(--color-border)`.
- Inset panels (e.g. booking summary inside a modal) use `--color-card-alt`.
- Never use a raw green for anything other than the Accent role.
- Status colours are exclusively for booking status badges. Do not repurpose them.

---

## 3. Typography

### Fonts

```css
/* In index.html <head> */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">

/* In global CSS */
:root {
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'Menlo', monospace;
}

body {
  font-family: var(--font-sans);
}
```

**DM Sans** — all UI text, labels, buttons, navigation, headings.  
**DM Mono** — time slots exclusively (e.g. `07:00 – 08:00`), booking IDs (e.g. `#BK-0041`).

### Type Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-page-title` | 22px / 700 | Bold | Page headings (h1) |
| `--text-section` | 17px / 700 | Bold | Modal titles, card section heads |
| `--text-card-title` | 15px / 600 | SemiBold | Court name, booking court name |
| `--text-body` | 14px / 400 | Regular | General body copy, form inputs |
| `--text-label` | 12px / 600 | SemiBold | Form field labels (ALL CAPS, 0.04em spacing) |
| `--text-meta` | 12px / 400 | Regular | Timestamps, secondary info |
| `--text-mono` | 12px / 500 | Medium | Time slots, booking IDs |
| `--text-micro` | 11px / 500 | Medium | Sport pills, badge text, table sub-labels |

### Typography rules
- Page title letter-spacing: `-0.4px`
- Card titles letter-spacing: `-0.2px`
- Form labels: UPPERCASE, `letter-spacing: 0.04em`, `color: --color-text-secondary`
- All time slots and IDs: `font-family: var(--font-mono)`
- Line-height body: `1.6`. Line-height headings: `1.2`

---

## 4. Spacing & Layout

```
Page max-width:     1200px (centered, auto margin)
Page padding:       28px top/bottom, 32px left/right
Section gap:        28px between major sections
Card padding:       20px (standard), 16px (compact)
Component gap:      12–16px between sibling cards
Inner element gap:  8px (tight), 12px (default), 16px (relaxed)
```

### Grid system
- Court cards: `grid-template-columns: repeat(3, 1fr)`, gap 16px
- Stat cards: `grid-template-columns: repeat(4, 1fr)`, gap 12px
- Slot grid: `grid-template-columns: repeat(6, 1fr)`, gap 8px
- Two-column layout: `grid-template-columns: 1fr 1fr`, gap 16px
- Admin layout: `grid-template-columns: 220px 1fr`

### Border radius
```
--radius-sm:   6px   (small buttons, chips)
--radius-md:   8px   (buttons, slots, inputs, badges)
--radius-lg:   10px  (cards, stat cards, tabs container)
--radius-xl:   12px  (court cards, modals, main cards)
--radius-full: 9999px (avatar circles, status dots)
```

---

## 5. Component Specifications

### 5.1 Navigation Bar

```
Height:          56px
Background:      --color-primary-800 (#0F2B52)
Padding:         0 32px
Logo font-size:  16px / 700, white + green on "Book"
Nav link:        13px / 500, rgba(255,255,255,0.6) inactive, #fff active
Active indicator: 2px solid --color-accent-500, bottom of nav, -18px from baseline
Avatar:          32×32px circle, --color-accent-500 bg, white 12px/600 initials
Name label:      13px, rgba(255,255,255,0.8)
```

**Navigation links (in order):**
1. Courts *(default landing)*
2. My Bookings
3. Schedule *(future)*

**Admin-only additional links** (injected when `profile.role === 'admin'`):
- Dashboard
- Manage Courts

---

### 5.2 Buttons

All buttons share: `font-family: var(--font-sans)`, `cursor: pointer`, `display: inline-flex`, `align-items: center`, `gap: 7px`, `transition: background 0.15s, border-color 0.15s`.

#### Primary Button — `btn-primary`
```
Background:   #0F2B52
Color:        #FFFFFF
Border:       none
Height:       38px
Padding:      0 18px
Border-radius: 8px
Font:         13px / 600
Hover bg:     #1A3F72
Active:       scale(0.98)
```
**Use for:** "Confirm Booking", "New Booking", "Submit Booking Request", "Manage Courts"

#### Accent Button — `btn-accent`
```
Background:   #1D7A4A
Color:        #FFFFFF
Border:       none
Height:       38px
Padding:      0 18px
Border-radius: 8px
Font:         13px / 600
Hover bg:     #166038
```
**Use for:** "Book" on court cards, "Approve" in admin table

#### Secondary Button — `btn-secondary`
```
Background:   #FFFFFF
Color:        #0F2B52
Border:       1.5px solid #D0D8E8
Height:       38px
Padding:      0 16px
Border-radius: 8px
Font:         13px / 500
Hover border: #0F2B52
Hover bg:     #F5F7FC
```
**Use for:** "View Schedule", "Export CSV", "View All", inline toggles

#### Ghost Button — `btn-ghost`
```
Background:   transparent
Color:        #6B7A99
Border:       none
Height:       34px
Padding:      0 12px
Border-radius: 7px
Font:         13px / 500
Hover bg:     #E8EDF5
Hover color:  #0F2B52
```
**Use for:** "Cancel" in modals, "Clear" in slot picker, "View", "Rebook"

#### Danger Button — `btn-danger`
```
Background:   #FFFFFF
Color:        #B52A2A
Border:       1.5px solid #F0C4C4
Height:       36px
Padding:      0 16px
Border-radius: 8px
Font:         13px / 500
Hover bg:     #FFF0F0
Hover border: #B52A2A
```
**Use for:** "Cancel" booking (user), "Reject" (admin)

#### Small modifier — `btn-sm`
Apply on top of any button variant:
```
Height:       30px
Padding:      0 12px
Font-size:    12px
Border-radius: 6px
```

#### Disabled state (all buttons)
```
Opacity:      0.45
Cursor:       not-allowed
pointer-events: none
```

#### Loading state (async buttons)
Show a 14×14px spinner SVG in place of any leading icon. Set `disabled`. Add `opacity: 0.7`. Never hide the label text.

---

### 5.3 Tab Bar

```
Container:    background #E8EDF5, border-radius 9px, padding 3px, width fit-content
Tab item:     padding 6px 16px, border-radius 7px, 13px / 500
Inactive:     color #6B7A99, background transparent
Active:       background #FFFFFF, color #0F2B52, box-shadow: 0 1px 3px rgba(15,43,82,0.12)
Transition:   all 0.15s
```

**Tab sets used across the app:**

| Location | Tabs |
|---|---|
| Courts listing | All Sports / Badminton / Squash / Tennis |
| My Bookings | All / Pending / Approved / Rejected |
| Admin — Bookings | Pending (n) / All Bookings / Approved / Rejected |
| Admin — Courts | Active Courts / Inactive |

Show count badge inside tab label only for Pending: `Pending (23)`.

---

### 5.4 Status Badges

Structure: `<span class="badge badge-{status}"><span class="dot"></span> Label</span>`

```
Badge:        display inline-flex, align-items center, gap 5px
              padding 3px 10px, border-radius 20px, 12px / 500

Dot:          width 6px, height 6px, border-radius 50%

approved:     bg #D6F0E3, text #0F5C30, dot #1D7A4A
pending:      bg #FFF3D6, text #8A5E00, dot #D4900A
rejected:     bg #FFE8E8, text #8A1A1A, dot #B52A2A
```

---

### 5.5 Sport Pills

Small inline label inside court cards and table rows.

```
Base:         display inline-block, padding 2px 10px, border-radius 20px
              font-size 11px / 600

badminton:    bg #E8F5EE, text #0F5C30
squash:       bg #E8EEF8, text #1A3A6B
tennis:       bg #FFF3D6, text #7A5000
```

---

### 5.6 Court Cards

```
Container:    bg #FFFFFF, border 1px solid #E2E8F0, border-radius 12px
              overflow hidden, cursor pointer
Hover:        border-color #0F2B52, box-shadow: 0 4px 16px rgba(15,43,82,0.1)
Transition:   all 0.15s

Header zone:  height 72px, flex center
              badminton bg: #E8F5EE
              squash bg:    #E8EEF8
              tennis bg:    #FFF3D6
              Icon:         36×36px SVG, sport accent colour

Body:         padding 14px 16px
Court name:   14px / 600, --color-text-primary
Sport pill:   margin-top 4px

Footer:       padding 10px 16px, border-top 1px solid #F0F3F8
              flex space-between
Availability: 8px dot + 12px / 500 text
              available: dot #1D7A4A, text #1D7A4A, label "N slots today"
              full:      dot #B52A2A, text #B52A2A, label "Fully booked"
CTA:          btn-accent btn-sm if available, btn-secondary btn-sm disabled if full
```

---

### 5.7 Date Chips (slot date selector)

```
Container:    display flex, gap 8px
Chip:         padding 7px 14px, border-radius 8px
              border 1.5px solid #E2E8F0, bg #FFFFFF
              font-size 12px / 500, cursor pointer
Hover:        border-color #0F2B52
Active:       bg #0F2B52, color #FFFFFF, border-color #0F2B52
Day label:    font-size 10px, opacity 0.7, display block (above the number)
```

Show 5 upcoming dates starting from today. Format: abbreviated day above, date number below.

---

### 5.8 Slot Grid

```
Grid:         repeat(6, 1fr), gap 8px

Slot cell:    border 1.5px solid #E2E8F0, border-radius 8px
              padding 10px 8px, text-align center, cursor pointer
              bg #FFFFFF, transition all 0.15s

Slot time:    12px / 500, --color-primary-800, font-family mono
Slot status:  10px / 500, margin-top 3px

States:
  available:  bg #FFFFFF, border #E2E8F0
              hover: border #0F2B52
              time: #0F2B52, status "Free" color #1D7A4A

  booked:     bg #F8F8F8, border #E2E8F0, opacity 0.6, cursor not-allowed
              time: #A0A9B8, status "Booked" color #A0A9B8

  selected:   bg #0F2B52, border #0F2B52
              time: #FFFFFF, status "Selected" color rgba(255,255,255,0.75)
```

Below the slot grid, show an action bar:
- Left: nothing (or legend: `■ Selected  □ Available  ▨ Booked`)
- Right: `btn-ghost "Clear"` + `btn-primary "Confirm Booking — HH:MM to HH:MM"`

Confirm button label is dynamic: updates as soon as a slot is selected. Disabled if no slot selected.

---

### 5.9 Data Tables

```
Container:    card with padding:0, overflow hidden
Table:        width 100%, border-collapse collapse, font-size 13px

th:           padding 10px 14px, color #6B7A99, 12px / 500
              text-transform uppercase, letter-spacing 0.04em
              border-bottom 1px solid #E8EDF5

td:           padding 12px 14px, border-bottom 1px solid #F4F6FB
              color #1A2B4A, vertical-align middle

Row hover:    background #FAFBFD

Last row:     no border-bottom

Booking ID:   font-family mono, 12px, color #6B7A99
Court name:   14px / 500, --color-text-primary + sport sub-label below
Slot time:    font-family mono, 11–12px, color #1A2B4A
Timestamp:    12px, color #6B7A99
Avatar circle: 28×28px, border-radius 50%, 11px/600 initials
              bg: primary-50 for most; accent-50 for accent
```

---

### 5.10 Forms & Inputs

```
Form label:   12px / 600, --color-text-secondary, UPPERCASE, letter-spacing 0.04em
              display block, margin-bottom 6px

Input / Select:
  Height:     40px
  Border:     1.5px solid #D8E0EE
  Border-radius: 8px
  Padding:    0 12px
  Font:       14px, DM Sans, --color-text-primary
  Background: #FFFFFF
  Outline:    none
  Transition: border-color 0.15s

  Focus:      border-color #0F2B52, box-shadow 0 0 0 3px rgba(15,43,82,0.08)
  Error:      border-color #B52A2A, box-shadow 0 0 0 3px rgba(181,42,42,0.08)
  Disabled:   bg #F5F7FC, opacity 0.6

Error message: 12px, color #B52A2A, margin-top 4px, display block

Form group margin-bottom: 16px
```

**Forms in this project:**
- Login: Email input + Password input + btn-primary "Sign In" + ghost link "Create account"
- Sign Up: Full name + Email + Password + btn-primary "Create Account"
- (No other forms — all booking data is selected from UI, not typed)

---

### 5.11 Modal

```
Overlay:      background rgba(10,20,40,0.5), flex center
Modal:        bg #FFFFFF, border-radius 14px, padding 28px
              width 420px max, border 1px solid #E2E8F0

Title:        17px / 700, --color-text-primary, margin-bottom 4px
Subtitle:     13px, --color-text-muted, margin-bottom 20px

Summary panel: bg --color-card-alt (#F5F7FC), border-radius 10px, padding 16px
               grid 2-col inside for label+value pairs
               Label: 11px/600, --color-text-muted, uppercase, letter-spacing 0.04em
               Value: 14px/600, --color-text-primary (times in DM Mono)

Footer:       flex, gap 10px, justify-content flex-end
              margin-top 20px, padding-top 16px
              border-top 1px solid #F0F3F8
              Ghost "Cancel" left, Primary CTA right
```

**Modals in this project:**
- Booking Confirmation: summary panel + warning alert + "Submit Booking Request"
- Reject Reason (admin): optional textarea + "Confirm Rejection"
- Deactivate Court (admin): destructive confirm + "Deactivate Court" (danger btn)

---

### 5.12 Alert Banners

```
Base:   border-radius 8px, padding 12px 16px, 13px/500
        display flex, align-items center, gap 10px, margin-bottom 16px

info:    bg #E8EEF8, color #1A3A6B, border 1px solid #C5D3EC
success: bg #D6F0E3, color #0F5C30, border 1px solid #A8DABB
warning: bg #FFF3D6, color #7A5000, border 1px solid #F0D58A
danger:  bg #FFE8E8, color #8A1A1A, border 1px solid #F0C4C4
```

---

### 5.13 Stat Cards (Admin Dashboard)

```
Container:    bg #FFFFFF, border 1px solid #E2E8F0, border-radius 10px
              padding 16px 20px

Label:        12px / 500, --color-text-muted
              text-transform uppercase, letter-spacing 0.04em, margin-bottom 6px

Value:        24px / 700, letter-spacing -0.5px
              default: --color-text-primary
              pending: #D4900A
              approved: #1D7A4A

Sub-label:    12px / 500, margin-top 3px
              default: #1D7A4A (positive)
              pending: #D4900A
```

---

### 5.14 Admin Sidebar

```
Width:        220px
Background:   #0A2040 (deeper than nav)
Padding:      20px 0

Section label: 10px/600, rgba(255,255,255,0.3), uppercase, letter-spacing 0.08em
               padding 8px 20px 4px

Item:         display flex, align-items center, gap 10px
              padding 9px 20px, 13px/500
              color rgba(255,255,255,0.55)
              cursor pointer, border-left 2px solid transparent
              transition all 0.15s

Item hover:   color #FFFFFF, bg rgba(255,255,255,0.05)
Item active:  color #FFFFFF, bg rgba(29,122,74,0.2), border-left-color #1D7A4A

Icon:         16×16px SVG, opacity 0.7
```

**Sidebar items:**
- Overview (home icon)
- All Bookings (list icon)
- Pending (clock icon) — shows count badge
- Courts (grid icon)
- Users (people icon) *(future)*

---

## 6. Page Inventory

Every page in the project with its key layout decisions.

### 6.1 `/login` — Login Page
- Centred card (420px wide) on `--color-surface` background
- CourtBook logo above card
- Email + Password inputs
- btn-primary full-width "Sign In"
- Ghost link below: "Don't have an account? Sign up"
- No nav bar

### 6.2 `/signup` — Sign Up Page
- Same centred card layout as login
- Full Name + Email + Password inputs
- btn-primary full-width "Create Account"
- Ghost link: "Already have an account? Sign in"
- No nav bar

### 6.3 `/courts` — Court Listing (User Home)
- Full nav bar
- Page title: "Book a Court" + subtitle
- Sport filter tabs
- Court cards grid (3 columns)
- On court card click: expands inline or navigates to `/courts/:id`

### 6.4 `/courts/:courtId` — Court Detail / Slot Picker
- Full nav bar
- Breadcrumb: Courts > Badminton Court 1
- Court name + sport pill + status
- Date chips row (5 days)
- Slot grid (6 columns)
- Confirm action bar below grid
- On confirm: opens Booking Confirmation Modal

### 6.5 `/my-bookings` — User Booking History
- Full nav bar
- Page title + "New Booking" btn-primary top right
- Status filter tabs (All / Pending / Approved / Rejected)
- Data table with columns: ID / Court / Date / Slot / Status / Action
- Empty state when no bookings in selected tab

### 6.6 `/admin` — Admin Dashboard
- Full nav bar + sidebar layout
- Stat cards row (4 cards)
- Status filter tabs
- Bookings data table with Approve / Reject actions
- Real-time updates via Supabase channel

### 6.7 `/admin/courts` — Court Management
- Full nav bar + sidebar layout
- Table of all courts: Name / Sport / Slots / Status / Toggle
- Toggle switch to activate/deactivate (with confirm modal)
- Future: "Add Court" btn-primary top right

---

## 7. Interaction Patterns

### Loading states
- Page-level data: render skeleton cards (grey `--color-border` rectangles at
  exact card dimensions, subtle pulse animation)
- Button async: replace leading icon with 14px spinner, disable button, keep label
- Slot grid: show 12 skeleton slots while fetching

### Empty states
```
Container:    text-align center, padding 40px 20px
Title:        15px/600, #3D4F6B
Body:         13px, --color-text-muted
CTA:          btn-primary or btn-accent below (if action available)
```

Messages by context:
- My Bookings (Pending tab): "No pending bookings" / "All caught up!"
- My Bookings (Approved tab): "No approved bookings yet"
- Admin Pending: "No bookings pending review"
- Slot grid all booked: "All slots taken for this date. Try a different date."

### Error / toast notifications
- Position: top-right, 16px from edge
- Duration: 4s auto-dismiss
- Width: 320px max
- Use alert component styles (success / danger / warning)
- Stack vertically if multiple, gap 8px

### Confirmations
- Destructive actions (Cancel booking, Reject, Deactivate court): always show modal
- Non-destructive approvals: can use inline optimistic update + success toast
- Never use `window.confirm()`

---

## 8. Icon System

Use **Lucide React** exclusively. `import { IconName } from 'lucide-react'`.

Standard size: `width={16} height={16}` for inline/button icons.  
Larger decorative: `width={24} height={24}` max.

**Icon assignments:**

| Context | Icon |
|---|---|
| New booking / Add | `Plus` |
| Calendar / Schedule | `Calendar` |
| Court / Grid | `LayoutGrid` |
| Badminton | `Circle` (stylised, coloured) |
| Squash | `Square` |
| Tennis | `Circle` |
| Approved / Success | `CheckCircle2` |
| Pending / Clock | `Clock` |
| Rejected / Error | `XCircle` |
| Cancel / Close | `X` |
| Export | `Download` |
| User / Admin | `User` |
| Logout | `LogOut` |
| Settings | `Settings` |
| Back / Breadcrumb | `ChevronRight` |
| View detail | `ArrowRight` |

---

## 9. React Component Architecture

```
src/
  components/
    layout/
      Navbar.jsx            — top nav, receives user + role prop
      Sidebar.jsx           — admin sidebar, receives activeItem prop
      PageShell.jsx         — page wrapper: max-width, padding, bg
    ui/
      Button.jsx            — variant: primary|accent|secondary|ghost|danger, size: default|sm
      Badge.jsx             — status: approved|pending|rejected
      SportPill.jsx         — sport: badminton|squash|tennis
      Tabs.jsx              — items array, activeIndex, onChange
      Alert.jsx             — type: info|success|warning|danger
      Modal.jsx             — title, subtitle, children, footer, onClose
      StatCard.jsx          — label, value, sub, valueColor
      Avatar.jsx            — initials, colorScheme: primary|accent
      EmptyState.jsx        — title, body, ctaLabel, onCta
      Skeleton.jsx          — variant: card|slot|row
    booking/
      CourtCard.jsx         — court data, onBook
      SlotGrid.jsx          — slots[], selectedSlot, onSelect, date
      DateChips.jsx         — dates[], activeDate, onChange
      BookingRow.jsx        — booking data (used in table)
      BookingConfirmModal.jsx
    admin/
      AdminBookingRow.jsx   — booking + onApprove + onReject
```

---

## 10. CSS Class Reference (Quick Lookup)

```
btn-primary       Primary navy filled button
btn-accent        Green filled button (booking CTAs)
btn-secondary     White outlined button
btn-ghost         Transparent muted button
btn-danger        White button with red text/border
btn-sm            Small size modifier (any button)

badge-approved    Green status badge
badge-pending     Amber status badge
badge-rejected    Red status badge

sport-pill        Base sport label
  .badminton      Green variant
  .squash         Blue variant
  .tennis         Amber variant

slot              Slot grid cell
  .available      Default interactive
  .selected       Navy filled
  .booked         Greyed out, non-interactive

alert-info        Blue tinted banner
alert-success     Green tinted banner
alert-warning     Amber tinted banner
alert-danger      Red tinted banner

stat-card         Admin summary number card
date-chip         Date selector chip
  .active         Navy filled

nav-link          Navbar link
  .active         White + green underline indicator

sidebar-item      Admin sidebar link
  .active         Green left border + tinted bg

data-table        Standard booking/admin table
booking-id        Mono-font ID span
```

---

## 11. Do's and Don'ts

### Do
- Always use `--color-surface` as the page background, never white
- Use DM Mono for every time value and booking ID
- Keep tab sets within `fit-content` width (don't stretch to full width)
- Show sport pill on every court reference (card, table, modal)
- Confirm destructive actions with a modal
- Show a real loading state while fetching slot availability
- Keep admin Approve/Reject buttons visually adjacent in the same `<td>`

### Don't
- Don't use the accent green for anything other than its designated roles
- Don't show status colours (approved/pending/rejected) for non-booking contexts
- Don't abbreviate slot times — always show both start and end: `10:00 – 11:00`
- Don't use the sidebar on any user-facing page (nav bar only)
- Don't mix font weights — only 400, 500, 600, 700 from DM Sans
- Don't show raw Supabase error messages to users — map them to friendly copy
- Don't allow date selection before today on the slot picker
