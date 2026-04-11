# Design System Document: Precision & Depth

## 1. Overview & Creative North Star
### Creative North Star: "The Architectural Lens"
This design system is built on the philosophy of **Architectural Lens**. It rejects the "flatness" of typical SaaS dashboards in favor of a UI that feels constructed from physical layers of light and material. It is a high-density, editorial environment designed for clarity and authority.

By moving away from traditional grid lines and high-contrast separators, we create an environment where data is the protagonist. The system uses intentional asymmetry, generous breathing room (white space), and a sophisticated hierarchy of "nested" surfaces to guide the eye. It is "Bento" by structure, but "Editorial" by soul.

---

## 2. Colors & Surface Logic

### The "No-Line" Rule
**Strict Mandate:** Traditional 1px solid borders for sectioning are prohibited. Boundaries are defined through:
1.  **Background Color Shifts:** Use `surface-container-low` for page backgrounds and `surface-container` for card backgrounds.
2.  **Tonal Transitions:** Creating a "valley" or "peak" effect by nesting colors.

### Palette & Tokens (Dark Mode Reference)
| Token | Hex | Role |
| :--- | :--- | :--- |
| `surface` | `#0E0E0E` | The deepest base layer. |
| `surface-container-low` | `#131313` | Primary page background. |
| `surface-container` | `#191A1A` | Standard card/bento container. |
| `surface-container-high`| `#1F2020` | Hover states and active elevated elements. |
| `primary` | `#C6C6C7` | Key interactions and high-level typography. |
| `tertiary` | `#679CFF` | Data accents and system "intelligence" indicators. |
| `error` | `#EC7C8A` | Critical alerts and destructive actions. |

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of frosted glass. 
- **The Page:** `surface-container-low`
- **The Bento Card:** `surface-container`
- **Nested Controls (Inputs/Inner Cards):** `surface-container-lowest` or `surface-container-high` depending on whether you want a "carved in" or "lifted" look.

### The "Glass & Gradient" Rule
To elevate the UI beyond standard SaaS:
- **Glassmorphism:** Use `surface-container` with 80% opacity and a `backdrop-blur: 20px` for floating navigation bars or context menus.
- **Signature Textures:** Apply a subtle linear gradient to the Primary CTA (`primary` to `primary_dim`) at a 135-degree angle to provide a tactile, metallic sheen.

---

## 3. Typography
We utilize a dual-font strategy to balance editorial authority with high-density utility.

### Typeface Roles
- **Manrope:** Used for `Display` and `Headline`. It provides a modern, geometric character for high-level numbers and page titles.
- **Inter:** Used for `Title`, `Body`, and `Label`. Chosen for its extreme legibility in data-heavy mapping tables and small captions.

### Scale & Weight
- **Display LG (Manrope 3.5rem / Medium):** For "Hero" metrics inside bento cards.
- **Headline SM (Manrope 1.5rem / Semibold):** Section titles like "Manage Data Source."
- **Title SM (Inter 1rem / Medium):** Input labels and table headers.
- **Label SM (Inter 0.6875rem / Regular):** Metadata, "Edited 1hr ago," and breadcrumbs.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. 
- To make a card appear "active," transition its background from `surface-container` to `surface-container-high`. 
- For the "Mapping Table" in the provided screens, use `surface-container-lowest` for the inner rows to create a "well" effect, making the data feel nested within the bento.

### Ambient Shadows
Avoid the "drop shadow" look. Use **Ambient Occlusion Shadows**:
- **Level 1 (Default Card):** No shadow, just color shift.
- **Level 3 (Modal/Overlay):** `shadow-color: rgba(0,0,0, 0.4)`, `blur: 40px`, `spread: -10px`. The shadow should feel like a soft glow of darkness.

### The "Ghost Border" Fallback
Where contrast is required for accessibility (e.g., Input fields), use a **Ghost Border**:
- `outline-variant` @ 15% opacity. It should be felt, not seen.

---

## 5. Components

### Curved CTA ("Add Data")
- **Style:** Pill-shaped (`rounded-full`), utilizing a high-contrast `primary` background with `on-primary` text.
- **Signature Detail:** A subtle 1px inner-glow (border-top) using `primary_fixed` @ 30% to give it a 3D pressed-metal look.

### Mapping Table (2-Column Logic)
- **Container:** No outer border. Use a `surface-container-lowest` background.
- **Rows:** Separate rows with `8px` of vertical white space instead of divider lines.
- **Interaction:** On hover, a row should transition to `surface-bright` with a `2px` left-accent border of `tertiary`.

### Inputs & Selects
- **Base:** `surface-container-highest` background.
- **Focus State:** 0px border, but a 2px outer "ring" of `primary` @ 40% opacity with a soft blur.
- **Numbers:** Use tabular numbers (monospaced) for all data inputs to ensure alignment.

### Bento Cards
- **Padding:** 24px (Scale: 6).
- **Header:** Always separate the header and action area using a `title-sm` font. Use `on-surface-variant` for muted descriptions.

---

## 6. Do's and Don'ts

### Do
- **Do** use `tertiary` (#679CFF) sparingly to highlight "Intelligence" or "Active Data Streams."
- **Do** maximize "Data Density" by using `body-sm` (12px) for table content, but keep titles large and bold.
- **Do** use `backdrop-blur` on modals to maintain the user's context of the dashboard behind the mapping logic.

### Don't
- **Don't** use solid black (#000000) for shadows. Use a tinted version of the background.
- **Don't** use "Divider Lines." If the UI feels cluttered, increase the spacing from `8px` to `16px` rather than adding a line.
- **Don't** use high-saturation colors for "Success" or "Warning." Use the semantic `error_dim` or `success` tokens to prevent eye fatigue during long analytics sessions.
- **Don't** allow cards to have different corner radii. Stick strictly to `xl` (0.75rem) for main containers and `md` (0.375rem) for internal elements.
