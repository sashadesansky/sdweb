/*
  Curated sample dataset for the Vacation Destination Explorer.

  This is hand-curated, illustrative content (not a live business
  directory) — it exists to demonstrate the dashboard concept for a
  meaningful set of popular destinations. Weather is the one genuinely
  live piece (see vacation-dashboard.js), since there's no free,
  no-API-key business-listings service safe to call from a static site.

  Each destination has MORE entries per category than the dashboard
  shows at once (3), so the "Refresh" button has real variety to
  rotate through. To add a destination, copy a whole block and edit it.
*/

window.VACATION_DESTINATIONS = [
  {
    name: "Arlington, Virginia",
    aliases: ["arlington", "arlington va", "arlington virginia", "arlington, va"],
    coffee: [
      { name: "Swing's Coffee Roasters", blurb: "A century-old D.C.-area roaster with a cozy Clarendon counter." },
      { name: "Bakeshop Arlington", blurb: "Neighborhood bakery-cafe with excellent espresso and fresh pastries." },
      { name: "Bloombars Coffee", blurb: "Community-minded spot that doubles as a local art space." },
      { name: "Northside Social", blurb: "Wine-bar-by-night, laptop-friendly coffeehouse by day, in a converted house." },
      { name: "Kindred Coffee Co.", blurb: "Small-batch roaster with a minimalist counter near Ballston." },
      { name: "Best Buns Bread Co.", blurb: "Bakery-cafe with strong coffee and even better morning buns." }
    ],
    restaurants: [
      { name: "Ravi Kabob", blurb: "Cash-only Afghan/Pakistani grill beloved by locals for decades." },
      { name: "Bob & Edith's Diner", blurb: "24-hour classic diner, the kind of hole-in-the-wall regulars swear by." },
      { name: "Lebanese Taverna (original location)", blurb: "Family-run Lebanese spot that started it all before the chain grew." },
      { name: "Chicken + Whiskey", blurb: "Peruvian rotisserie chicken counter, unassuming and packed at lunch." },
      { name: "Queen Mother's Kitchenette", blurb: "Tiny Trinidadian takeout counter with serious doubles and roti." },
      { name: "A-Town Bar & Grill", blurb: "No-frills wing spot that locals rank above the famous chains." }
    ],
    desserts: [
      { name: "Buzz Bakery", blurb: "Cupcakes and coffee in a bright Pentagon Row corner shop." },
      { name: "Dolcezza Gelato", blurb: "Argentine-style gelato made with real, often local, ingredients." },
      { name: "Ice Cream Jubilee", blurb: "D.C.-born small-batch ice cream with playful, rotating flavors." },
      { name: "Crumbs & Whiskers", blurb: "Dessert counter with a devoted following for its layer cakes." },
      { name: "The Cupcakery", blurb: "Small storefront known for classic Southern-style cupcakes." },
      { name: "Ellwood Thompson's bakery case", blurb: "Local grocer's bakery corner, a well-kept neighborhood secret." }
    ],
    funFacts: [
      { text: "Arlington County has no incorporated towns or cities within it — it's the smallest self-governing county in the U.S. by land area." },
      { text: "The Pentagon, one of the world's largest office buildings, sits within Arlington." },
      { text: "Arlington was originally part of Washington, D.C. until it was ceded back to Virginia in 1846." },
      { text: "Arlington National Cemetery, on former Custis-Lee estate land, holds more than 400,000 graves." },
      { text: "Rosslyn's skyline earned the nickname 'Manhattan of Virginia' for its dense cluster of high-rises." },
      { text: "Arlington is a major hub for U.S. tech and defense contractors, anchored in part by Amazon's HQ2 campus." }
    ],
    events: [
      { name: "Arlington County Fair", timing: "Typically mid-August", blurb: "A classic county fair with rides, food, and local vendors." },
      { name: "Rosslyn Jazz Festival", timing: "Typically September", blurb: "Free outdoor jazz festival in Gateway Park." },
      { name: "Arlington Restaurant Week", timing: "Twice yearly, winter & summer", blurb: "Prix-fixe menus across the county's restaurants." },
      { name: "Clarendon Day", timing: "Typically September", blurb: "Neighborhood street festival with music and local makers." },
      { name: "Ballston Food Truck Fridays (seasonal)", timing: "Fridays, spring–fall", blurb: "Rotating lineup of food trucks in Ballston." }
    ]
  },

  {
    name: "Washington, D.C.",
    aliases: ["washington dc", "washington d.c.", "dc", "washington", "the district"],
    coffee: [
      { name: "Compass Coffee (Ivy City roastery)", blurb: "Local roaster's flagship, set in a converted warehouse." },
      { name: "Grace Street Coffee", blurb: "Tiny Georgetown counter known for its cold brew." },
      { name: "The Coffee Bar", blurb: "Bright Chinatown-adjacent cafe popular with the laptop crowd." },
      { name: "La Colombe (Blagden Alley)", blurb: "Tucked into a quiet alley, easy to miss and worth finding." },
      { name: "Little Wild Things", blurb: "Female-founded roaster with a cozy H Street counter." },
      { name: "Sospeso Coffee", blurb: "Coffee-with-a-cause counter near Union Market." }
    ],
    restaurants: [
      { name: "Ben's Chili Bowl (counter stools)", blurb: "D.C. institution — a half-smoke here is a rite of passage." },
      { name: "Amsterdam Falafelshop", blurb: "Order-at-the-counter falafel with a build-your-own topping bar." },
      { name: "Full Kee", blurb: "No-frills Chinatown noodle shop favored by industry cooks on their night off." },
      { name: "El Rinconcito Cafe", blurb: "Small Salvadoran spot known for pupusas locals line up for." },
      { name: "Etete", blurb: "Beloved Ethiopian restaurant on the U Street corridor." },
      { name: "Millie's (off-menu specials)", blurb: "Neighborhood favorite that locals treat as a hidden gem despite its popularity." }
    ],
    desserts: [
      { name: "Baked & Wired", blurb: "Georgetown cupcake shop with a cult following and long lines." },
      { name: "Captain Cookie & the Milkman", blurb: "Food-truck-turned-storefront for warm cookies and ice cream sandwiches." },
      { name: "Dolcezza (Georgetown flagship)", blurb: "Argentine gelato with rotating seasonal flavors." },
      { name: "Baked by Yael", blurb: "Cake-pop bakery beloved by D.C. dessert regulars." },
      { name: "Ice Cream Jubilee", blurb: "D.C.-founded ice cream shop with adventurous flavors." },
      { name: "Pitango Gelato", blurb: "Small-batch gelato counter near Barracks Row." }
    ],
    funFacts: [
      { text: "No building in D.C. can legally be taller than the U.S. Capitol dome (roughly 555 feet) under the Height of Buildings Act." },
      { text: "D.C. residents didn't get a vote for president until the 23rd Amendment in 1961." },
      { text: "The White House has 132 rooms, 35 bathrooms, and its own bowling alley." },
      { text: "D.C.'s street layout was designed by Pierre L'Enfant, inspired by Baroque garden design." },
      { text: "The city is a major hub for policy, international affairs, and a fast-growing tech and biotech sector." },
      { text: "Smithsonian museums in D.C. are free to enter — one of the largest free museum networks in the world." }
    ],
    events: [
      { name: "National Cherry Blossom Festival", timing: "Typically late March–April", blurb: "Weeks of events around the Tidal Basin's blooming cherry trees." },
      { name: "Smithsonian Folklife Festival", timing: "Typically late June–early July", blurb: "Free cultural festival on the National Mall." },
      { name: "H Street Festival", timing: "Typically September", blurb: "Music, food, and art along the H Street corridor." },
      { name: "DC Jazz Festival", timing: "Typically September", blurb: "Citywide jazz performances across multiple venues." },
      { name: "Fourth of July on the National Mall", timing: "July 4", blurb: "Fireworks over the Washington Monument." }
    ]
  },

  {
    name: "New York City, New York",
    aliases: ["new york", "new york city", "nyc", "manhattan", "ny"],
    coffee: [
      { name: "Abraço", blurb: "Tiny East Village counter, standing room only, worth the squeeze." },
      { name: "Cafe Grumpy", blurb: "Greenpoint roaster that quietly kicked off Brooklyn's coffee scene." },
      { name: "Everyman Espresso", blurb: "Compact counters serving some of the city's best-pulled shots." },
      { name: "Coffee Project NY", blurb: "East Village shop that treats coffee like a tasting menu." },
      { name: "Ludlow Coffee Supply", blurb: "Lower East Side basement cafe with an unexpected speakeasy vibe." },
      { name: "Variety Coffee Roasters", blurb: "Brooklyn-based mini-chain with a devoted neighborhood following." }
    ],
    restaurants: [
      { name: "Veselka (late-night counter)", blurb: "24-hour Ukrainian diner, a East Village institution since 1954." },
      { name: "Joe's Shanghai (original Chinatown location)", blurb: "Soup dumplings in a no-frills, always-packed dining room." },
      { name: "Xi'an Famous Foods (original stall)", blurb: "Started as a food-court stall; the hand-pulled noodles built a legend." },
      { name: "Los Tacos No. 1", blurb: "Chelsea Market counter with a line that moves fast for a reason." },
      { name: "Katz's Delicatessen (off-peak hours)", blurb: "Iconic deli — go at an odd hour to dodge the tourist crush." },
      { name: "Prince Street Pizza", blurb: "Small Nolita slice shop famous for its pepperoni square." }
    ],
    desserts: [
      { name: "Levain Bakery (original UWS spot)", blurb: "The six-ounce chocolate chip walnut cookie that started the hype." },
      { name: "Ess-a-Bagel", blurb: "Not dessert exactly, but the cream cheese selection deserves the trip." },
      { name: "Malaysian Ice Kacang", blurb: "Flushing dessert stand for shaved ice loaded with toppings." },
      { name: "Chinatown Ice Cream Factory", blurb: "Family-run shop with flavors like black sesame and lychee." },
      { name: "Big Gay Ice Cream Shop", blurb: "East Village soft-serve counter with playful, punny sundaes." },
      { name: "Ferrara Bakery", blurb: "Little Italy's oldest pastry shop, open since 1892." }
    ],
    funFacts: [
      { text: "NYC's subway system has 472 stations — more than any other system in the world." },
      { text: "The Empire State Building has its own zip code: 10118." },
      { text: "More than 800 languages are spoken across the five boroughs, making it linguistically the most diverse city on Earth." },
      { text: "New York was briefly the capital of the United States, from 1785 to 1790." },
      { text: "The city anchors the finance, media, and fashion industries, and is a fast-growing tech hub known as 'Silicon Alley.'" },
      { text: "Central Park is bigger than the country of Monaco." }
    ],
    events: [
      { name: "SummerStage", timing: "Typically June–August", blurb: "Free outdoor concerts across NYC parks." },
      { name: "Governors Ball Music Festival", timing: "Typically June", blurb: "Multi-day music festival on Randall's Island." },
      { name: "NYC Restaurant Week", timing: "Winter & summer", blurb: "Prix-fixe menus at hundreds of restaurants citywide." },
      { name: "Smorgasburg", timing: "Weekends, spring–fall", blurb: "Sprawling outdoor food market in Brooklyn." },
      { name: "Village Halloween Parade", timing: "October 31", blurb: "Massive costumed parade through Greenwich Village." }
    ]
  },

  {
    name: "Chicago, Illinois",
    aliases: ["chicago", "chicago il", "chicago, il", "the windy city"],
    coffee: [
      { name: "Sawada Coffee", blurb: "Latte art competition winners, hidden inside a West Loop building." },
      { name: "Dark Matter Coffee (Star Lounge)", blurb: "Psychedelic-poster-covered roastery cafe in Wicker Park." },
      { name: "Wormhole Coffee", blurb: "80s-themed cafe with a DeLorean out front." },
      { name: "Sip & Savor", blurb: "Black-owned South Side coffeehouse doubling as a community hub." },
      { name: "Metric Coffee", blurb: "West Town roaster with a clean, industrial-cafe feel." },
      { name: "Bow Truss Coffee Roasters", blurb: "Neighborhood roaster with several unassuming corner locations." }
    ],
    restaurants: [
      { name: "Lou Mitchell's (weekday breakfast)", blurb: "Near-West-Loop diner handing out donut holes since 1923." },
      { name: "Johnnie's Beef", blurb: "Elmwood Park Italian beef stand locals argue is the city's best." },
      { name: "Kuma's Corner (original Belmont location)", blurb: "Metal-themed burger joint in an unassuming Avondale storefront." },
      { name: "Pequod's Pizza", blurb: "Caramelized-crust deep dish that locals rank over the tourist chains." },
      { name: "Taste of Lebanon", blurb: "Modest Rogers Park storefront with some of the city's best shawarma." },
      { name: "Superdawg Drive-In", blurb: "Old-school car-hop hot dog stand since 1948." }
    ],
    desserts: [
      { name: "Margie's Candies", blurb: "Vintage 1921 ice cream parlor with famous hot fudge sundaes." },
      { name: "Hoosier Mama Pie Company", blurb: "East Village-style pie shop with rotating seasonal flavors." },
      { name: "Bang Bang Pie & Biscuits", blurb: "Logan Square pie counter with an ever-changing rotation." },
      { name: "Jeni's Splendid Ice Creams", blurb: "Small-batch scoop shop with inventive, seasonal flavors." },
      { name: "Alliance Bakery", blurb: "Wicker Park bakery known for its colorful custom cakes." },
      { name: "Glazed and Infused", blurb: "Doughnut shop with playful, rotating specialty flavors." }
    ],
    funFacts: [
      { text: "Chicago reversed the flow of the Chicago River in 1900 — a still-impressive feat of engineering." },
      { text: "The city's flag's four stars represent Fort Dearborn, the Great Chicago Fire, and two world's fairs." },
      { text: "Chicago invented the skyscraper — the Home Insurance Building (1885) is considered the first." },
      { text: "Chicago is a major hub for finance, logistics, and a fast-growing tech scene anchored around the Loop." },
      { text: "Deep-dish pizza was invented in Chicago in 1943 at Pizzeria Uno." },
      { text: "The Chicago 'L' train system has been running continuously since 1892." }
    ],
    events: [
      { name: "Taste of Chicago", timing: "Typically July", blurb: "Massive food festival in Grant Park." },
      { name: "Chicago Air and Water Show", timing: "Typically August", blurb: "Free lakefront air show, one of the largest in the U.S." },
      { name: "Lollapalooza", timing: "Typically late July/early August", blurb: "Major multi-day music festival in Grant Park." },
      { name: "Chicago Jazz Festival", timing: "Typically Labor Day weekend", blurb: "Free jazz performances across downtown venues." },
      { name: "Christkindlmarket", timing: "Late November–December", blurb: "German-style holiday market in Daley Plaza." }
    ]
  },

  {
    name: "Los Angeles, California",
    aliases: ["los angeles", "la", "l.a.", "los angeles ca", "los angeles, ca"],
    coffee: [
      { name: "Go Get Em Tiger", blurb: "Larchmont coffee bar that treats espresso like a craft cocktail." },
      { name: "Endorffeine", blurb: "Tiny Chinatown coffee shop with a devoted cult following." },
      { name: "Maru Coffee", blurb: "Minimalist Silver Lake cafe favored by industry regulars." },
      { name: "Cognoscenti Coffee", blurb: "Culver City roaster with a quiet, focused tasting-room feel." },
      { name: "Dayglow", blurb: "Bright, unfussy Arts District cafe with excellent pour-overs." },
      { name: "Bloom & Plume Coffee", blurb: "Black-owned Hollywood-adjacent cafe and community space." }
    ],
    restaurants: [
      { name: "Sqirl (off-peak hours)", blurb: "East Hollywood breakfast spot that started as a jam shop." },
      { name: "Guerrilla Tacos", blurb: "Started as a taco cart, now a beloved sit-down spot." },
      { name: "Konbi", blurb: "Tiny Echo Park sandwich shop worth the wait." },
      { name: "Jitlada", blurb: "Unassuming Thai Town strip-mall spot with a cult following for Southern Thai food." },
      { name: "Petit Trois", blurb: "Tiny counter-only French bistro tucked next to its sibling restaurant." },
      { name: "Yang Chow (original Chinatown location)", blurb: "Home of the famous slippery shrimp since 1977." }
    ],
    desserts: [
      { name: "Fosselman's Ice Cream", blurb: "Family-run Alhambra ice cream parlor since 1919." },
      { name: "Bob's Coffee & Doughnuts", blurb: "Original Farmers Market doughnut counter since 1947." },
      { name: "Third & Fairfax's Puddin'", blurb: "Small-batch pudding shop tucked into the Original Farmers Market." },
      { name: "Semifreddi's at Grand Central Market", blurb: "Gelato counter inside the historic downtown market." },
      { name: "Cofax Coffee's pastry case", blurb: "Fairfax coffee shop with a surprisingly good rotating pastry lineup." },
      { name: "Proof Bakery", blurb: "Atwater Village bakery beloved for its seasonal fruit tarts." }
    ],
    funFacts: [
      { text: "LA's city limits sprawl across roughly 469 square miles — one of the largest cities by area in the U.S." },
      { text: "The Hollywood Sign originally read 'HOLLYWOODLAND' as a real estate ad in 1923." },
      { text: "LA is home to more people of Mexican, Armenian, Filipino, and Korean descent than any city outside those countries." },
      { text: "Beyond entertainment, LA is a major hub for aerospace, fashion, and a booming tech corridor known as 'Silicon Beach.'" },
      { text: "LA's Griffith Park is more than five times the size of New York's Central Park." },
      { text: "The city has more working artists, writers, and performers than anywhere else in the U.S." }
    ],
    events: [
      { name: "LA Art Book Fair", timing: "Typically February", blurb: "Independent art publishing fair at The Geffen Contemporary." },
      { name: "Rose Parade", timing: "January 1", blurb: "Iconic flower-covered float parade in Pasadena." },
      { name: "Smorgasburg LA", timing: "Sundays, year-round", blurb: "Outdoor food market in Downtown LA." },
      { name: "Hollywood Bowl summer concert season", timing: "Typically June–September", blurb: "Outdoor concerts at the iconic amphitheater." },
      { name: "LA Times Festival of Books", timing: "Typically April", blurb: "One of the largest book festivals in the country." }
    ]
  },

  {
    name: "San Francisco, California",
    aliases: ["san francisco", "sf", "san fran", "san francisco ca", "san francisco, ca"],
    coffee: [
      { name: "Ritual Coffee Roasters", blurb: "One of the pioneers of SF's third-wave coffee scene." },
      { name: "Saint Frank Coffee", blurb: "Russian Hill roaster with a bright, plant-filled cafe." },
      { name: "Trouble Coffee Co.", blurb: "Tiny Outer Sunset shack famous for its cinnamon toast." },
      { name: "Andytown Coffee Roasters", blurb: "Beach-adjacent cafe known for its 'snowy plover' drink." },
      { name: "Sextant Coffee Roasters", blurb: "SoMa roaster with a clean, focused tasting bar." },
      { name: "Wrecking Ball Coffee Roasters", blurb: "Cow Hollow roaster with a strong neighborhood following." }
    ],
    restaurants: [
      { name: "Swan Oyster Depot (counter seats)", blurb: "Tiny 1912 seafood counter, standing-room lines and all." },
      { name: "La Taqueria", blurb: "Mission District taqueria often called the city's best burrito." },
      { name: "Burma Superstar (off-peak)", blurb: "Beloved Burmese spot famous for its tea leaf salad." },
      { name: "House of Nanking", blurb: "No-menu-needed Chinatown spot — just ask what's fresh." },
      { name: "Nopalito", blurb: "Cozy Mexican spot that started as a tiny counter." },
      { name: "Liholiho Yacht Club", blurb: "Unassuming entrance hides a beloved Hawaiian-inspired kitchen." }
    ],
    desserts: [
      { name: "Bi-Rite Creamery", blurb: "Mission District ice cream shop with legendary salted caramel." },
      { name: "Craftsman and Wolves", blurb: "Bakery famous for a soft-boiled egg baked into a savory muffin." },
      { name: "Golden Gate Fortune Cookies", blurb: "Tiny Chinatown factory where you can watch cookies folded by hand." },
      { name: "Tartine Bakery", blurb: "Mission bakery whose morning bun launched a thousand copycats." },
      { name: "Mitchell's Ice Cream", blurb: "Family-run Excelsior parlor since 1953, famous for ube and mango." },
      { name: "Third Culture Bakery", blurb: "Berkeley-born spot famous for mochi doughnuts." }
    ],
    funFacts: [
      { text: "San Francisco is built across more than 50 hills, giving it some of the steepest streets in the U.S." },
      { text: "The Golden Gate Bridge's signature color is officially called 'International Orange.'" },
      { text: "Cable cars are the last manually operated cable car system in the world and a National Historic Landmark." },
      { text: "SF and the greater Bay Area anchor the global tech industry, from Twitter/X to countless startups born in its garages." },
      { text: "Fog has its own name here — locals call it 'Karl.'" },
      { text: "Alcatraz Island once housed a maximum-security federal prison; no confirmed successful escape was ever recorded." }
    ],
    events: [
      { name: "Outside Lands", timing: "Typically August", blurb: "Major music festival in Golden Gate Park." },
      { name: "SF Beer Week", timing: "Typically February", blurb: "Citywide celebration of Bay Area breweries." },
      { name: "Hardly Strictly Bluegrass", timing: "Typically October", blurb: "Free bluegrass festival in Golden Gate Park." },
      { name: "Chinese New Year Parade", timing: "January or February (lunar calendar)", blurb: "One of the largest Lunar New Year celebrations outside Asia." },
      { name: "Off the Grid food markets", timing: "Various days, seasonal", blurb: "Rotating outdoor food truck markets around the city." }
    ]
  },

  {
    name: "Miami, Florida",
    aliases: ["miami", "miami fl", "miami, fl", "miami beach"],
    coffee: [
      { name: "Panther Coffee", blurb: "Wynwood roaster that helped kick off Miami's specialty coffee scene." },
      { name: "All Day", blurb: "Downtown cafe favorite among the local design and media crowd." },
      { name: "Vicky Bakery (cafecito window)", blurb: "Walk-up Cuban coffee window, a Miami morning ritual." },
      { name: "Pasion del Cielo", blurb: "Local Cuban-coffee-inspired chain with a devoted following." },
      { name: "Della Test Kitchen", blurb: "Tiny Little Haiti coffee and pastry counter." },
      { name: "Segafredo Zanetti (Lincoln Road)", blurb: "People-watching perch on Miami Beach's pedestrian mall." }
    ],
    restaurants: [
      { name: "El Mago de las Fritas", blurb: "Cash-only Cuban burger stand, a Little Havana legend." },
      { name: "Enriqueta's", blurb: "Wynwood diner-counter beloved for Cuban breakfast." },
      { name: "Ojo de Agua", blurb: "Tiny Argentine sandwich counter in the Design District." },
      { name: "La Camaronera", blurb: "Walk-up seafood counter near Domino Park, famous for its fish sandwich." },
      { name: "Doce Provisions", blurb: "Little Havana neighborhood spot serving modern Cuban comfort food." },
      { name: "Los Pinareños Fruteria", blurb: "Open-air fruit stand and lunch counter since the 1960s." }
    ],
    desserts: [
      { name: "Azucar Ice Cream Company", blurb: "Little Havana shop famous for Cuban-inspired flavors like abuela maria." },
      { name: "Los Pinareños Fruteria batidos", blurb: "Fresh fruit shakes from the same fruit-stand institution." },
      { name: "Old Havana Cuban Bakery (pastelitos)", blurb: "Guava and cheese pastries worth the drive." },
      { name: "Cielito Lindo", blurb: "Paleta and ice cream shop with Mexican-inspired flavors." },
      { name: "Knaus Berry Farm (seasonal)", blurb: "Cinnamon rolls from a working South Dade farm stand." },
      { name: "Whip 'N Dip Ice Cream", blurb: "Coconut Grove neighborhood scoop shop since 1982." }
    ],
    funFacts: [
      { text: "Miami is the only major U.S. city founded by a woman — Julia Tuttle, in 1896." },
      { text: "More than half of Miami-Dade's population speaks Spanish at home." },
      { text: "Miami is a major gateway for trade and finance between the U.S. and Latin America, alongside a fast-growing tech scene." },
      { text: "The Art Deco Historic District in South Beach has one of the largest concentrations of Art Deco buildings in the world." },
      { text: "Miami has no natural harbor — its port was entirely man-made." },
      { text: "Little Havana's Calle Ocho is home to the Walk of Stars honoring Latin celebrities, modeled after Hollywood's." }
    ],
    events: [
      { name: "Calle Ocho Festival", timing: "Typically March", blurb: "One of the world's largest Latin street festivals." },
      { name: "Miami Carnival", timing: "Typically October", blurb: "Caribbean parade and festival celebrating Miami's Caribbean community." },
      { name: "Art Basel Miami Beach", timing: "Typically early December", blurb: "Major international contemporary art fair." },
      { name: "South Beach Wine & Food Festival", timing: "Typically February", blurb: "Celebrity-chef food festival across Miami Beach." },
      { name: "Coconut Grove Arts Festival", timing: "Typically February", blurb: "Long-running juried outdoor art festival." }
    ]
  },

  {
    name: "New Orleans, Louisiana",
    aliases: ["new orleans", "nola", "new orleans la", "new orleans, la", "the big easy"],
    coffee: [
      { name: "French Truck Coffee", blurb: "Local roaster with several cozy neighborhood cafes." },
      { name: "Mammoth Espresso", blurb: "Tiny walk-up counter beloved by the Marigny/Bywater crowd." },
      { name: "Spitfire Coffee", blurb: "Compact French Quarter counter favored by locals over tourist spots." },
      { name: "HiVolt Coffee", blurb: "Central City cafe with a strong neighborhood following." },
      { name: "Congregation Coffee", blurb: "Bywater roaster in a converted historic building." },
      { name: "Flora Gallery & Coffee Shop", blurb: "Marigny coffeehouse doubling as a local art gallery." }
    ],
    restaurants: [
      { name: "Turkey and the Wolf", blurb: "Irreverent sandwich shop that punches way above its dive-bar looks." },
      { name: "Mahony's Po-Boy Shop", blurb: "Neighborhood po-boy counter locals rank over the famous names." },
      { name: "Ba Chi Canteen", blurb: "Casual Vietnamese-Cajun counter with a cult following." },
      { name: "Domilise's Po-Boys", blurb: "Family-run shop in an unassuming house since 1918." },
      { name: "Parkway Bakery and Tavern", blurb: "Mid-City institution for roast beef po-boys." },
      { name: "Bearcat Cafe", blurb: "Bright Mid-City breakfast spot worth the wait." }
    ],
    desserts: [
      { name: "Cafe du Monde (off-peak hours)", blurb: "Beignets and chicory coffee since 1862 — visit early to skip the line." },
      { name: "District Donuts", blurb: "Creative doughnut shop with rotating seasonal flavors." },
      { name: "Sucre", blurb: "Elegant Magazine Street patisserie known for its king cakes." },
      { name: "Creole Creamery", blurb: "Uptown ice cream parlor with playful Louisiana-inspired flavors." },
      { name: "Leah's Pralines", blurb: "French Quarter candy shop making pralines by hand since 1974." },
      { name: "La Divina Gelateria", blurb: "Small-batch gelato with flavors inspired by local ingredients." }
    ],
    funFacts: [
      { text: "New Orleans sits mostly below sea level and relies on an extensive levee and pump system to stay dry." },
      { text: "Jazz was born in New Orleans in the early 20th century, blending African, Caribbean, and European musical traditions." },
      { text: "The city's above-ground cemeteries earned the nickname 'Cities of the Dead' due to the high water table." },
      { text: "New Orleans is a major U.S. port city and a growing hub for film production, nicknamed 'Hollywood South.'" },
      { text: "Mardi Gras beads are typically thrown from parade floats called 'krewes,' a tradition dating to the 1800s." },
      { text: "The city's French and Spanish colonial history gives its architecture a look unlike anywhere else in the U.S." }
    ],
    events: [
      { name: "Mardi Gras", timing: "February or March (varies by year)", blurb: "The city's iconic parade season, building to Fat Tuesday." },
      { name: "New Orleans Jazz & Heritage Festival", timing: "Typically late April–early May", blurb: "Massive music festival celebrating Louisiana culture." },
      { name: "French Quarter Festival", timing: "Typically April", blurb: "Free music festival spread across the Quarter." },
      { name: "Satchmo SummerFest", timing: "Typically August", blurb: "Festival honoring Louis Armstrong's legacy." },
      { name: "Tales of the Cocktail", timing: "Typically July", blurb: "Cocktail industry festival with tastings across the city." }
    ]
  },

  {
    name: "Austin, Texas",
    aliases: ["austin", "austin tx", "austin, tx"],
    coffee: [
      { name: "Cuvee Coffee (Airport Blvd)", blurb: "Local roaster credited with pioneering nitro cold brew." },
      { name: "Fleet Coffee", blurb: "East Austin roaster with a laid-back, plant-filled patio." },
      { name: "Radio Coffee & Beer", blurb: "South Austin trailer-park cafe that's part coffee shop, part beer garden." },
      { name: "Houndstooth Coffee (original location)", blurb: "Sleek downtown cafe that helped define Austin's coffee scene." },
      { name: "Casa de Luz cafe", blurb: "Quiet, health-minded cafe attached to a community wellness center." },
      { name: "Texas French Bread's coffee counter", blurb: "Bakery-cafe combo loved by longtime residents." }
    ],
    restaurants: [
      { name: "Franklin Barbecue (early arrival)", blurb: "Famous for a reason — arrive early or expect a long line." },
      { name: "Veracruz All Natural (original trailer)", blurb: "Food-trailer tacos that launched a beloved local mini-chain." },
      { name: "Gueros Taco Bar", blurb: "South Congress taco spot in a converted feed store." },
      { name: "Kerbey Lane Cafe (original location)", blurb: "24-hour Austin institution since 1980." },
      { name: "La Barbecue", blurb: "East Austin trailer with a devoted brisket following." },
      { name: "Nixta Taqueria", blurb: "Chef-driven taco spot in an unassuming East Austin storefront." }
    ],
    desserts: [
      { name: "Amy's Ice Creams (original Guadalupe location)", blurb: "Playful Austin institution since 1984, known for 'crushin'' mix-ins." },
      { name: "Sugar Mama's Bakeshop", blurb: "Retro-styled cupcake and cake shop on South First." },
      { name: "Lick Honest Ice Creams", blurb: "Local creamery known for Texas-inspired flavors." },
      { name: "Justine's Brasserie's beignets", blurb: "Late-night French bistro with a surprisingly beloved dessert menu." },
      { name: "568 Ramen's mochi", blurb: "Unexpected dessert gem tucked into a ramen shop menu." },
      { name: "Nothing Bundt Cakes (local original idea)", blurb: "Bundt cake shop that started right here in Texas culture." }
    ],
    funFacts: [
      { text: "Austin is home to the largest urban bat colony in North America, roosting under the Congress Avenue Bridge." },
      { text: "The city's slogan, 'Keep Austin Weird,' began as a campaign to support local independent businesses." },
      { text: "Austin is one of the fastest-growing tech hubs in the U.S., often nicknamed 'Silicon Hills.'" },
      { text: "The Texas State Capitol in Austin is taller than the U.S. Capitol in Washington, D.C." },
      { text: "Austin hosts more live music venues per capita than any other U.S. city, earning it 'Live Music Capital of the World.'" },
      { text: "Barton Springs Pool is a spring-fed pool that stays around 68°F year-round." }
    ],
    events: [
      { name: "South by Southwest (SXSW)", timing: "Typically March", blurb: "Massive film, music, and tech conference and festival." },
      { name: "Austin City Limits Music Festival", timing: "Typically October (two weekends)", blurb: "Major music festival in Zilker Park." },
      { name: "Eeyore's Birthday Party", timing: "Typically April", blurb: "Quirky, long-running community festival in Pease Park." },
      { name: "Texas Book Festival", timing: "Typically November", blurb: "Free festival celebrating authors and readers." },
      { name: "Austin Food + Wine Festival", timing: "Typically spring", blurb: "Chef-driven culinary festival downtown." }
    ]
  },

  {
    name: "Seattle, Washington",
    aliases: ["seattle", "seattle wa", "seattle, wa"],
    coffee: [
      { name: "Victrola Coffee Roasters", blurb: "Capitol Hill roaster credited as a pillar of Seattle's third-wave scene." },
      { name: "Slate Coffee Roasters", blurb: "Ballard shop known for pushing coffee presentation creatively." },
      { name: "Milstead & Co.", blurb: "Cozy Fremont cafe with a rotating single-origin lineup." },
      { name: "Ada's Technical Books & Cafe", blurb: "Bookstore cafe that's part coffee shop, part science-nerd hangout." },
      { name: "Fuel Coffee", blurb: "Neighborhood cafe chain with a loyal Capitol Hill/Madrona following." },
      { name: "Cafe Vita", blurb: "Local roaster with several understated neighborhood locations." }
    ],
    restaurants: [
      { name: "Paseo (Fremont location)", blurb: "Legendary Caribbean sandwich counter with lines out the door." },
      { name: "Il Corvo Pasta (lunch-only)", blurb: "No-frills pasta counter open weekdays for lunch only." },
      { name: "Kau Kau Restaurant", blurb: "Chinatown-International District spot famous for char siu." },
      { name: "Marination Ma Kai", blurb: "Hawaiian-Korean fusion counter with a waterfront patio." },
      { name: "Pho Bac (original walk-up)", blurb: "Family-run pho counter since 1982, an ID institution." },
      { name: "Dino's Tomato Pie", blurb: "Capitol Hill pizza-by-the-slice spot with a cult local following." }
    ],
    desserts: [
      { name: "Molly Moon's Homemade Ice Cream", blurb: "Local creamery known for seasonal, Northwest-inspired flavors." },
      { name: "Fran's Chocolates", blurb: "Seattle chocolatier famous for salted caramels." },
      { name: "Hood Famous Bakeshop", blurb: "Filipino-American bakery known for ube treats." },
      { name: "Cupcake Royale", blurb: "Local cupcake chain that started in a single Madrona storefront." },
      { name: "Mee Sum Pastry", blurb: "Pike Place counter famous for pork hum bao." },
      { name: "Fainting Goat Gelato", blurb: "Small-batch gelato shop with playful rotating flavors." }
    ],
    funFacts: [
      { text: "Seattle is nicknamed the 'Emerald City' for its lush, evergreen surroundings." },
      { text: "The Space Needle was built for the 1962 World's Fair and once had the tallest structure west of the Mississippi." },
      { text: "Seattle is a major hub for aerospace (Boeing) and tech, home to Amazon and Microsoft's roots." },
      { text: "Pike Place Market is one of the oldest continuously operated public farmers markets in the U.S., open since 1907." },
      { text: "Starbucks opened its very first store in Seattle's Pike Place Market in 1971." },
      { text: "Seattle gets a reputation for rain, but several U.S. cities, including New York, actually average more annual rainfall." }
    ],
    events: [
      { name: "Bumbershoot", timing: "Typically Labor Day weekend", blurb: "Long-running arts and music festival at Seattle Center." },
      { name: "Seattle International Film Festival", timing: "Typically May", blurb: "One of the largest film festivals in the U.S." },
      { name: "Fremont Solstice Parade", timing: "Typically June", blurb: "Quirky, community-run parade marking the summer solstice." },
      { name: "Bite of Seattle", timing: "Typically July", blurb: "Large food festival at Seattle Center." },
      { name: "Seattle Restaurant Week", timing: "Twice yearly, spring & fall", blurb: "Prix-fixe menus across the city's restaurants." }
    ]
  },

  {
    name: "Boston, Massachusetts",
    aliases: ["boston", "boston ma", "boston, ma"],
    coffee: [
      { name: "Thinking Cup", blurb: "Boston Common-adjacent cafe favored by locals over chain coffee." },
      { name: "George Howell Coffee", blurb: "Local roaster credited as a pioneer of American specialty coffee." },
      { name: "Render Coffee", blurb: "South End cafe with a loyal neighborhood following." },
      { name: "Ogawa Coffee", blurb: "Japanese-inspired cafe near Downtown Crossing." },
      { name: "Caffe Vittoria (North End)", blurb: "Boston's oldest Italian cafe, open since 1929." },
      { name: "1369 Coffee House", blurb: "Cambridge neighborhood staple since the early '90s." }
    ],
    restaurants: [
      { name: "Neptune Oyster (off-peak hours)", blurb: "Tiny North End raw bar with a legendary lobster roll." },
      { name: "Mike's City Diner", blurb: "South End breakfast counter locals prefer over the tourist spots." },
      { name: "Giacomo's Ristorante", blurb: "Cash-only, no-reservations North End spot with a devoted line." },
      { name: "Villa Mexico Cafe", blurb: "Tiny Financial District counter loved for its tortas and tacos." },
      { name: "Pauli's Roast Beef", blurb: "North End sandwich counter that regulars rank above the chains." },
      { name: "Yasu (small plates counter)", blurb: "Understated Fenway spot with an outsized reputation among locals." }
    ],
    desserts: [
      { name: "Mike's Pastry (off-peak hours)", blurb: "North End cannoli institution since 1946 — go early to skip the line." },
      { name: "Modern Pastry", blurb: "Mike's quieter, equally beloved North End rival." },
      { name: "Christina's Homemade Ice Cream", blurb: "Cambridge scoop shop known for adventurous flavors like burnt sugar." },
      { name: "Bova's Bakery (24-hour)", blurb: "North End bakery that never closes, cannoli included." },
      { name: "J.P. Licks", blurb: "Local ice cream chain with a loyal Jamaica Plain following since 1981." },
      { name: "Flour Bakery + Cafe", blurb: "Beloved local bakery famous for its sticky buns." }
    ],
    funFacts: [
      { text: "Boston Common, established in 1634, is the oldest public park in the United States." },
      { text: "The Freedom Trail is a 2.5-mile red-brick-marked route connecting 16 historic Revolutionary War sites." },
      { text: "Boston is home to more than 35 colleges and universities, giving it one of the highest concentrations of students in the world." },
      { text: "The city anchors a major biotech and life-sciences hub, alongside a long-standing finance and education economy." },
      { text: "The term 'Beantown' comes from Boston's colonial-era reputation for baked beans, a dish rooted in its molasses trade." },
      { text: "Fenway Park, opened in 1912, is the oldest active Major League Baseball stadium in the U.S." }
    ],
    events: [
      { name: "Boston Marathon", timing: "Patriots' Day, typically mid-April", blurb: "The world's oldest annual marathon." },
      { name: "Boston Harborfest", timing: "Around July 4th", blurb: "Multi-day Revolutionary-history festival along the harbor." },
      { name: "Boston Calling Music Festival", timing: "Typically May", blurb: "Multi-day music festival at Harvard's Athletic Complex." },
      { name: "Head of the Charles Regatta", timing: "Typically mid-October", blurb: "The world's largest two-day rowing event." },
      { name: "First Night Boston", timing: "December 31", blurb: "Family-friendly New Year's Eve arts celebration." }
    ]
  },

  {
    name: "Paris, France",
    aliases: ["paris", "paris france", "paris, france"],
    coffee: [
      { name: "Coutume Café", blurb: "7th arrondissement roaster credited with launching Paris's specialty coffee scene." },
      { name: "Ten Belles", blurb: "Tiny canal-side cafe near Canal Saint-Martin, always full of regulars." },
      { name: "Fragments", blurb: "Marais coffee bar favored by locals over tourist cafes." },
      { name: "Boot Café", blurb: "Former shoe-repair shop turned tiny, much-loved coffee counter." },
      { name: "KB CaféShop", blurb: "South Pigalle roaster with a loyal neighborhood following." },
      { name: "Café Lomi", blurb: "18th arrondissement roastery tucked into a quiet residential street." }
    ],
    restaurants: [
      { name: "Chez Dumonet", blurb: "Classic bistro locals treasure for old-school Parisian cooking." },
      { name: "L'As du Fallafel", blurb: "Marais falafel counter with a line that's part of the experience." },
      { name: "Le Petit Vendôme", blurb: "Unassuming sandwich counter near Place Vendôme, easy to miss." },
      { name: "Chez Janou", blurb: "Provençal bistro tucked down a quiet Marais side street." },
      { name: "Breizh Café", blurb: "Modern crêperie beloved by locals over tourist-trap versions." },
      { name: "Le Baratin", blurb: "Belleville neighborhood bistro known to serious Paris food lovers." }
    ],
    desserts: [
      { name: "Du Pain et des Idées", blurb: "Beloved bakery famous for its escargot pastry (pistachio-chocolate swirl)." },
      { name: "Pierre Hermé (small counters)", blurb: "Macaron pioneer — the smaller counters skip the flagship-store lines." },
      { name: "Berthillon", blurb: "Île Saint-Louis ice cream institution since 1954." },
      { name: "Stohrer", blurb: "Paris's oldest pastry shop, open since 1730." },
      { name: "Cedric Grolet's window", blurb: "Trompe-l'œil fruit pastries — arrive early, they sell out fast." },
      { name: "Jacques Genin", blurb: "Marais chocolatier famous for its caramels and hot chocolate." }
    ],
    funFacts: [
      { text: "The Eiffel Tower grows about 6 inches taller in summer as the iron expands in heat." },
      { text: "Paris has only one official stop sign — nearly all its intersections use priority-to-the-right rules instead." },
      { text: "Beyond fashion and tourism, Paris is a major European hub for finance, luxury goods, and a growing tech-startup scene ('Station F')." },
      { text: "The Louvre is the world's most-visited museum, housing roughly 380,000 objects." },
      { text: "Paris's street numbering follows the Seine — odd numbers on one side, even on the other, counting outward from the river." },
      { text: "Beneath the city lie roughly 200 miles of tunnels, including the famous Catacombs holding millions of remains." }
    ],
    events: [
      { name: "Fête de la Musique", timing: "June 21", blurb: "Citywide free music festival marking the summer solstice." },
      { name: "Bastille Day", timing: "July 14", blurb: "National holiday with a military parade and fireworks at the Eiffel Tower." },
      { name: "Nuit Blanche", timing: "Typically October", blurb: "All-night contemporary art festival across the city." },
      { name: "Paris Fashion Week", timing: "Typically late Feb/March & Sept/Oct", blurb: "Major fashion industry event." },
      { name: "Christmas markets along the Champs-Élysées", timing: "December", blurb: "Seasonal holiday market stalls." }
    ]
  },

  {
    name: "London, England",
    aliases: ["london", "london england", "london, england", "london uk"],
    coffee: [
      { name: "Monmouth Coffee (Borough Market)", blurb: "One of London's original specialty roasters, still drawing a line." },
      { name: "Prufrock Coffee", blurb: "Farringdon cafe credited as a pillar of London's coffee scene." },
      { name: "Climpson & Sons", blurb: "Broadway Market roaster with a loyal East London following." },
      { name: "Allpress Espresso", blurb: "Shoreditch roastery cafe with a devoted regular crowd." },
      { name: "Kaffeine", blurb: "Fitzrovia cafe that helped popularize flat whites in London." },
      { name: "Workshop Coffee", blurb: "Clerkenwell roaster known for precise, minimalist brewing." }
    ],
    restaurants: [
      { name: "Padella", blurb: "Tiny Borough Market pasta counter with a line that moves fast." },
      { name: "Brawn", blurb: "Understated Columbia Road spot loved by East London regulars." },
      { name: "Rochelle Canteen", blurb: "Former school bike shed turned beloved lunch spot." },
      { name: "Ganapati", blurb: "Peckham South Indian restaurant with a devoted local following." },
      { name: "Palomar", blurb: "Modern Israeli kitchen tucked just off Leicester Square." },
      { name: "Poppies Fish & Chips (Spitalfields)", blurb: "Retro-styled chippy locals rate above the tourist versions." }
    ],
    desserts: [
      { name: "Konditor", blurb: "Small bakery chain famous for its dense, rich chocolate brownies." },
      { name: "Bageriet", blurb: "Tiny Covent Garden Swedish bakery famous for cardamom buns." },
      { name: "Yolk Patisserie", blurb: "Modern London patisserie known for creative fruit tarts." },
      { name: "Milk Beach's dessert menu", blurb: "Notting Hill cafe known for its surprisingly good pastry case." },
      { name: "Gail's Bakery (original Hampstead)", blurb: "Neighborhood bakery chain that started with this single shop." },
      { name: "Chin Chin Labs", blurb: "Camden ice cream lab making scoops with liquid nitrogen." }
    ],
    funFacts: [
      { text: "London's Underground, opened in 1863, is the oldest metro system in the world." },
      { text: "The city is made up of 32 boroughs plus the historic City of London, a distinct square-mile financial district." },
      { text: "London is one of the world's leading financial centers, alongside a fast-growing fintech and startup scene." },
      { text: "Big Ben is technically the name of the bell, not the clock tower itself (officially the Elizabeth Tower)." },
      { text: "More than 300 languages are spoken across London, making it one of the most linguistically diverse cities on Earth." },
      { text: "The Great Fire of London in 1666 destroyed most of the medieval city, reshaping its layout entirely." }
    ],
    events: [
      { name: "Notting Hill Carnival", timing: "August Bank Holiday weekend", blurb: "One of the world's largest street festivals, celebrating Caribbean culture." },
      { name: "Trooping the Colour", timing: "Typically June", blurb: "Official military ceremony marking the monarch's birthday." },
      { name: "London Film Festival", timing: "Typically October", blurb: "Major international film festival." },
      { name: "Winter Wonderland (Hyde Park)", timing: "November–January", blurb: "Large seasonal holiday market and funfair." },
      { name: "Chelsea Flower Show", timing: "Typically May", blurb: "World-renowned gardening and flower show." }
    ]
  }
];
