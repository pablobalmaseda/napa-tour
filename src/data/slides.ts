export interface TerroirBreakdown {
  elevation: string;
  topology: string;
  fogExposure: string;
  wineImpact: string;
}

export interface WinemakerProfile {
  name: string;
  role: string;
  bio: string;
  philosophy: string;
}

export interface SpeakerNotes {
  talkingPoints: string[];
  tastingCues: string[];
  funFacts: string[];
  pourNotes?: string;
  terroirBreakdown?: TerroirBreakdown;
  winemakerNotes?: WinemakerProfile;
}

export interface WineSlide {
  id: number;
  title: string;
  subtitle: string;
  region: string;
  coordinates: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  bearing?: number;
  story: string;
  // Enhanced presentation metadata
  vintageYear?: string;
  varietal?: string;
  elevation?: string;
  soil?: string;
  hintsOf?: string;
  tastingNotes?: string[];
  foodPairing?: string;
  pairsWellWith?: string;
  vintageWeather?: string;
  producerCode: string;
  imageUrl: string;
  imageCaption: string;
  gallery?: { url: string; caption: string }[];
  isOverview?: boolean;
  wineNumber?: number;
  winemaker?: string;
  winemakerBio?: string;
  terroirImpact?: string;
  speakerNotes?: SpeakerNotes;
}

