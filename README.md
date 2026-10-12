# 🍷 Napa Valley Wine Tasting — Terroir & Heritage Tour

An interactive, high-end sommelier presentation web application crafted for a curated Napa Valley & Northern California wine tasting flight. Features 3D terrain flyover animations, interactive American Viticultural Area (AVA) comparative boundary layers, authentic vector winery logos, detailed tasting notes, and chef culinary pairings.

Optimized for **living room & tasting room TV presentations** with zero-scroll layouts and wireless presentation clicker controls.

---

## 📺 Presentation Modes (Switch via UI or Key `V`)

1. **Classic Sidebar (V1)**: The original full scrolling sidebar showing all sections simultaneously.
2. **TV Tabs (Mode A)**: Zero-scroll 3-tab sidebar with large, readable fonts from across the room:
   - `[1] Story & Terroir`
   - `[2] Palate Profile`
   - `[3] Culinary Pairing` (clean dishes, no recipe links)
3. **Cinematic TV (Mode B)**: **100% full-screen immersive 3D map** with a floating horizontal glass lower-third console across the bottom of the TV screen.

### 🎮 Keyboard & Clicker Shortcuts

| Key | Action |
|:---:|---|
| `→` / `Space` / `PageDown` | Advance to next wine flight stop |
| `←` / `PageUp` | Go back to previous wine flight stop |
| `1` / `2` / `3` | Switch directly between Story, Palate, and Food tabs |
| `↑` / `↓` | Cycle up/down through tabs on the current wine |
| `V` | Cycle through Layout Modes (`Classic` → `TV Tabs` → `Cinematic`) |
| `R` | Toggle Mobile Companion Remote QR code modal |
| `Esc` | Close dropdowns / modals |

---

## 🍇 Curated 7-Bottle Flight

| Stop | Wine & Vintage | Sub-Appellation / AVA | Winery Code | Highlight Culinary Pairing |
|:---:|---|---|:---:|---|
| **01** | **Schramsberg Blanc de Blancs 2022** | Calistoga / North Coast | `SCHR` | Caviar & crème fraîche on potato chip / Caramelized Onion, Apple & Goat Cheese Melts |
| **02** | **Gracianna Sauvignon Blanc 2023** | Russian River Valley (Healdsburg) | `GRAC` | Potato Leek Soup (classic or lactose-free) |
| **03** | **Turley 'Old Vines' Zinfandel 2023** | St. Helena | `TURL` | Pepperoni pizza |
| **04** | **Dominus 'Napanook' 2023** | Yountville | `DOMN` | Arugula salad with blue cheese, pine nuts & lemon vinaigrette |
| **05** | **Stag’s Leap Wine Cellars 'ARTEMIS' 2022** | Stags Leap District | `SLWC` | Beef & pork meatballs in a blackberry reduction |
| **06** | **Shafer 'One Point Five' 2023** | Stags Leap District (Hillside) | `SHAF` | Short Rib Ragu |
| **07** | **AXR Cabernet Sauvignon 2016** | St. Helena | `AXR` | Chocolate truffles |

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/pablobalmaseda/napa-tour.git
cd napa-tour

# Install dependencies
npm install
```

### Environment Configuration (Optional)

Create a `.env.local` file in the root directory to provide your Mapbox access token for satellite layers and 3D terrain:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```
*(If omitted, the application automatically falls back to high-resolution ESRI dark canvas and OpenTopoMap tile providers).*

### Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Mapbox GL JS**
- **Lucide Icons**
