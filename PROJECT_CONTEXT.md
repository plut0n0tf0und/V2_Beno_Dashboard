# Bento Dashboard - Project Context

## Overview
A dynamic, mobile-responsive React 19 + TypeScript + Vite dashboard application featuring a custom "Architectural Lens" design system. The app allows users to seamlessly map raw JSON API data into interactive, drag-and-drop geometric charts using premium physics and fluid UI tracking.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (Custom CSS variable-driven theme, no borders, tonal layering)
- **Animations & Interaction**: `motion/react` (Framer Motion)
- **Scrolling Physics**: `lenis` (Provides buttery smooth native precision scrolling)
- **Icons**: Lucide React
- **Development**: Local environment (http://localhost:3001)

## Application Flow (End-to-End)

1. **Landing & Navigation (`Home.tsx`)**:
   - The user opens the app to a pristine home dashboard listing active projects.
   - The global layout utilizes the `HomeNavbar` and a collapsible `Sidebar` for general navigation.
   - The user clicks on a project card to enter the workspace, instantly shifting the layout to the minimal `ProjectNavbar` and hiding the sidebar for maximum interface real estate.

2. **Data Source Integration (`ProjectDetails.tsx` - Left Panel)**:
   - The workspace operates on a dual-column layout (stacking vertically on mobile, sitting side-by-side on desktop). 
   - **Step 1:** The user pastes their JSON/API URL in the "Connect via API" input box. *(Condition: The "Preview Data" button is exclusively enabled ONLY when this input is not mathematically empty `apiUrl.trim().length > 0`)*.
   - **Step 2:** User clicks "Preview Data". This triggers the `PreviewDataSourceModal`, presenting them with a visual breakdown of the fetched URL alongside a scrollable raw JSON structure.
   - **Step 3:** The user MUST structurally verify the data payload by checking the required confirmation checkbox ("I am able to view the data..."). *(Condition: The "Save URL as resource" CTA is strictly disabled until this exact checkbox evaluates to `true`)*. Once checked, the user clicks Save.
   - The Data Source section automatically collapses cleanly securely locking the URL target, and the Mapping section automatically opens.

3. **Data Mapping (`ProjectDetails.tsx` - Left Panel)**:
   - *(Condition: This entire sequence is locked and disabled until the user successfully saves a Source URL (`isSourceSaved === true`))*
   - The user selects a visual format from the active dropdown (Bar Chart, Line Chart, Pie Chart, Area Chart, Histogram, Scatter Plot, Radar Chart).
   - The user maps the JSON object keys to visual axes: selecting a "type of label" (X-axis/Key) and a "type of value" (Y-axis/Metric).
   - *(Condition: The `Select Label & Value` final mapping CTA is structurally disabled. It ONLY becomes clickable when `!selectedChart || !selectedLabel || !selectedValue` evaluates to false, meaning all 3 dropdowns must be actively selected.)*
   - The user clicks `Select Label & Value`. This seamlessly summons the interactive `DataSelectionModal`.
   - Inside the modal, the user selects specific rows from the payload and types a final `Chart Name`. *(Condition: The modal's final "Save Configuration" commit button is strictly disabled unless at least one data row is checked AND a string chart name is inputted)*.

4. **Dashboard Generation & Interaction (`ProjectDetails.tsx` - Right Panel)**:
   - The finalized chart instantly generates sequentially inside the right-hand Dashboard panel as a fully mathematically scaled `BentoChart` component.
   - **Chart Editing:** The user can instantly jump back to editing the mapping logic or rename the chart by clicking the persistent top-right 3-dot menu inside any chart container (triggering `EditNameModal`).
   - **Reordering Elements:** The user can smoothly long-press (2000ms delay) anywhere inside a chart tile to detach it from the CSS grid and seamlessly drag-and-drop it into a newly sorted stack using Framer Motion's `Reorder` physics.
   - **Add New Chart:** Clicking the `(+) Add New Chart` CTA in the top right dashboard header natively glides the user perfectly back to the top of the mapping interface and resets all input trackers.

## Architectural Design Rules (Architectural Lens)
- **Glassmorphism & Tonal Layering**: Deeply layered shadow architecture relies purely on component shades (`bg-surface-container-low`, `bg-on-surface-variant`, etc.). Absolutely no generic hard CSS borders.
- **Scroll Segregation**: The app strictly bypasses nested CSS browser scrollbars to avoid mouse-trapping. The main window frame has locked body-scrolling (`lg:overflow-hidden`), authorizing independent dual `Lenis` smooth-scroll tracking engines to govern the left and right panels with physics-based `overscroll-contain` limits.
- **Strict Z-Index Hierarchy**:
  - `z-[100]`: Focal Interrupters (All Modals).
  - `z-[80]`: Top Navigational Bars (`ProjectNavbar`, `HomeNavbar`).
  - `z-[70]`: Highlighted active mapping editors (bouncing overlay state).
  - `z-[60] - z-[0]`: Standard interface layers and generated charts.

## Core Component Index
- **`App.tsx`**: Central orchestrator. Manages full layout state, theme toggling, global structural modal variables, dummy-data bridging, and active routing changes.
- **`BentoChart.tsx`**: The core geometric visualization engine. Processes mapped JSON array physics securely into pure Framer Motion geometries (paths, circles, polygons) via mathematical strict limits (`absolute inset-0`), ensuring cross-browser dynamic SVG rendering never faces `%` height collapses.
- **`ProjectDetails.tsx`**: The split-viewport controller dividing Data Input (Left) and Interactive Dashboard Canvas (Right) and binding their structural updates.

## Current Project State
The application layout structure, animation physics, and mapping workflows are entirely fully implemented and locked-in. It is mobile-first responsive and specifically tuned for top-tier aesthetic fluidity. All CSS logic, scroll constraints, z-index clashing, and SVG NaN crashing variables have been actively debugged to a stable, production-ready aesthetic front end.