export const slides: WineSlide[] = [
  {
    id: 1,
    title: "Welcome to Napa Valley",
    subtitle: "A Journey of Terroir",
    region: "Napa Valley, CA",
    coordinates: [-122.33, 38.40],
    zoom: 10,
    pitch: 0,
    bearing: 0,
    story: "Today we are exploring how earth, elevation, and climate shape the wine in your glass. We will travel across 7 premier stops: from the volcanic caves of North Coast and Russian River Valley, down to the historic valley floor, and up into the steep hillside terraces.",
    vintageYear: "Overview",
    varietal: "Terroir & Regional Geography",
    elevation: "Sea level to 2,600+ ft",
    soil: "33 distinct soil series across Napa & Russian River",
    hintsOf: "A curated tasting flight tracing elevation, fog corridors, and soil geology across seven distinctive expressions.",
    tastingNotes: ["Elevation Gradient", "Marine Fog Intrusion", "Volcanic Benchlands", "Ancient Heritage Vines"],
    vintageWeather: "Napa Valley Climate Dynamics: A rare Mediterranean climate (less than 0.1% of earth's surface). Marine fog from San Pablo Bay pools in low basins, creating up to 15°F temperature divergence from cool Carneros in the south to sun-drenched Calistoga in the north.",
    producerCode: "NAPA",
    imageUrl: "/wineries/napa.jpg",
    imageCaption: "Iconic Welcome to Napa Valley Sign & Rolling Estate Vineyards",
    gallery: [
      { url: "/wineries/napa.jpg", caption: "Iconic Welcome to Napa Valley Sign along Highway 29" },
      { url: "/wineries/napa-2.jpg", caption: "Rolling Benchland Vineyards & Mayacamas Mountain Foothills" },
      { url: "/wineries/napa-3.jpg", caption: "Sun-Drenched Napa Valley Floor Vines at Golden Hour" }
    ],
    isOverview: true,
    winemaker: "Historic & Modern Cellar Masters",
    winemakerBio: "Showcasing the collective mastery of Napa & Sonoma’s premier historic vintners, each translating unique geologic microclimates into the glass.",
    terroirImpact: "Elevation ranges from sea level in Carneros to 2,600+ ft in the Mayacamas. The marine fog layer pools in low valley basins up to ~1,000 ft, creating a thermal inversion where mountain vineyards are warmer at night and bathed in intense UV sunlight by day.",
    speakerNotes: {
      talkingPoints: [
        "Welcome everyone! Frame tonight's journey: We are not just tasting wine, we are tracing geology, fog lines, and 180 years of Napa Valley history.",
        "The Pioneer Era (1838–1862): Wine history began in 1838 when pioneer George Yount planted the valley's very first cultivated vines in Yountville—the exact ground of Dominus Napanook (Wine 4). In 1862, Jacob Schram founded Schramsberg (Wine 1), digging California's first volcanic aging caves.",
        "The Gold Rush Boom & 'Bottled Poetry' (1870s–1880s): Gold Rush wealth and the transcontinental railroad sparked a boom of over 140 wineries. In 1880, Robert Louis Stevenson honeymooned on Mount St. Helena and penned the famous line on the valley's sign: '...and the wine is bottled poetry.'",
        "The Dark Ages of Prohibition (1919–1933): Prohibition wiped out over 90% of wineries overnight, with walnut orchards and cattle replacing vineyards. Only ancient, deep-rooted heritage vines survived—the very vines Turley still harvests from today (Wine 3).",
        "The 1968 Agricultural Preserve: Visionary vintners passed the nation's first land preservation act, legally protecting Napa from suburban sprawl and preserving the valley exclusively for agriculture forever.",
        "The 1976 Judgment of Paris: In a blind tasting that shocked the global wine establishment, California defeated France's top first-growth Bordeaux. The winning Cabernet was Stag's Leap Wine Cellars (Wine 5), permanently establishing Napa Valley among the world's elite.",
        "Napa Valley is surprisingly compact: only 30 miles long and 5 miles wide, yet contains half of the world's soil orders (33 soil series)."
      ],
      tastingCues: [
        "Prompt guests to note how acid feels on the tongue early on vs. how tannins grip later in the red hillside flights.",
        "Encourage everyone to smell the wine twice: once immediately on the pour, and again after 60 seconds of air."
      ],
      funFacts: [
        "The name 'Napa' originates from the indigenous Wappo people who lived here for 10,000 years, commonly translated as 'land of plenty.'",
        "Napa Valley accounts for only 0.4% of the world's wine and 4% of California's volume, but its wines generate over 30% of the state's total wine economic value.",
        "When George Yount first planted grapes in 1838, he wrote that the valley looked like 'an emerald paradise waiting for a plow.'"
      ],
      pourNotes: "Serve water, ensure palate-cleansing crackers/bread are on the table, and have Schramsberg chilled at 45°F-48°F ready for Glass #1.",
      terroirBreakdown: {
        elevation: "Sea level to 2,600+ ft (Carneros to Mount Veeder / Howell Mountain)",
        topology: "Valley graben flanked by the volcanic Mayacamas Range to the west and Vaca Range to the east.",
        fogExposure: "Marine fog flows north from San Pablo Bay, creating microclimates with up to 15°F temperature divergence from south to north.",
        wineImpact: "Low-elevation valley floor vines develop plush, opulent black fruit and soft tannins. High-elevation hillside vines battle shallow volcanic rock and intense sun, producing tiny berries with double the skin-to-juice ratio, piercing acidity, and immense structural longevity."
      },
      winemakerNotes: {
        name: "Curated Vintner Flight",
        role: "Historic & Modern Legends",
        bio: "Tonight's flight features iconic cellar masters: traditional sparkling pioneers (Schramsberg), Bordeaux royalty (Christian Moueix of Château Pétrus), and hillside champions (Shafer & AXR).",
        philosophy: "Site-expressive viticulture: letting the ancient volcanic geology and elevation gradients speak rather than heavy cellar manipulation."
      }
    }
  },
  {
    id: 2,
    title: "How to Taste Wine",
    subtitle: "The 5 S's • Wine Enthusiast Method",
    region: "Sommelier Sensory Guide",
    coordinates: [-122.40, 38.46],
    zoom: 12.2,
    pitch: 84,
    bearing: -15,
    story: "Before our first pour, Wine Enthusiast distills professional wine appreciation into five essential sensory steps—the '5 S's': See, Swirl, Sniff, Sip, and Savor. Following this sequence unlocks hidden aromatics, reveals how Napa's sun and cool fog shape structure on your palate, and turns casual drinking into true tasting.",
    vintageYear: "Guide",
    varietal: "See • Swirl • Sniff • Sip • Savor",
    elevation: "3. Sniff: Fruit, Oak & Age",
    soil: "4. Sip & 5. Savor: Acid, Tannin & Finish",
    hintsOf: "3. SNIFF (The 3 Aroma Tiers): Place your nose at the rim and take two short inhales. Identify Primary aromas (fresh fruit, citrus, herbs from the grape), Secondary aromas (brioche from yeast lees, vanilla & baking spice from oak barrels), and Tertiary aromas (savory earth, cedar, dried tea & leather from bottle aging).",
    tastingNotes: [
      "1. See (Color, Rim & Legs)",
      "2. Swirl (Aerate & Release Esters)",
      "3. Sniff (Primary, Secondary, Tertiary)",
      "4. Sip (Acid vs. Tannin Balance)",
      "5. Savor (Persistence & Finish)"
    ],
    foodPairing: "4. SIP (Structure) & 5. SAVOR (Finish): Let the wine coat your entire tongue and draw in a whisper of air to evaluate Sweetness, Acidity (mouthwatering salivation), Tannin (velvety grip), Alcohol warmth, and Body.",
    pairsWellWith: "Why Structure Matters for Food: Crisp acidity (Wines 1 & 2) acts like a squeeze of lemon that slices through rich fats and cream, while bold Cabernet tannins (Wines 4–7) bind to proteins in marbled beef, making the wine taste softer and smoother.",
    vintageWeather: "1. SEE & 2. SWIRL: Tilt your glass 45° against a bright background to inspect color depth and rim age—whites deepen from pale straw to gold with oak and age, while reds shift from vibrant purple-ruby (2023) to brick garnet at the rim (our 2016 AXR). Next, keep the base flat on the table and swirl for 5 seconds: oxygenating the bowl vaporizes alcohol to carry aromatic compounds up to your nose and forms 'legs' (tears) that signal alcohol and glycerol.",
    producerCode: "TASTE",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "The Sommelier's 5 S's Ritual: See, Swirl, Sniff, Sip, Savor",
    isOverview: true,
    winemaker: "Wine Enthusiast Sommelier Protocol",
    winemakerBio: "Adapted from Wine Enthusiast's official tasting framework used by blind-tasting panels and sommeliers worldwide to evaluate quality, complexity, and typicity.",
    terroirImpact: "How Terroir Shows Up in the 5 S's: Cool marine fog (Russian River & Carneros) preserves crisp malic acidity that makes the sides of your tongue salivate on the 'Sip', while steep volcanic hillsides (Shafer) create thick grape skins that deliver deep opaque color on 'See' and firm, grippy tannins on 'Savor'.",
    speakerNotes: {
      talkingPoints: [
        "Before we pour Wine #1, let's walk through the '5 S's' from Wine Enthusiast—the exact method sommeliers use to break down every glass tonight.",
        "1. SEE (Sight & Color): Hold your glass by the stem (so your hand doesn't warm the wine or smudge the bowl) and tilt it 45° over a white napkin. Look at the core and the rim. Whites gain color as they age (pale lemon to amber); reds lose color as they age—watch for this later when we compare our vibrant purple 2023 Cabernets against the brick-garnet rim of our 10-year-old 2016 AXR.",
        "2. SWIRL (Aeration & Legs): Easiest trick—keep the base of the glass flat on the table and draw small circles. Swirling mixes oxygen into the wine, opening up tight aromas and volatilizing alcohol so scent molecules float up to the rim. Watch the 'legs' or 'tears' running down the glass: thicker, slower legs indicate higher alcohol or extract, not necessarily quality.",
        "3. SNIFF (80% of Taste is Smell): Hover your nose right over the rim—take two quick sniffs rather than one long inhale so you don't fatigue your olfactory receptors. Look for three layers: Primary (fruit & florals from the grape itself), Secondary (toasted brioche from yeast in our sparkling, or vanilla/clove from French oak barrels), and Tertiary (truffle, cedar, black tea, and earth from years in the cellar).",
        "4. SIP (Palate & Texture): Don't just swallow—roll the wine across your whole mouth and gently draw in a tiny bit of air ('the sommelier slurp') to send aromas up the back of your throat. Notice the difference between Acidity (that mouthwatering tingle under your jaw, like biting a Meyer lemon) and Tannin (that dry, velvety grip on your gums and tongue, like strong black tea).",
        "5. SAVOR (The Finish): After you swallow, count how many seconds the flavors linger. Does it vanish quickly, or do waves of cocoa, spice, and fruit hang on for 45 to 60 seconds? A long, harmonious finish is the ultimate hallmark of a great Napa wine."
      ],
      tastingCues: [
        "Practice the 'tabletop swirl' right now with your glass so everyone feels comfortable before the first pour.",
        "Pro tip on Acid vs. Tannin: Acid makes your mouth water; Tannin makes your mouth feel dry. Pay attention to how food completely changes both!"
      ],
      funFacts: [
        "Roughly 80% of what our brain perceives as 'flavor' actually comes from smell—specifically retronasal olfaction when warm air rises from the back of the mouth to the nasal cavity during the Sip and Savor steps.",
        "Why sommeliers sniff the wine first: Beyond enjoying the bouquet, it checks for 'cork taint' (TCA)—a harmless compound that makes wine smell like wet cardboard or a damp basement and strips away fruit.",
        "Wine 'legs' (also called 'church windows') are caused by the Marangoni effect: alcohol evaporates faster than water on the side of the glass, creating surface tension that pulls droplets upward before gravity pulls them down."
      ],
      pourNotes: "Have guests hold their glasses by the stem. Now bring out the chilled 2022 Schramsberg Blanc de Blancs for Stop #1!",
      terroirBreakdown: {
        elevation: "Sensory Architecture: How Vineyard Elevation Translates to the Glass",
        topology: "See & Sniff: High-UV mountain slopes force grapes to grow thicker, darker skins (deeper color on 'See') and more concentrated floral/herbal aromatics ('Sniff').",
        fogExposure: "Sip (Acidity vs. Ripeness): Cooling bay fog slows sugar accumulation and locks in crisp natural tartaric and malic acids.",
        wineImpact: "When you 'Sip' and 'Savor' tonight, you are literally tasting geography: cool fog equals mouthwatering acidity, while rocky volcanic hillsides equal bold, velvety tannin structure."
      },
      winemakerNotes: {
        name: "The Wine Enthusiast 5 S's",
        role: "Professional Tasting Framework",
        bio: "1. SEE (Hue, depth & viscosity) → 2. SWIRL (Oxygenate & volatilize) → 3. SNIFF (Fruit, oak & age) → 4. SIP (Sweetness, acid, tannin & body) → 5. SAVOR (Length, balance & finish).",
        philosophy: "There is no 'wrong' aroma in wine tasting—everyone's scent memory is unique. Trust your senses and notice how each wine evolves with air and food."
      }
    }
  },
  {
    id: 3,
    title: "Schramsberg Blanc de Blancs",
    subtitle: "2022 | Brut Sparkling Wine",
    region: "Calistoga / North Coast",
    coordinates: [-122.56, 38.56],
    zoom: 13,
    pitch: 45,
    bearing: -20,
    story: "Crafted in the traditional method from Chardonnay grown across California’s North Coast, this classic sparkling wine balances freshness with complexity. The palate is crisp and refined, showing bright orchard fruit, lively acidity, and fine, persistent bubbles. A subtle creaminess from extended lees aging adds depth while the finish remains clean and vibrant.",
    vintageYear: "2022",
    varietal: "100% Chardonnay (Traditional Method Brut)",
    elevation: "550 - 1,200 ft (Mountain Foothills)",
    soil: "Rhyolitic volcanic ash, sandstone & marine tufa",
    hintsOf: "Aromas of green apple, lemon zest, and pear are layered with notes of brioche, toasted almond, and citrus blossom.",
    tastingNotes: ["Green Apple", "Lemon Zest", "Pear", "Brioche", "Toasted Almond", "Citrus Blossom"],
    foodPairing: "Caviar and Creme fraîche on potato chip || Caramelized Onion, Apple and Goat Cheese Melts",
    pairsWellWith: "Seafood, oysters, fried foods, or soft cheeses.",
    vintageWeather: "2022 Growing Season: A warm, dynamic vintage marked by an intense early September heatwave. Harvest for Schramsberg's sparkling Chardonnay was completed in late August just days before peak heat, capturing pristine natural acidity, bright citrus energy, and fresh orchard fruit before sugars surged.",
    producerCode: "SCHR",
    imageUrl: "/wineries/schramsberg.jpg",
    imageCaption: "Historic 1870 Hand-Hewn Volcanic Aging Caves at Schramsberg",
    gallery: [
      { url: "/wineries/schramsberg.jpg", caption: "Historic 1870 Hand-Hewn Volcanic Aging Caves at Schramsberg" },
      { url: "/wineries/schramsberg-2.jpg", caption: "Riddling Racks & Extended Lees Aging in Diamond Mountain Tunnels" },
      { url: "/wineries/schramsberg-3.jpg", caption: "Traditional Method Brut Sparkling Service at the Estate" }
    ],
    wineNumber: 1,
    winemaker: "Sean Thompson & Hugh Davies",
    winemakerBio: "Senior Winemaker Sean Thompson has directed sparkling production at Schramsberg for over 15 years, vinifying over 120 separate vineyard lots alongside second-generation vintner Hugh Davies.",
    terroirImpact: "Sourced from cool hillside foothills and foggy maritime pockets (550 - 1,200 ft). High hillside drainage combined with chilly Pacific marine breezes limits sugar accumulation and preserves razor-sharp natural acidity, preventing the flabbiness common in warm valley floors.",
    speakerNotes: {
      talkingPoints: [
        "Schramsberg is America’s benchmark for Méthode Traditionnelle sparkling wine, originally established in 1862 on Diamond Mountain.",
        "Revived in 1965 by Jack and Jamie Davies, who spearheaded California’s sparkling wine renaissance.",
        "Traditional Method: Unlike tank-carbonated sparkling (Prosecco), secondary fermentation happens inside each individual bottle, creating natural, silky micro-bubbles.",
        "Aging on the Lees: Aged for nearly 2 full years on its spent yeast ('lees') in 2.5 miles of historic 1870 hand-hewn volcanic caves.",
        "Lees Autolysis: Yeast breakdown releases proteins that transform crisp mountain acidity into a creamy mouthfeel, imparting aromas of warm brioche and toasted almond.",
        "Fruit sourced from cold coastal pockets (Carneros, Anderson Valley, Sonoma Coast) to preserve razor-sharp natural acidity."
      ],
      tastingCues: [
        "Listen and look: Observe the tight, persistent bead (effervescence) in the glass.",
        "Aroma: Crisp Granny Smith apple and lime zest at first sniff; swirl to reveal warm brioche, roasted almond, and lemon curd.",
        "Food pairing cue: The electric acidity slices through the decadent salt and fat of the potato chip and caviar bite."
      ],
      funFacts: [
        "In 1972, President Richard Nixon chose Schramsberg Blanc de Blancs for the historic 'Toast to Peace' with Premier Zhou Enlai in Beijing, China.",
        "It has been served at official State Dinners by every U.S. presidential administration since."
      ],
      pourNotes: "Serve chilled at 45°F-48°F in tulip glasses (not narrow flutes) so guests can appreciate the brioche aromatics.",
      terroirBreakdown: {
        elevation: "550 - 1,200 ft (Coastal foothill benchlands)",
        topology: "Mountain foothill terraces with steep natural inclines, composed of porous rhyolitic volcanic ash and marine sandstone.",
        fogExposure: "Pacific marine fog blankets these vineyards late into morning, keeping temperatures cool and prolonging hang-time.",
        wineImpact: "Elevation and slope maintain piercing malic acid and delicate citrus tension. Slopes prevent standing water, keeping cluster vigor in check and concentrating vibrant crisp fruit essential for world-class sparkling longevity."
      },
      winemakerNotes: {
        name: "Sean Thompson",
        role: "Senior Winemaker (15+ Years at Schramsberg)",
        bio: "Thompson barrel-ferments roughly 25% of the base wine lots in neutral French oak barrels to build rich texture and mid-palate roundness before secondary fermentation in bottle.",
        philosophy: "Traditional French discipline married to California fruit: harmonize crisp coastal acidity with rich, yeasty brioche character born from extended bottle aging on the lees."
      }
    }
  },
  {
    id: 4,
    title: "Gracianna Sauvignon Blanc",
    subtitle: "2023 | Russian River Valley",
    region: "Russian River Valley, Healdsburg",
    coordinates: [-122.8845, 38.5830],
    zoom: 13,
    pitch: 35,
    bearing: 10,
    story: "Sourced from the Russian River Valley, this Sauvignon Blanc is crafted in a bright, lively style. Fermented in stainless steel to preserve its pure aromatics, it showcases lush orchard and tropical fruits lifted by mouthwatering, crisp acidity. It serves as a perfect, energetic palate-cleanser before moving into the heavier red wines.",
    vintageYear: "2023",
    varietal: "100% Sauvignon Blanc",
    elevation: "110 ft (Russian River Valley Floor)",
    soil: "Alluvial gravelly sandy loam along the Russian River",
    hintsOf: "Meyer lemon, white peach, passionfruit, and fresh grapefruit zest, backed by a clean, refreshing minerality.",
    tastingNotes: ["Meyer Lemon", "White Peach", "Passionfruit", "Grapefruit Zest", "Clean Minerality"],
    foodPairing: "Potato Leek Soup",
    pairsWellWith: "Delicate vegetable soups, fresh green herbs, goat cheese, light flaky white fish, and bright vinaigrettes.",
    vintageWeather: "2023 Growing Season: Hailed across Sonoma and Napa as a 'vintage of the century.' Historic winter atmospheric rivers replenished deep water tables, followed by a remarkably cool, mild summer without heat spikes. Extended hang-time yielded electric natural acidity, vibrant passionfruit, and crisp mineral balance.",
    producerCode: "GRAC",
    imageUrl: "/wineries/gracianna.jpg",
    imageCaption: "Gracianna Winery Estate along Westside Road in Russian River Valley",
    gallery: [
      { url: "/wineries/gracianna.jpg", caption: "Gracianna Winery Estate along Westside Road in Russian River Valley" },
      { url: "/wineries/gracianna-2.jpg", caption: "Gracianna Tasting Room Entrance on the 'Miracle Mile' in Healdsburg" },
      { url: "/wineries/gracianna-3.jpg", caption: "Family-Owned Estate Grounds & Riverblock Vineyard" }
    ],
    wineNumber: 2,
    winemaker: "Trini Amador",
    winemakerBio: "Estate founder and winemaker Trini Amador crafts boutique, small-lot wines along famous Westside Road in Healdsburg, driven by gratitude and ancestral French-Basque tradition.",
    terroirImpact: "Russian River Valley floor (110 ft elevation). The Petaluma Gap wind gap funnels ocean fog directly along the Russian River, dropping night temperatures by 40°F. River gravel alluvium creates fast-draining loams that deliver mouthwatering, crisp acid.",
    speakerNotes: {
      talkingPoints: [
        "Quick excursion over the Mayacamas mountains into Sonoma's Russian River Valley along famous Westside Road.",
        "Gracianna is a boutique family-owned estate dedicated to the philosophy of gratitude, named in honor of their French-Basque matriarch Gracianna Lasaga.",
        "100% stainless steel fermentation: zero oak, no malolactic fermentation—pure, vibrant varietal fruit.",
        "Pacific marine fog travels directly through the Petaluma Gap, bathing these vines in cooling mist every evening to preserve bright aromatics."
      ],
      tastingCues: [
        "Aroma: Unmistakable Meyer lemon, white peach, ripe passionfruit, and wet river stones.",
        "Palate: Zingy, salivating acidity on the sides of the tongue. It acts as an energetic palate cleanser before we plunge into big reds.",
        "Soup pairing cue: The crisp lemon and mineral backbone cuts through the velvety starch of the potato leek soup."
      ],
      funFacts: [
        "The winery's motto is 'For those who have something to be grateful for'—a tribute to Gracianna's resilience as an immigrant shepherdess."
      ],
      pourNotes: "Serve at 50°F. Ensure all sparkling flutes are collected before presenting this bright white.",
      terroirBreakdown: {
        elevation: "110 ft (Russian River Valley Floor)",
        topology: "Gently sloping riparian bench flanking the Russian River, rich in ancient river gravel wash and sandy silt.",
        fogExposure: "Dense marine fog rolls in directly off the Pacific through the Petaluma Gap every evening, burning off mid-morning.",
        wineImpact: "The massive diurnal swing (up to 40°F difference between afternoon sun and midnight fog) preserves the grape's delicate monoterpenes and pyrazines, producing electric lemongrass and grapefruit aromatics instead of over-ripe melon."
      },
      winemakerNotes: {
        name: "Trini Amador",
        role: "Estate Founder & Winemaker",
        bio: "Trini crafts handcrafted wines honoring his family's Basque shepherd roots, believing wine should foster gratitude and conversation.",
        philosophy: "Pure varietal transparency: Cold fermentation in 100% stainless steel with zero oak contact and no malolactic conversion to preserve refreshing acidity."
      }
    }
  },
  {
    id: 5,
    title: "Turley Old Vines Zinfandel",
    subtitle: "2023 | Heritage Zinfandel",
    region: "St. Helena",
    coordinates: [-122.48, 38.53],
    zoom: 14,
    pitch: 30,
    bearing: 15,
    story: "Crafted from a selection of heritage vineyards averaging 80+ years in age, Turley’s Old Vines Zinfandel showcases the richness and depth that only mature vines can deliver. Aged in neutral oak to preserve purity of fruit and site character, this wine is both powerful and impeccably balanced.",
    vintageYear: "2023",
    varietal: "Heritage Zinfandel (80+ Year Old Vines)",
    elevation: "240 ft (Valley Floor & Gentle Bench)",
    soil: "Bale loam, gravelly alluvium, volcanic riverwash",
    hintsOf: "The nose is vibrant and layered, with notes of blackberry, black cherry, licorice, and baking spices, along with hints of pepper and dried herbs. On the palate, it’s full-bodied and concentrated, with velvety tannins, bright acidity, and a long, complex finish.",
    tastingNotes: ["Blackberry", "Black Cherry", "Licorice", "Baking Spices", "Black Pepper", "Dried Herbs"],
    foodPairing: "Pepperoni pizza",
    pairsWellWith: "Wood-fired pizzas, sweet-and-sour glazed meats, BBQ pork, and bold, smoked cheeses.",
    vintageWeather: "2023 Growing Season: A cool, delayed 'unicorn vintage.' Record winter rains allowed 80+ year-old heritage vines to thrive without drought stress. A mild summer pushed harvest nearly a month later than usual, producing concentrated Zinfandel with silky tannins, peppery spice, and remarkable fresh acidity.",
    producerCode: "TURL",
    imageUrl: "/wineries/turley.jpg",
    imageCaption: "Turley Wine Cellars Estate & 80+ Year-Old Heritage Vines in St. Helena",
    gallery: [
      { url: "/wineries/turley.jpg", caption: "Turley Wine Cellars Estate & 80+ Year-Old Heritage Vines in St. Helena" },
      { url: "/wineries/turley-2.jpg", caption: "Ancient Head-Trained Heritage Bush Vines Preserved by Turley" },
      { url: "/wineries/turley-3.jpg", caption: "Tasting Old Vine Zinfandel in the St. Helena Cellar" }
    ],
    wineNumber: 3,
    winemaker: "Tegan Passalacqua",
    winemakerBio: "Head Winemaker and Vineyard Director Tegan Passalacqua is a legendary viticulturist and co-founder of the Historic Vineyard Society, dedicated to preserving California's pre-Prohibition vines.",
    terroirImpact: "St. Helena valley floor (240 ft elevation) at Napa’s narrow 'hourglass' corridor. High daytime heat spikes ripen thick-skinned old vines, while deep Bale loam and river cobbles retain just enough deep sub-surface moisture for 80+ year old taproots.",
    speakerNotes: {
      talkingPoints: [
        "Transitioning to our red flight with an iconic California heritage varietal: Zinfandel.",
        "Larry Turley and legendary winemaker Tegan Passalacqua are pioneers in rescuing historic California vineyards.",
        "These are ancient, gnarled bush vines averaging 80 to over 100 years old, planted during or shortly after the Gold Rush & pre-Prohibition.",
        "Old vines yield minuscule crops, but the fruit concentration and natural acid-sugar balance are unmatched.",
        "Aged mostly in neutral French oak so the wild fruit and spice aren't smothered by heavy vanilla."
      ],
      tastingCues: [
        "Nose: Ripe wild blackberry, briar patch, black cherry, anise, cinnamon, and cracked black pepper.",
        "Palate: Notice how balanced it is—not hot or syrupy like cheap Zins, but juicy with fine, velvety tannins.",
        "Pizza pairing cue: The spiced acidity effortlessly cuts the fat of the pepperoni and complements the caramelized tomato sauce."
      ],
      funFacts: [
        "Larry Turley was an emergency room physician for decades before founding Frog's Leap and subsequently Turley Wine Cellars in 1993.",
        "Turley champions over 50 historic vineyards across the state, preserving California's living viticultural heritage."
      ],
      pourNotes: "Serve at cellar temperature (60°F-62°F). Swirl to release the fragrant briary pepper notes.",
      terroirBreakdown: {
        elevation: "240 ft (Valley Floor & Gentle Bench)",
        topology: "Alluvial fan deposited by Mayacamas stream runoff into the narrow central St. Helena valley basin.",
        fogExposure: "Protected from maritime fog; experiences warm daytime heat accumulation followed by rapid evening radiational cooling.",
        wineImpact: "The deep 80+ year old root systems tap into underground water tables, allowing them to remain dry-farmed without irrigation. Old vines self-limit their crop load, yielding tiny, concentrated berries with spicy, briary complexity and thick, velvety skins."
      },
      winemakerNotes: {
        name: "Tegan Passalacqua",
        role: "Head Winemaker & Vineyard Director",
        bio: "Passalacqua has worked harvests in France, South Africa, and New Zealand, returning to champion head-trained, heritage vineyards across California.",
        philosophy: "Minimal intervention and gentle extraction: Ferment with ambient native yeasts, gentle pump-overs, and mature in neutral French oak to let ancient vines tell their own story."
      }
    }
  },
  {
    id: 6,
    title: "Dominus 'Napanook'",
    subtitle: "2023 | Bordeaux Blend",
    region: "Yountville",
    coordinates: [-122.37, 38.39],
    zoom: 14,
    pitch: 20,
    bearing: -10,
    story: "The palate is beautifully balanced, combining energy and depth with a supple, polished texture and a long, savory finish. A later-than-usual harvest rewarded patience in the vineyard: abundant winter rainfall replenished the soils, while mild spring temperatures and an extended growing season allowed the fruit to ripen gradually and evenly. From Napanook Vineyard in Yountville, the blend is 92% Cabernet Sauvignon, 4% Cabernet Franc, and 4% Petit Verdot, with just 20% new barrels.",
    vintageYear: "2023",
    varietal: "92% Cabernet Sauvignon, 4% Cabernet Franc, 4% Petit Verdot",
    elevation: "110 ft (Historic Yountville Bench)",
    soil: "Alluvial gravelly loam from volcanic Mayacamas runoff",
    hintsOf: "Pomegranate and bright citrus zest, followed by earthy notes of cacao and finely woven tannins",
    tastingNotes: ["Pomegranate", "Bright Citrus Zest", "Earthy Cacao", "Finely Woven Tannins"],
    foodPairing: "Arugula salad with blue cheese and pine nuts in a lemon vinaigrette.",
    pairsWellWith: "Roasted lamb, rosemary-rubbed steaks, earthy root vegetable gratins, and hard aged cheeses.",
    vintageWeather: "2023 Growing Season: Christian Moueix praised 2023 as one of the finest harvests of his 50-year career. Abundant winter rains nourished the dry-farmed soils. An unusually mild summer delayed harvest into late October, allowing fruit to ripen at a leisurely pace—yielding savory depth, cacao, and chiseled, polished tannins.",
    producerCode: "DOMN",
    imageUrl: "/wineries/dominus.jpg",
    imageCaption: "Dominus Napanook Estate & Dry-Farmed Historic Vines in Yountville",
    gallery: [
      { url: "/wineries/dominus.jpg", caption: "Dominus Estate & Herzog & de Meuron Basalt Gabion Winery in Yountville" },
      { url: "/wineries/dominus-2.jpg", caption: "Historic Napanook Vineyard Beneath the Mayacamas Mountains" },
      { url: "/wineries/dominus-3.jpg", caption: "Official Napanook Vineyard Parcel & Soil Zone Map (Est. 1838)" }
    ],
    wineNumber: 4,
    winemaker: "Christian Moueix & Tod Mostero",
    winemakerBio: "Bordeaux legend Christian Moueix (Château Pétrus) and Director of Viticulture Tod Mostero apply 100% dry-farming and French classical rigor to Napa's oldest historic vineyard.",
    terroirImpact: "Yountville Bench (110 ft elevation). 100% dry-farmed with zero irrigation. Vines dig deep into alluvial gravel and Mayacamas volcanic runoff, moderating canopy vigor and producing aristocratic, finely textured tannins.",
    speakerNotes: {
      talkingPoints: [
        "Napanook is the estate second wine of Dominus, directed by Christian Moueix—the legendary French vintner behind Bordeaux's Château Pétrus.",
        "Napanook vineyard is historic ground: George Yount planted Napa's very first grapevines here in 1838.",
        "100% Dry-Farmed: No irrigation whatsoever. The vines are forced to dig deep root systems (20-30 ft) into gravelly Mayacamas runoff.",
        "A classic Bordeaux sensibility meets California sunshine: 92% Cabernet Sauvignon, 4% Cabernet Franc, 4% Petit Verdot, aged with just 20% new French oak."
      ],
      tastingCues: [
        "Nose: Dark plum, pomegranate, cedar box, graphite, fresh laurel, and raw cacao nibs.",
        "Palate: Notice the aristocratic, finely woven tannins. There is restraint, savory depth, and an extraordinarily long finish.",
        "Salad pairing cue: The pine nuts and pungent blue cheese bridge with the earthy tannins, while the lemon vinaigrette sings with the wine's natural freshness."
      ],
      funFacts: [
        "The Dominus winery building was designed by Pritzker Prize winners Herzog & de Meuron using local basalt rocks encased in wire gabions that naturally regulate barrel cellar humidity."
      ],
      pourNotes: "Serve at 64°F in Bordeaux glasses. Decant 30 minutes in advance if possible.",
      terroirBreakdown: {
        elevation: "110 ft (Historic Yountville Bench)",
        topology: "Gently sloping eastward alluvial fan at the foot of the Mayacamas Mountains where gravel outwash meets valley loam.",
        fogExposure: "Receives direct cooling marine drafts from San Pablo Bay earlier in the day than northern AVAs, keeping heat accumulation moderate.",
        wineImpact: "Dry-farming forces the vine roots to plunge 25+ feet deep. Without drip irrigation, berries remain small and bunches loose. This yields aristocratic, savory tannins and cedar/graphite complexity rather than jammy fruit."
      },
      winemakerNotes: {
        name: "Christian Moueix & Tod Mostero",
        role: "Proprietor & Director of Viticulture",
        bio: "Moueix brought French viticultural precision to Napa in 1982; Mostero holds enology degrees from UC Davis and Bordeaux's Faculté d'Enologie.",
        philosophy: "Strict non-interventionist dry-farming: Preserve biodiversity, harvest strictly on physiological acid/flavor balance, and use only 20% new French oak to let terroir shine."
      }
    }
  },
  {
    id: 7,
    title: "Stag’s Leap Wine Cellars 'ARTEMIS'",
    subtitle: "2022 | Cabernet Sauvignon",
    region: "Stags Leap District",
    coordinates: [-122.31, 38.41],
    zoom: 14,
    pitch: 40,
    bearing: 25,
    story: "Lush and beautifully structured, it balances generous fruit with refined tannins and an elegant, lingering finish. Named for the Greek goddess of the hunt, ARTEMIS represents Stag’s Leap Wine Cellars’ pursuit of Napa Valley’s finest Cabernet Sauvignon. Fruit from vineyards across Atlas Peak, St. Helena, Coombsville, Calistoga, and Stags Leap District is blended with estate-grown grapes to create a wine that captures the character of the valley.",
    vintageYear: "2022",
    varietal: "Cabernet Sauvignon (Napa Valley Blend)",
    elevation: "160 - 300 ft (Eastern Valley Basin)",
    soil: "Volcanic colluvium and river terrace silts",
    hintsOf: "Ripe blackberry and dark cherry flavors layered with hints of spice, cedar, and cocoa",
    tastingNotes: ["Ripe Blackberry", "Dark Cherry", "Layered Spice", "Cedar", "Cocoa"],
    foodPairing: "Beef and Pork meatballs in a blackberry reduction",
    pairsWellWith: "Roasted poultry, savory umami-focused dishes, grilled flank steak, and medium-aged cheeses like Fontina.",
    vintageWeather: "2022 Growing Season: Dry winter followed by a temperate summer and an intense 10-day Labor Day heat dome exceeding 110°F. Stags Leap District was saved by daily cooling marine breezes funneled from San Pablo Bay, preserving balancing acidity beneath plush, concentrated dark berry fruit.",
    producerCode: "SLWC",
    imageUrl: "/wineries/stagsleap.jpg",
    imageCaption: "Stag's Leap Wine Cellars Estate & Vineyard Table in Stags Leap District",
    gallery: [
      { url: "/wineries/stagsleap.jpg", caption: "Stag's Leap Wine Cellars Estate & Vineyard Table in Stags Leap District" },
      { url: "/wineries/stagsleap-2.jpg", caption: "Historic S.L.V. & FAY Vineyards Beneath the Volcanic Stags Leap Palisades" },
      { url: "/wineries/stagsleap-3.jpg", caption: "Overlooking the Estate Vineyards from the FAY Outlook Visitor Center" }
    ],
    wineNumber: 5,
    winemaker: "Marcus Notaro",
    winemakerBio: "Winemaker Marcus Notaro leads Stag’s Leap Wine Cellars with two decades of mastery, continuing the legacy that stunned the wine world at the 1976 Judgment of Paris.",
    terroirImpact: "Stags Leap District basin and palisades (160 - 300 ft elevation). The sheer rocky volcanic cliffs of the Stags Leap Palisades reflect daytime sun onto the vines, while evening winds from San Pablo Bay funnel through the valley, cooling the clusters rapidly.",
    speakerNotes: {
      talkingPoints: [
        "Stag's Leap Wine Cellars is viticultural royalty: winner of the landmark 1976 'Judgment of Paris' blind tasting, which defeated top Bordeaux first growths and legitimized American wine globally.",
        "Named after Artemis, Greek goddess of the hunt, symbolizing the team's relentless search for premium Cabernet parcels across Napa microclimates.",
        "Blends estate fruit from the Stags Leap District with mountain and benchland fruit from Atlas Peak and Coombsville.",
        "The hallmark of Stags Leap District is described as 'an iron fist in a velvet glove'—deep structure concealed beneath voluptuous fruit."
      ],
      tastingCues: [
        "Nose: Lush, ripe black cherry, cassis, violet florals, dark chocolate, and subtle vanilla smoke.",
        "Palate: Round, plush, seductive mouthfeel with polished, supple tannins and lingering spice.",
        "Meatball pairing cue: The blackberry reduction echoes the core dark berry flavors, while the rich beef and pork fat tenderizes the Cabernet tannins."
      ],
      funFacts: [
        "A bottle of the 1973 Stag's Leap S.L.V. Cabernet sits in the Smithsonian National Museum of American History as one of the 101 Objects that Made America."
      ],
      pourNotes: "Serve at 65°F. Swirl generously to awaken the bouquet.",
      terroirBreakdown: {
        elevation: "160 - 300 ft (Eastern Valley Basin & Palisade Foothills)",
        topology: "Basin nestled against the sheer vertical volcanic rock walls of the Stags Leap Palisades.",
        fogExposure: "Narrow gap in the southern hills channels marine drafts up from San Pablo Bay, causing dramatic day-to-night temperature drops.",
        wineImpact: "The massive rock palisades store radiant solar heat and reflect it back onto the vines in late afternoon, ensuring complete black-fruit ripeness. Sudden nighttime cooling locks in natural acidity, giving ARTEMIS its signature plush, velvety tannins and seamless structure."
      },
      winemakerNotes: {
        name: "Marcus Notaro",
        role: "Head Winemaker",
        bio: "Notaro utilizes state-of-the-art optical fruit sorting and custom barrel coopers to craft Cabernet with unmatched textural refinement.",
        philosophy: "The art of blending: harmonize the supple, round tannins of estate Stags Leap fruit with the firm, brooding mountain backbone of Atlas Peak."
      }
    }
  },
  {
    id: 8,
    title: "Shafer 'One Point Five'",
    subtitle: "2023 | Cabernet Sauvignon",
    region: "Stags Leap District (Hillside)",
    coordinates: [-122.30, 38.42],
    zoom: 15,
    pitch: 60,
    bearing: 40,
    story: "Predominately from two estate sites — Shafer’s hillside vineyards that surround the winery and our “Borderline” vineyard located about two miles south. 83% Cabernet Sauvignon, 12% Merlot, 3% Malbec, 2% Petit Verdot. 20 months in 100% new French oak barrels.",
    vintageYear: "2023",
    varietal: "83% Cabernet Sauvignon, 12% Merlot, 3% Malbec, 2% Petit Verdot",
    elevation: "400 - 850 ft (Steep Talus Slope)",
    soil: "Weathered andesite volcanic rock & fractured rhyolite",
    hintsOf: "Layers of blackberry, raspberry, and black licorice, complemented by notes of bay leaf, sage, cinnamon, clove, and dark chocolate with velvety tannins",
    tastingNotes: ["Blackberry", "Raspberry", "Black Licorice", "Bay Leaf & Sage", "Cinnamon & Clove", "Dark Chocolate"],
    foodPairing: "Short Rib Ragu",
    pairsWellWith: "Short ribs, heavily seared ribeye, rich demi-glace sauces, and intense blue cheeses.",
    vintageWeather: "2023 Growing Season: A near-mythic growing season on Shafer's hillside amphitheater. Steady winter rainfall gave vines vigor, followed by mild summer sun and cool nights. Unprecedented long hang-time into late autumn allowed hillside grapes to achieve complete phenolic ripeness, packing blackberry concentration and velvety tannins.",
    producerCode: "SHAF",
    imageUrl: "/wineries/shafer.jpg",
    imageCaption: "Shafer Vineyards Steep Hillside Terraces & Winery Facility",
    gallery: [
      { url: "/wineries/shafer.jpg", caption: "Shafer Vineyards Steep Hillside Amphitheater in Stags Leap District" },
      { url: "/wineries/shafer-2.jpg", caption: "Sun-Drenched Volcanic Knolls Surrounding the Shafer Winery" },
      { url: "/wineries/shafer-3.jpg", caption: "Private Collector Tasting Salon Overlooking Hillside Select Blocks" }
    ],
    wineNumber: 6,
    winemaker: "Elias Fernandez & Doug Shafer",
    winemakerBio: "Winemaker Elias Fernandez has directed Shafer’s winemaking for four decades (Food & Wine Winemaker of the Year), working alongside late founder John Shafer and former president Doug Shafer.",
    terroirImpact: "Steep hillside amphitheater (400 - 850 ft elevation). Talus slope terraces with fractured volcanic andesite rock. Extreme drainage starves the vines, producing berries half the normal size with massive color, skin extract, and muscular mountain tannins.",
    speakerNotes: {
      talkingPoints: [
        "We head into the steep hillside amphitheater of Stags Leap District with Shafer Vineyards.",
        "The story behind the name 'One Point Five': John Shafer and his son Doug worked side-by-side for decades. Rather than calling it a 'second generation' business, they considered their collaboration 'a generation and a half'.",
        "Hillside terroir: Extreme talus slopes with shallow volcanic rock. Vines struggle, producing smaller berries with double the skin-to-juice ratio.",
        "Blend: 83% Cabernet Sauvignon, 12% Merlot, 3% Malbec, 2% Petit Verdot. Matured 20 months in 100% new French oak barrels."
      ],
      tastingCues: [
        "Nose: Explosive layers of boysenberry, cassis liqueur, fresh bay leaf, wild sage, clove, and espresso.",
        "Palate: Notice the step up in muscular hillside power. The tannins are prominent and structural, but seamlessly buffered by luxurious fruit extract.",
        "Short rib ragù pairing cue: The unctuous beef richness and braised pasta starch meet the sheer horsepower of this wine head-on."
      ],
      funFacts: [
        "Shafer transitioned 100% of its electricity to solar power way back in 2004 and uses trained barn owls and raptor perches for organic rodent control."
      ],
      pourNotes: "Decant 45-60 minutes if possible. Serve at 65°F in large tulip red wine glasses.",
      terroirBreakdown: {
        elevation: "400 - 850 ft (Steep Talus Amphitheater Terraces)",
        topology: "Dramatic 25-30% hillside inclines carved into weathered volcanic andesite and rhyolite.",
        fogExposure: "Situated above the morning fog inversion line; vines bask in early morning sun and benefit from constant mountain breezes.",
        wineImpact: "Hillside gravity causes immediate water runoff, starving the vines of excess water. Berries are 40-50% smaller with double the skin-to-juice ratio. This delivers monumental concentration, opaque purple color, and muscular mountain tannins built for decades of cellaring."
      },
      winemakerNotes: {
        name: "Elias Fernandez",
        role: "Director of Winemaking (38+ Years at Shafer)",
        bio: "The son of Napa farm workers, Elias started at Shafer in 1984. He was named Winemaker of the Year by Food & Wine and has earned multiple 100-point scores.",
        philosophy: "Luxurious hillside power: Mature 20 months in 100% new French oak barrels to cushion and polish the massive natural tannins of estate hillside fruit."
      }
    }
  },
  {
    id: 9,
    title: "AXR Cabernet Sauvignon",
    subtitle: "2016 | Napa Valley",
    region: "St. Helena",
    coordinates: [-122.5048, 38.5303],
    zoom: 14,
    pitch: 35,
    bearing: 15,
    story: "Crafted by renowned winemaker Jean Hoefliger, this 100% Cabernet Sauvignon was aged for 22 months in 80% new French oak. It is an opulent, pleasure-bent beauty that balances a rich, full-bodied mouthfeel with fine-grained, chewy tannins and incredible depth. After a decade of aging, it has softened beautifully, delivering a seamless and fragrant finish.",
    vintageYear: "2016",
    varietal: "100% Cabernet Sauvignon (22 Mo French Oak)",
    elevation: "220 ft (St. Helena Bench)",
    soil: "Bale gravelly loam & volcanic alluvium",
    hintsOf: "Crème de cassis, intense red and black currants, black raspberries, and warm plums, beautifully layered with savory nuances of lavender, black tea, wild sage, and wet earth.",
    tastingNotes: ["Crème de Cassis", "Red & Black Currants", "Black Raspberries", "Warm Plums", "Lavender & Sage", "Black Tea", "Wet Earth"],
    foodPairing: "Chocolate truffles",
    pairsWellWith: "Slow-braised beef ragù, heavy, rich pasta dishes, truffled sides, and slow-roasted, highly marbled meats.",
    vintageWeather: "2016 Growing Season: Rated 98 points and universally regarded as a modern benchmark vintage for Napa Valley. Near-perfect conditions throughout: steady winter rain, uniform spring budbreak, and a mild, sunny summer without heatwaves gave Jean Hoefliger ideal hang-time. A decade of bottle age has softened this into pure velvet.",
    producerCode: "AXR",
    imageUrl: "/wineries/axr.jpg",
    imageCaption: "AXR Napa Valley — Historic 1880s Victorian Estate & Redwoods in St. Helena",
    gallery: [
      { url: "/wineries/axr.jpg", caption: "AXR Napa Valley — Historic 1880s Victorian Estate & Redwoods in St. Helena" },
      { url: "/wineries/axr-2.jpg", caption: "Estate Cabernet Vineyard Rows Bordering Ancient St. Helena Redwoods" },
      { url: "/wineries/axr-3.jpg", caption: "The Historic Pre-Prohibition Manor House & Speakeasy Grounds at AXR" }
    ],
    wineNumber: 7,
    winemaker: "Jean Hoefliger",
    winemakerBio: "Swiss-born cult winemaker Jean Hoefliger (former winemaker of Alpha Omega, Newton, and Château Lynch-Bages) is famous for crafting hedonistic, ultra-opulent, seamless Napa Cabernets.",
    terroirImpact: "St. Helena Bench (220 ft elevation). Deep alluvial and volcanic wash near Napa's warmest central corridor. Excellent drainage allowed extended autumn hang-time in the legendary 2016 vintage, developing complex secondary notes that have resolved into pure velvet over 10 years.",
    speakerNotes: {
      talkingPoints: [
        "Our grand finale: A 10-year aged library vintage (2016) from St. Helena crafted by Swiss-born cult winemaker Jean Hoefliger.",
        "The story behind the name 'AXR': Honors AxR#1 (Aramon x Rupestris Ganzin No. 1), the legendary hybrid rootstock that saved California viticulture when phylloxera threatened to wipe out vineyards in the late 19th and mid-20th centuries, allowing grapevines to flourish across St. Helena benchlands.",
        "The 2016 vintage in Napa Valley is celebrated as one of the finest of the century—near-perfect uniform warmth allowing optimal physiological ripeness.",
        "Aged 22 months in 80% new French oak, then cellared for a decade to achieve seamless integration."
      ],
      tastingCues: [
        "Color inspection: Tilt the glass—notice the delicate brick/garnet rim showing 10 years of graceful bottle maturation.",
        "Aroma: Complex secondary & tertiary development—crème de cassis, warm plum, lavender, black tea leaf, dried sage, and damp earth.",
        "Palate: The bold tannins have melted into pure velvet. Immense depth without any rough edges; the finish persists for well over a minute.",
        "Truffle pairing cue: The dark cocoa butter in the chocolate truffles marries with the softened cassis, sweet cedar, and tobacco notes."
      ],
      funFacts: [
        "The historic AXR estate in St. Helena was an 1880s brewery, an inn frequented by writer Jack London, and a clandestine Prohibition speakeasy.",
        "AxR#1 rootstock was once planted on over 80% of all Napa vineyards, becoming synonymous with the valley's mid-century vineyard rebirth."
      ],
      pourNotes: "Pour gently at 65°F to preserve clarity. Encourage guests to sit with this final glass and let it evolve in the glass.",
      terroirBreakdown: {
        elevation: "220 ft (St. Helena Bench)",
        topology: "Valley benchland situated at the valley's warmest pinch point, comprised of volcanic riverwash and Bale gravelly loam.",
        fogExposure: "Warm central corridor where daytime heat is trapped between the Mayacamas and Vaca mountain walls.",
        wineImpact: "Warmth permits full physiological tannin ripeness where grape seeds and skins turn golden-brown before harvest. After 10 years of cellar age, bold youthful astringency has completely dissolved into velvet and crème de cassis."
      },
      winemakerNotes: {
        name: "Jean Hoefliger",
        role: "Consulting Cult Winemaker",
        bio: "Educated in Switzerland and Bordeaux, Hoefliger has crafted benchmark Napa wines for two decades, celebrated for his hedonistic and sensual wine style.",
        philosophy: "Sensual texture and patient evolution: Long maceration on skins (up to 40 days) followed by 22 months in French oak, unlocking lush, complex velvet."
      }
    }
  }
];
