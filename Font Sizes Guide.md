# Font Sizes Guide

## Complete Typography Scale (Smallest to Largest)

### 1. text-[10px] - 0.625rem (10px)
**Use Cases:**
- Badges and timestamps
- Metadata and breadcrumbs
- Form field labels
- Status indicators

**Examples:**
```tsx
<span className="text-[10px] font-bold uppercase tracking-widest">EDITED 1HR AGO</span>
<label className="text-[10px] font-bold uppercase tracking-widest">ENTER API URL</label>
```

### 2. text-xs - 0.75rem (12px)
**Use Cases:**
- Button text on small buttons
- Stepper labels and tooltips
- Chart data labels
- Form helper text
- Navigation micro-text

**Examples:**
```tsx
<span className="text-xs font-medium">Add Metric Slot</span>
<button className="text-xs sm:text-sm">Add New Chart</button>
<span className="text-xs font-medium text-center">Step 1 of 2</span>
```

### 3. text-sm - 0.875rem (14px)
**Use Cases:**
- Default UI text and labels
- Form inputs and placeholders
- Button text (standard size)
- Navigation items
- Supporting descriptions

**Examples:**
```tsx
<input className="text-sm text-on-surface placeholder:text-on-surface-variant" />
<span className="text-sm font-medium">Menu</span>
<button className="text-sm font-medium">Save Changes</button>
```

### 4. text-base - 1rem (16px)
**Use Cases:**
- Body paragraph text
- Longer descriptions
- Content text (not commonly used in current UI)

### 5. text-lg - 1.125rem (18px)
**Use Cases:**
- Sub-section headings
- Large button text
- Card subtitles
- Secondary navigation items

**Examples:**
```tsx
<span className="font-headline font-bold text-lg">Menu</span>
```

### 6. text-xl - 1.25rem (20px)
**Use Cases:**
- Card titles
- Section headers
- Dashboard page title
- Modal titles

**Examples:**
```tsx
<h2 className="font-headline text-xl font-bold">Dashboard</h2>
<h2 className="text-xl font-headline font-semibold">Dashboard</h2>
```

### 7. text-2xl - 1.5rem (24px)
**Use Cases:**
- Large section titles
- Chart titles
- Hero card titles
- Main page headings

**Examples:**
```tsx
<h2 className="font-headline text-2xl font-bold">Dashboard</h2>
<h3 className="text-2xl font-bold font-headline">{chartName}</h3>
```

### 8. text-3xl - 1.875rem (30px)
**Use Cases:**
- Page titles
- Hero metrics
- Large display text
- Main branding elements

**Examples:**
```tsx
<h2 className="font-headline text-3xl font-extrabold">Projects</h2>
```

## Responsive Variants

### Mobile-First Scaling
```tsx
// Buttons: Smaller on mobile, larger on desktop
text-xs sm:text-sm

// Headlines: Larger on desktop
text-xl lg:text-2xl
```

### Common Responsive Patterns
- **text-xs sm:text-sm**: Small buttons and UI elements
- **text-xl lg:text-2xl**: Section headers and titles
- **text-sm**: Often used without responsive variants for consistency

## Font Size by Component Type

### Navigation & Stepper
- Stepper dots: `text-xs`
- Stepper labels: `text-sm`
- Navigation items: `text-sm`
- Mobile step counter: `text-xs`

### Forms & Inputs
- Labels: `text-[10px]`
- Input text: `text-sm`
- Helper text: `text-xs`
- Button text: `text-xs` (small) or `text-sm` (standard)

### Cards & Sections
- Card titles: `text-xl` or `text-2xl`
- Section headers: `text-lg` or `text-xl`
- Supporting text: `text-sm`
- Metadata: `text-[10px]` or `text-xs`

### Data & Code
- JSON display: `text-xs font-mono`
- API URLs: `text-sm font-mono`
- Chart labels: `text-xs`
- Data values: `text-sm` or `text-lg`

## Best Practices

### Hierarchy Guidelines
1. **Page titles**: `text-3xl` (30px)
2. **Section titles**: `text-xl` to `text-2xl` (20-24px)
3. **Card titles**: `text-xl` (20px)
4. **Body text**: `text-sm` (14px)
5. **Labels & metadata**: `text-[10px]` to `text-xs` (10-12px)

### Accessibility Notes
- Minimum readable size: `text-sm` (14px) for body content
- `text-xs` (12px) acceptable for non-critical UI elements
- `text-[10px]` (10px) only for badges and metadata
- Maintain 4.5:1 contrast ratio for all text sizes

### Mobile Considerations
- Avoid `text-[10px]` for critical mobile interactions
- Use `text-xs sm:text-sm` for better mobile tap targets
- Consider larger sizes for primary mobile actions
