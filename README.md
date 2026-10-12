# 🍷 Napa Valley Wine Tasting — Terroir & Heritage Tour

An interactive, high-end sommelier presentation web application crafted for a curated Napa Valley & Northern California wine tasting flight. Features 3D terrain flyover animations, interactive American Viticultural Area (AVA) comparative boundary layers, authentic vector winery logos, detailed tasting notes, and chef culinary pairings with recipe links.

---

## 🍇 Curated 7-Bottle Flight

| Stop | Wine & Vintage | Sub-Appellation / AVA | Winery Code | Highlight Culinary Pairing |
|:---:|---|---|:---:|---|
| **01** | **Schramsberg Blanc de Blancs 2022** | Calistoga / North Coast | `SCHR` | Caviar & crème fraîche on potato chip / [Caramelized Onion, Apple & Goat Cheese Melts](https://cooking.nytimes.com/recipes/1021491-caramelized-onion-apple-and-goat-cheese-melts?eafs_enabled=false) |
| **02** | **Gracianna Sauvignon Blanc 2023** | Russian River Valley (Healdsburg) | `GRAC` | Potato Leek Soup ([Simply Recipes](https://www.simplyrecipes.com/recipes/potato_leek_soup/) / [NYT Cooking](https://cooking.nytimes.com/recipes/1025764-potato-leek-soup)) |
| **03** | **Turley 'Old Vines' Zinfandel 2023** | St. Helena | `TURL` | Pepperoni pizza |
| **04** | **Dominus 'Napanook' 2023** | Yountville | `DOMN` | Arugula salad with blue cheese, pine nuts & lemon vinaigrette |
| **05** | **Stag’s Leap Wine Cellars 'ARTEMIS' 2022** | Stags Leap District | `SLWC` | Beef & pork meatballs in a blackberry reduction |
| **06** | **Shafer 'One Point Five' 2023** | Stags Leap District (Hillside) | `SHAF` | Short Rib [Ragu](https://www.joshuaweissman.com/recipes/best-short-rib-ragu-pasta-recipe) |
| **07** | **AXR Cabernet Sauvignon 2016** | St. Helena | `AXR` | Chocolate truffles |

---

## ✨ Features

- **Interactive 3D Mapbox GL**: Smooth flyover camera animations connecting stops with elevation, pitch, and bearing calculations.
- **AVA Boundary Overlays**: Visualizes American Viticultural Areas (Calistoga, Diamond Mountain, St. Helena, Yountville, Stags Leap District, Russian River Valley, etc.) with custom GeoJSON polygons.
- **Bespoke Vector SVG Winery Logos**: Authentic brand emblems and heraldry for Schramsberg, Gracianna, Turley, Dominus, Stag's Leap Wine Cellars, Shafer, and AXR.
- **Sommelier Palate Profile**: Verbatim aromatics, tasting note tags, elevation gradients, and geological soil profiles.
- **Culinary Pairings**: Curated dishes and clickable recipe links formatted with external browser shortcuts.
- **Presentation Mode**: Auto-tour option (9s per stop) and fast-jump route drawer navigation.
- **Dark Luxury Aesthetic**: Deep charcoal background tones, champagne gold accents, and classic serif typography (Cinzel & Playfair Display).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

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

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Mapbox GL JS**
- **Lucide Icons**
