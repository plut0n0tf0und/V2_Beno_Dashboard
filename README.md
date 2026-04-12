# 🍱 Bento Dashboard

Welcome to the Bento Dashboard! A dynamic, highly interactive, visually striking React application designed to transform raw JSON data streams into premium, geometric, drag-and-drop dashboard interfaces.

## 🌟 Overview (For Product Managers & Designers)

The core mission of Bento Dashboard is to make complex API data *feel* good to look at and interact with. We built this tool focusing heavily on aesthetics and smooth interactions under our custom **"Architectural Lens"** design philosophy. 

### Key Product Highlights:
- **Instant Visualizations**: Connect to any raw JSON API source, securely map data fields to an axis, and instantly generate interactive charts.
- **Premium Interactivity**: Charts aren't static images. You can long-press and seamlessly reorder them into custom layouts using native physical drag-and-drop physics.
- **"Architectural Lens" Design**: 
    - No harsh borders. Elements sit in a deeply layered shadow environment using tonal surfacing (inspired by Material 3 but custom-styled).
    - Perfect physics tracking (buttery smooth scrolling and panning interactions).
- **Responsive Workspace**: Clean, distraction-free "focus mode" workspace sidebars that collapse and expand logically based on user flow.

## 🛠️ How It Works (The User Flow)

1. **Enter a Workspace:** Open a project and you are greeted by an empty canvas and a sidebar.
2. **Connect Data:** Paste an API URL. The app lets you "preview" the raw data packet inside a modal to be completely certain of the structure before proceeding.
3. **Map the Data:** Once the URL is saved, dropdown menus unlock. You choose a chart type (Bar, Line, Pie, Radar, Scatter, Histogram, Area). You assign JSON "keys" to your X and Y axes.
4. **Generate & Play:** Click "Select Label & Value", pick the specific data rows you want to surface, give it a name, and save. The chart springs into existence on the dashboard canvas.
5. **Arrange:** Create multiple charts and drag-and-drop them to arrange your ultimate dashboard layout.

## 💻 Technical Stack (For Developers)

We built this prioritizing performance, modern rendering, and clean physics logic.

*   **Core:** React 19 + TypeScript + Vite
*   **Styling Engine:** Tailwind CSS v4 (Using a highly customized CSS-variable driven theme for tonal layering—avoiding strict static hex colors).
*   **Interaction & Physics:** `motion/react` (Framer Motion) for complex grid reordering, modal scaling, and chart geometry transitions.
*   **Scroll Engine:** `lenis` for normalized, high-precision scrolling independent of the browser's native scrollbar jank.
*   **Icons:** `lucide-react`

### Architectural Notes

- **Scroll Segregation:** The overarching app body scroll is locked. We use independent `Lenis` engines for the side panel and the main canvas. This allows "overscroll-contain" logic, preventing the panels from accidentally scrolling each other.
- **Geometric Render Engine:** The `BentoChart.tsx` logic renders pure geometric SVG paths derived from Framer Motion. This means charts never collapse based on percentage heights and dynamically redraw based on resizing constraints.
- **Strict Z-Indexing:** Modal overlays exist at `z-100`, persistent navs at `z-80`, active interactions at `z-70`. This prevents overlap clipping when reordering complex SVGs underneath overlay layers.

## 🚀 Running Locally

If you want to spin the application up on your own machine:

1. Clone this repository.
2. Ensure you have Node.js installed.
3. Run `npm install` to download dependencies.
4. Run `npm run dev` to start the local Vite development server.

---
*Crafted for data legibility.*
