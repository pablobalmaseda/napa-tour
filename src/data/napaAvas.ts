export interface AvaFeatureProperties {
  id: string;
  name: string;
  established: number;
  elevation: string;
  climate: string;
  keyGrapes: string[];
  color: string;
  activeForSlideIds: number[];
}

export interface AvaFeature {
  type: "Feature";
  properties: AvaFeatureProperties;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface AvaFeatureCollection {
  type: "FeatureCollection";
  features: AvaFeature[];
}

export const napaAvasGeoJSON: AvaFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "calistoga",
        name: "Calistoga AVA",
        established: 2010,
        elevation: "300 - 1,200 ft",
        climate: "Warmest sub-appellation; dramatic diurnal shift",
        keyGrapes: ["Cabernet Sauvignon", "Zinfandel", "Syrah"],
        color: "#c98f32",
        activeForSlideIds: [2]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.615, 38.560],
            [-122.628, 38.605],
            [-122.570, 38.640],
            [-122.520, 38.610],
            [-122.535, 38.565],
            [-122.585, 38.545],
            [-122.615, 38.560]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "diamond-mountain",
        name: "Diamond Mountain District AVA",
        established: 2001,
        elevation: "400 - 2,200 ft",
        climate: "Mountain climate above fog line; volcanic tufa",
        keyGrapes: ["Cabernet Sauvignon", "Chardonnay", "Cabernet Franc"],
        color: "#d4af37",
        activeForSlideIds: [2]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.585, 38.545],
            [-122.615, 38.560],
            [-122.590, 38.580],
            [-122.545, 38.570],
            [-122.540, 38.545],
            [-122.585, 38.545]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "russian-river-valley",
        name: "Russian River Valley AVA",
        established: 1983,
        elevation: "70 - 700 ft",
        climate: "Cool Pacific marine fog intrusion via Russian River & Petaluma Gap",
        keyGrapes: ["Sauvignon Blanc", "Pinot Noir", "Chardonnay"],
        color: "#5b92e5",
        activeForSlideIds: [3]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.950, 38.520],
            [-122.920, 38.630],
            [-122.820, 38.640],
            [-122.750, 38.560],
            [-122.770, 38.430],
            [-122.880, 38.420],
            [-122.950, 38.520]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "st-helena",
        name: "St. Helena AVA",
        established: 1995,
        elevation: "150 - 475 ft",
        climate: "Warm central valley; heat trapped by narrow mountains",
        keyGrapes: ["Cabernet Sauvignon", "Zinfandel", "Merlot"],
        color: "#b8860b",
        activeForSlideIds: [4, 8]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.535, 38.565],
            [-122.520, 38.530],
            [-122.450, 38.490],
            [-122.420, 38.515],
            [-122.470, 38.555],
            [-122.520, 38.575],
            [-122.535, 38.565]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "howell-mountain",
        name: "Howell Mountain AVA",
        established: 1983,
        elevation: "1,400 - 2,400 ft",
        climate: "Cool mountain temperatures above fog; intense sunlight",
        keyGrapes: ["Cabernet Sauvignon", "Zinfandel", "Merlot"],
        color: "#9370db",
        activeForSlideIds: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.470, 38.555],
            [-122.420, 38.515],
            [-122.380, 38.540],
            [-122.390, 38.610],
            [-122.460, 38.620],
            [-122.470, 38.555]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "rutherford",
        name: "Rutherford AVA",
        established: 1993,
        elevation: "155 - 500 ft",
        climate: "Moderate valley heat; legendary 'Rutherford Dust' alluvium",
        keyGrapes: ["Cabernet Sauvignon", "Merlot", "Sauvignon Blanc"],
        color: "#cd7f32",
        activeForSlideIds: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.450, 38.490],
            [-122.420, 38.450],
            [-122.380, 38.460],
            [-122.390, 38.495],
            [-122.420, 38.515],
            [-122.450, 38.490]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "oakville",
        name: "Oakville AVA",
        established: 1993,
        elevation: "130 - 1,000 ft",
        climate: "Warm days, mid-afternoon cooling breeze; prime Cabernet bench",
        keyGrapes: ["Cabernet Sauvignon", "Cabernet Franc", "Merlot"],
        color: "#e5c378",
        activeForSlideIds: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.420, 38.450],
            [-122.385, 38.410],
            [-122.345, 38.420],
            [-122.355, 38.450],
            [-122.380, 38.460],
            [-122.420, 38.450]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "yountville",
        name: "Yountville AVA",
        established: 1999,
        elevation: "20 - 200 ft",
        climate: "Cool bay breezes and morning fog; gravelly silt loam",
        keyGrapes: ["Cabernet Sauvignon", "Merlot"],
        color: "#c5a059",
        activeForSlideIds: [5]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.385, 38.410],
            [-122.355, 38.365],
            [-122.320, 38.375],
            [-122.325, 38.405],
            [-122.345, 38.420],
            [-122.385, 38.410]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "stags-leap",
        name: "Stags Leap District AVA",
        established: 1989,
        elevation: "66 - 400 ft",
        climate: "Palisades afternoon heat radiation & cooling bay funnel breezes",
        keyGrapes: ["Cabernet Sauvignon", "Merlot"],
        color: "#e6b422",
        activeForSlideIds: [6, 7]
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.335, 38.425],
            [-122.285, 38.440],
            [-122.275, 38.395],
            [-122.315, 38.385],
            [-122.325, 38.405],
            [-122.335, 38.425]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "mount-veeder",
        name: "Mount Veeder AVA",
        established: 1993,
        elevation: "500 - 2,600 ft",
        climate: "Steep slopes in Mayacamas; cool mountain maritime",
        keyGrapes: ["Cabernet Sauvignon", "Chardonnay", "Syrah"],
        color: "#7e57c2",
        activeForSlideIds: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.450, 38.390],
            [-122.440, 38.330],
            [-122.370, 38.320],
            [-122.380, 38.380],
            [-122.420, 38.410],
            [-122.450, 38.390]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "oak-knoll",
        name: "Oak Knoll District AVA",
        established: 2004,
        elevation: "Sea level - 800 ft",
        climate: "Substantial marine cooling and morning fog blanket",
        keyGrapes: ["Chardonnay", "Cabernet Sauvignon", "Merlot"],
        color: "#4682b4",
        activeForSlideIds: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.355, 38.365],
            [-122.340, 38.315],
            [-122.280, 38.325],
            [-122.295, 38.375],
            [-122.320, 38.375],
            [-122.355, 38.365]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "los-carneros",
        name: "Los Carneros AVA",
        established: 1983,
        elevation: "Sea level - 700 ft",
        climate: "Maritime cool climate directly off San Pablo Bay",
        keyGrapes: ["Pinot Noir", "Chardonnay", "Sparkling"],
        color: "#20b2aa",
        activeForSlideIds: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.380, 38.290],
            [-122.360, 38.200],
            [-122.250, 38.210],
            [-122.260, 38.285],
            [-122.340, 38.315],
            [-122.380, 38.290]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "coombsville",
        name: "Coombsville AVA",
        established: 2011,
        elevation: "100 - 1,000 ft",
        climate: "Ancient caldera cup; tempered by fog and volcanic soils",
        keyGrapes: ["Cabernet Sauvignon", "Chardonnay", "Syrah"],
        color: "#8fbc8f",
        activeForSlideIds: []
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.280, 38.325],
            [-122.240, 38.260],
            [-122.190, 38.270],
            [-122.210, 38.335],
            [-122.260, 38.345],
            [-122.280, 38.325]
          ]
        ]
      }
    }
  ]
};
