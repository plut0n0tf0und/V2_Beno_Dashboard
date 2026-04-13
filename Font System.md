# Font System Design

## Overview
This project uses a dual-font strategy optimized for data visualization and editorial hierarchy, combining modern geometric and highly legible typefaces.

## Font Families

### Primary Fonts
- **Manrope**: Geometric sans-serif for headlines and display text
- **Inter**: Humanist sans-serif for body text and UI elements  
- **JetBrains Mono**: Monospace for code and technical data

### Font Stack Definitions
```css
--font-headline: "Manrope", ui-sans-serif, system-ui, sans-serif;
--font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
```

## Font Weights

### Manrope (Headline)
- **400**: Regular (Light headlines)
- **500**: Medium (Sub-headings)
- **600**: Semibold (Primary headlines)
- **700**: Bold (Emphasis headlines)
- **800**: Extra-bold (Hero metrics)

### Inter (Body)
- **300**: Light (Supporting text)
- **400**: Regular (Default body)
- **500**: Medium (UI labels)
- **600**: Semibold (Emphasis)

### JetBrains Mono (Code)
- **400**: Regular (Code display)
- **500**: Medium (Highlighted code)

## Typography Scale

### Display & Headline Sizes
- **text-3xl**: 1.875rem (30px) - Page titles
- **text-2xl**: 1.5rem (24px) - Section titles
- **text-xl**: 1.25rem (20px) - Card titles
- **text-lg**: 1.125rem (18px) - Sub-sections

### Body & UI Sizes
- **text-sm**: 0.875rem (14px) - Default UI text
- **text-xs**: 0.75rem (12px) - Labels, metadata
- **text-[10px]**: 0.625rem (10px) - Micro-text, badges

## Usage Patterns

### Headline Font (Manrope)
Used for:
- Page titles (`Projects`, `Dashboard`)
- Section headers (`Add Data Source`, `Mapping`)
- Chart titles and metrics
- Navigation branding

**Examples:**
```tsx
<h2 className="font-headline text-3xl font-extrabold">Projects</h2>
<h3 className="font-headline text-lg font-bold">Mapping</h3>
```

### Body Font (Inter)
Used for:
- All UI text and labels
- Form inputs and placeholders
- Button text
- Navigation items
- General content

**Examples:**
```tsx
<span className="font-body text-sm font-medium">Menu</span>
<input className="text-sm text-on-surface" />
```

### Mono Font (JetBrains Mono)
Used for:
- Code snippets and API URLs
- JSON data display
- Technical identifiers
- Debug information

**Examples:**
```tsx
<pre className="font-mono text-xs">{"key": "value"}</pre>
<span className="font-mono text-sm">https://api.example.com</span>
```

## Font Weight Strategy

### Editorial Hierarchy
- **Extra-bold (800)**: Hero metrics, large numbers
- **Bold (600-700)**: Primary headlines, section titles
- **Medium (500)**: Sub-headings, emphasized UI text
- **Regular (400)**: Default body text
- **Light (300)**: Supporting text, descriptions

### UI Weight Mapping
- **font-bold**: 600-700 (Headlines, buttons)
- **font-semibold**: 600 (Secondary headings)
- **font-medium**: 500 (Labels, navigation)
- **font-normal**: 400 (Body text)
- **font-light**: 300 (Descriptions)

## Responsive Typography

### Mobile Adjustments
- Smaller font sizes on mobile devices
- `text-xs sm:text-sm` for responsive buttons
- `text-xl lg:text-2xl` for responsive headlines

### Line Height & Spacing
- `tracking-tight`: Headlines (-0.025em)
- `tracking-tighter`: Large headlines (-0.05em)
- Normal tracking for body text
- Consistent vertical rhythm with spacing utilities

## Special Typography

### Micro Text
- **text-[10px]**: Badges, timestamps, breadcrumbs
- Used with `uppercase` and `tracking-widest` for metadata

### Code Display
- `font-mono` with `text-xs` for JSON/API data
- `whitespace-pre-wrap` for readable code blocks
- `break-all` for long URLs in tight spaces

### Emphasis & States
- `font-extrabold`: Maximum emphasis for hero elements
- `font-semibold`: Moderate emphasis for sub-headings
- Weight changes on hover/active states for interactive elements

## Font Loading
```html
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

## Performance Considerations
- `display=swap` for optimal loading
- Limited weight range per font family
- System font fallbacks included
- Preloaded critical weights (400, 600, 700)

## Accessibility
- High contrast ratios maintained across weights
- Minimum 14px for body text (WCAG compliance)
- Consistent hierarchy for screen readers
- Semantic HTML5 heading structure
