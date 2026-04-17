# 📊 Bento Dashboard: The Charting Engine

Forget heavy libraries that bloat your bundle. We built these charts from scratch to keep the dashboard snappy and looking premium.

## 🛠 How We Built It
Instead of dragging in 500KB of "charting logic," we used:
- **Raw SVG & HTML**: Every bar, line, and radar point is a native element. This means 100% control over colors, gradients, and shadows.
- **Framer Motion (`motion`)**: This is the magic. It handles the entrance animations (bars growing, paths drawing) and the hover states.
- **Tailwind CSS**: Used for the layout and the "glassmorphism" effects that make the cards pop.

### The Chart Types
1. **Bar & Histogram**: Flexbox-powered divs with dynamic heights.
2. **Line & Area**: SVG `<path>` elements with calculated `d` attributes.
3. **Pie**: SVG `<path>` arcs calculated on the fly.
4. **Radar**: A multi-point pentagon/hexagon generated using trigonometry.

---

## 🚀 "Better" Options (When to Scale Up)
Our custom approach is perfect for **visual quality** and **performance**, but if this project grows to handle millions of data points or complex interactive axes, here’s where you should look:

| Library | Why use it? | Trade-off |
| :--- | :--- | :--- |
| **[Recharts](https://recharts.org/)** | Industry standard for React. Has everything built-in. | Can be heavy and hard to style "outside the box." |
| **[D3.js](https://d3js.org/)** | The "Godzilla" of data viz. You can build anything. | Massive learning curve. Overkill for simple dashboards. |
| **[Visx](https://airbnb.io/visx/)** | Airbnb's tool. Best of both worlds: D3 power + React components. | Requires more setup than simple libraries. |
| **[Chart.js](https://www.chartjs.org/)** | Canvas-based. Fast rendering for huge datasets. | Harder to style with CSS (since it's not DOM-based). |

## 💡 The Verdict
We chose **Custom SVG + Framer Motion** because:
- **Zero Overhead**: Your users don't download a library they don't need.
- **Perfect Aesthetics**: No "default" looks. It fits your design system perfectly.
- **Animations**: The transitions look better than what most libraries offer out of the box.

*Stick with this until you need complex features like Zoom/Pan, multi-axis scales, or massive time-series data.*

---

## 🏗️ Grid & Resizing Logic (The "Bento" Engine)
Since we didn't use a library with built-in resizing, we had to coordinate between the **Dashboard Grid** and the **SVG Chart logic**. Here is how we did it:

### 1. The Dashboard Grid (`react-grid-layout`)
We use **`react-grid-layout`** to manage the "Bento Box" arrangement.
- **Auto-Placement**: When a new chart is created, we set the layout coordinate `y: Infinity`. This tells the engine to find the first available empty hole in the grid instead of overlapping existing charts.
- **Breakpoints**: We defined specific columns for `lg (12)`, `md (10)`, and `sm (6)`. This ensures that on a phone, everything stacks into 1 column naturally.

### 2. Chart Component "Self-Resizing"
How do the SVG lines and bars stay sharp when the card is resized?
- **ViewBox Strategy**: Most charts use `viewBox="0 0 400 200"` but are contained in a div with `absolute inset-0`. This allows the SVG to stretch and fill whatever size the `react-grid-layout` card becomes.
- **Percentage Heights**: For Bar and Histogram charts, we didn't use fixed pixels. We calculated the height as a percentage: 
  `height: (value / maxValue) * 100%`.
  This means if you drag the card corner to make it taller, the bars grow proportionally.

### 3. Smart Scaling Logic
In the `ProjectDetails.tsx` file, we calculate "Smart Minimums" so charts don't break when made too small:
```typescript
const itemCount = chart.data.length;
// Ensures a chart with 20 items doesn't shrink smaller than 6 columns wide
const minW = Math.max(3, Math.ceil(itemCount / 3)); 
const minH = Math.max(3, Math.ceil(itemCount / 8));
```

### 4. Implementation Details
- **Drag Handles**: We used `.drag-handle` in the card header. This separates the "Move" action from the "Menu Click" action so users don't accidentally drag the chart when trying to edit it.
- **Animation Sync**: When a card is resized, Framer Motion automatically re-animates the contents to fit the new dimensions smoothly.
