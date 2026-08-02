/* ============================================================================
   Factual material about individual units, used to build the conversion pages.

   The 100 "X to Y" pages previously shared one prose skeleton with the numbers
   swapped — measured at 45% mean pairwise similarity, which is the pattern ad
   reviewers and search engines both read as scaled content.

   The fix is structural rather than cosmetic. Each page is now composed from
   real material about its OWN two units: where the unit came from, how it is
   defined today, who actually uses it, and a reference quantity a reader can
   picture. Because every page pairs two different units drawn from this file,
   the substance genuinely differs page to page rather than the wording being
   shuffled.

   Accuracy matters here — these are factual claims on indexable pages. Where a
   figure is exact by definition it says so; where it is approximate it is
   written as approximate.
   ========================================================================== */

/* Per-unit material.
   origin    — where the unit comes from and how it is defined now
   usedBy    — who uses it in practice, and for what
   anchor    — a quantity a reader can picture, to make the scale concrete   */
export const UNIT_FACTS = {
  // ---- length ----
  cm: {
    origin:
      "The centimetre is one hundredth of a metre, and the metre has been defined since 1983 as the distance light travels in a vacuum in 1/299,792,458 of a second — a definition that ties it to a physical constant rather than to any object.",
    usedBy:
      "It is the everyday metric unit for anything hand-sized: body measurements, clothing sizes, paper and furniture dimensions across most of the world.",
    anchor: "A credit card is 8.56 cm wide, and an adult of 5 feet 9 inches is about 175 cm tall.",
  },
  in: {
    origin:
      "The inch began as the width of a thumb and was standardised in 1959, when the international yard and pound agreement defined it as exactly 2.54 centimetres. That figure is a definition, not a rounded measurement.",
    usedBy:
      "It remains standard in the United States and persists worldwide for screen and display sizes, pipe and tyre diameters, and print dimensions regardless of the local system.",
    anchor: "A standard sheet of US Letter paper is 8.5 inches wide, and a typical laptop screen is 13 to 15 inches measured diagonally.",
  },
  mm: {
    origin:
      "The millimetre is one thousandth of a metre. It is the smallest unit most people encounter on an ordinary ruler, and the finest division that is comfortably readable by eye.",
    usedBy:
      "It is the working unit of engineering drawings, machining and construction, where specifying in centimetres would introduce ambiguous decimal places. Technical drawings almost universally use millimetres without stating the unit.",
    anchor: "A credit card is 0.76 mm thick and a standard pencil lead is 0.7 mm across.",
  },
  m: {
    origin:
      "The metre was defined in 1793 as one ten-millionth of the distance from the equator to the North Pole. It is now defined by the speed of light, which makes it reproducible in any laboratory without reference to a physical artefact.",
    usedBy:
      "It is the base unit of length in the International System and the standard for room dimensions, building heights, athletics distances and almost all scientific work.",
    anchor: "A standard interior door is about 2 metres tall, and an Olympic swimming pool is 50 metres long.",
  },
  ft: {
    origin:
      "The foot derives from the human foot and varied considerably between regions until it was fixed by the 1959 agreement at exactly 0.3048 metres. It is divided into 12 inches, a duodecimal division that survives from a period when dividing by three and four mattered more than dividing by ten.",
    usedBy:
      "It is the standard unit for height and building dimensions in the United States, and remains in worldwide use in aviation, where altitude is reported in feet almost everywhere.",
    anchor: "A basketball hoop is 10 feet above the floor, and a typical residential ceiling is 8 to 9 feet.",
  },
  km: {
    origin:
      "The kilometre is one thousand metres, introduced with the metric system as a practical unit for the distances between places rather than within them.",
    usedBy:
      "It is the standard road-distance unit almost everywhere outside the United States and the United Kingdom, and the standard unit for running and cycling distances internationally.",
    anchor: "A brisk walk covers about 5 km in an hour, and a marathon is 42.195 km.",
  },
  mi: {
    origin:
      "The mile comes from the Roman mille passus — a thousand paces, each pace being two steps. The modern statute mile of 5,280 feet was fixed by an English statute in 1593, which is why the number is so awkward: it was chosen to accommodate the existing furlong rather than for convenience.",
    usedBy:
      "It is the road-distance unit of the United States and the United Kingdom, which is why British road signs give miles while almost everything else in Britain is metric.",
    anchor: "A mile is a comfortable 15 to 20 minute walk, and a marathon is 26.2 miles.",
  },
  yd: {
    origin:
      "The yard was defined by the 1959 agreement as exactly 0.9144 metres. Its older definitions were tied to the length of a monarch's arm or a physical bronze bar, both of which proved unsatisfactory as precision requirements grew.",
    usedBy:
      "It survives mainly in sport — American football is played on a field marked in yards — and in the fabric and landscaping trades, where material is sold by the yard.",
    anchor: "An American football field is 100 yards between goal lines, and a yard is roughly one long stride.",
  },
  nmi: {
    origin:
      "The nautical mile is based on the Earth itself: it was originally one minute of latitude, and is now defined as exactly 1,852 metres. That geographic basis is precisely why it exists.",
    usedBy:
      "It is the distance unit of sea and air navigation worldwide. Because one nautical mile equals one minute of latitude, a navigator can measure distance directly off a chart's latitude scale without any conversion.",
    anchor: "A nautical mile is about 15% longer than a statute mile, and one degree of latitude is 60 nautical miles.",
  },

  // ---- weight ----
  kg: {
    origin:
      "The kilogram was the last SI unit defined by a physical object — a platinum-iridium cylinder held near Paris. In 2019 it was redefined in terms of the Planck constant, ending more than a century of the world's mass standard slowly changing weight relative to its own copies.",
    usedBy:
      "It is the base SI unit of mass and the standard for body weight, groceries and freight almost everywhere outside the United States.",
    anchor: "A litre of water weighs almost exactly 1 kg, which is not a coincidence — the metric system was designed that way.",
  },
  lb: {
    origin:
      "The pound descends from the Roman libra, which is why its abbreviation is lb. It was defined in 1959 as exactly 0.45359237 kilograms — an unusually precise figure because it had to reconcile slightly different British and American pounds already in use.",
    usedBy:
      "It is the standard unit of body weight and food packaging in the United States, and remains in common conversational use in the United Kingdom alongside metric labelling.",
    anchor: "A standard bag of sugar is 2 lb, and a gallon of water weighs about 8.34 lb.",
  },
  g: {
    origin:
      "The gram was originally defined as the mass of one cubic centimetre of water at its freezing point. It is now simply one thousandth of a kilogram, the base unit having overtaken it.",
    usedBy:
      "It is the working unit of cooking, nutrition labelling and postage. Baking in grams rather than cups is measurably more accurate, because volume measures of flour vary by how firmly it is packed.",
    anchor: "A standard paperclip weighs about 1 gram, and a metric cup of flour is roughly 125 g.",
  },
  oz: {
    origin:
      "The ounce comes from the Roman uncia, meaning one twelfth. Confusingly it is now one sixteenth of a pound rather than one twelfth, a change that followed the shift from the Roman to the avoirdupois system.",
    usedBy:
      "It is used for food portions, packaging weights and postal rates in the United States, and for precious metals in a different form — the troy ounce, which is heavier and used only for gold, silver and platinum.",
    anchor: "A slice of bread weighs about 1 ounce, and a standard tin of soup is around 10.75 oz.",
  },
  st: {
    origin:
      "The stone was fixed at 14 pounds by an English statute in 1389. Before standardisation it varied by trade and by commodity, with different stones used for wool, meat and glass.",
    usedBy:
      "It is used almost exclusively in Britain and Ireland, and almost exclusively for body weight. British people commonly state their weight in stones and pounds while buying everything else in kilograms.",
    anchor: "A weight of 11 stone is 154 pounds, or about 70 kg.",
  },
  t: {
    origin:
      "The tonne, or metric ton, is exactly 1,000 kilograms. It is deliberately close to the older imperial ton, which causes persistent confusion because the two are not the same: a US short ton is 2,000 pounds, about 907 kg, and a British long ton is 2,240 pounds, about 1,016 kg.",
    usedBy:
      "It is the standard unit for freight, vehicle weights, industrial quantities and carbon emissions reporting worldwide.",
    anchor: "A typical family car weighs around 1.5 tonnes, and a cubic metre of water weighs exactly 1 tonne.",
  },
  mg: {
    origin:
      "The milligram is one thousandth of a gram, and one millionth of a kilogram. It sits at the boundary of what ordinary scales can measure — laboratory balances are needed for reliable readings at this scale.",
    usedBy:
      "It is the standard unit for medication doses, vitamin content and nutritional trace amounts, where the difference between a correct and an incorrect figure can be clinically serious.",
    anchor: "A standard aspirin tablet contains 325 mg of active ingredient, and a grain of table salt weighs roughly 0.06 mg.",
  },

  // ---- temperature ----
  c: {
    origin:
      "Anders Celsius proposed the scale in 1742 — originally inverted, with 0 as boiling and 100 as freezing, which was reversed after his death. It is now defined against the kelvin, with 0 °C at 273.15 K.",
    usedBy:
      "It is the everyday temperature scale in almost every country, and the scientific standard for ordinary laboratory work.",
    anchor: "Water freezes at 0 °C and boils at 100 °C at sea level, and normal human body temperature is about 37 °C.",
  },
  f: {
    origin:
      "Daniel Fahrenheit devised his scale in 1724, setting 0 at the freezing point of a brine solution and 96 at approximate body temperature. Later refinement shifted body temperature to 98.6, which is why the numbers look arbitrary — they are the residue of a calibration that was itself adjusted.",
    usedBy:
      "It remains the everyday scale in the United States and a few smaller territories, and persists in older British and Caribbean usage for weather.",
    anchor: "Water freezes at 32 °F and boils at 212 °F, and a comfortable room is about 70 °F.",
  },
  k: {
    origin:
      "The kelvin starts at absolute zero — the point where thermal motion is minimal and no lower temperature is physically possible. It has no degree symbol and no negative values, which is precisely the point of it.",
    usedBy:
      "It is the SI base unit of temperature, used throughout physics and chemistry, and in lighting to describe colour temperature — the 2700K on a warm bulb and 6500K on a daylight one.",
    anchor: "Absolute zero is 0 K, water freezes at 273.15 K, and a kelvin is exactly the same size as a Celsius degree.",
  },

  // ---- data ----
  B: {
    origin:
      "A byte is eight bits, enough to represent 256 distinct values. Eight became standard because it conveniently holds one character of text in older encodings, though the size was not universal in early computing.",
    usedBy:
      "It is the fundamental unit of digital storage. File sizes, memory addresses and network payloads are all ultimately counted in bytes.",
    anchor: "One byte holds a single letter in ASCII, and a plain-text page of writing is roughly 2,000 bytes.",
  },
  KB: {
    origin:
      "The kilobyte is where the two competing conventions begin to diverge: 1,000 bytes under the SI definition, or 1,024 under the binary convention properly called a kibibyte. Both are in active use, which is the root of nearly every storage-size disagreement.",
    usedBy:
      "It describes small files — text documents, icons, configuration files and individual web assets.",
    anchor: "A short email is a few KB, and a small web icon is typically 5 to 20 KB.",
  },
  MB: {
    origin:
      "A megabyte is a thousand kilobytes, or 1,024 under the binary convention. The gap between the two definitions is about 5% at this scale and widens with every step up.",
    usedBy:
      "It is the practical unit for photographs, songs and application sizes, and the unit most mobile data allowances are counted in.",
    anchor: "A high-quality photograph is 3 to 8 MB, and a typical music track is about 5 MB.",
  },
  GB: {
    origin:
      "A gigabyte is a thousand megabytes. At this scale the divergence between the decimal and binary conventions reaches about 7%, which is why storage devices consistently appear smaller than the number printed on the box.",
    usedBy:
      "It is the standard unit for device storage, memory capacity and monthly data plans.",
    anchor: "An hour of high-definition video is roughly 3 GB, and a modern phone typically holds 128 to 512 GB.",
  },
  TB: {
    origin:
      "A terabyte is a thousand gigabytes. Here the decimal-versus-binary gap reaches about 10%, which is why a drive sold as 1 TB is reported by many operating systems as roughly 931 GB — nothing is missing, the two are simply counting differently.",
    usedBy:
      "It is the unit for hard drives, backup storage and the working datasets of small organisations.",
    anchor: "A 1 TB drive holds roughly 250,000 photographs, or about 300 hours of high-definition video.",
  },

  // ---- speed ----
  "km/h": {
    origin:
      "Kilometres per hour combines the metric distance unit with the hour, an ancient time division that the metric system never successfully replaced — decimal time was attempted during the French Revolution and abandoned.",
    usedBy:
      "It is the speed unit on road signs and vehicle speedometers in most of the world.",
    anchor: "A brisk walk is about 5 km/h, and typical motorway limits sit between 100 and 130 km/h.",
  },
  mph: {
    origin:
      "Miles per hour pairs the statute mile with the hour. It survives in the two major English-speaking countries that kept the mile for road distances.",
    usedBy:
      "It is the road speed unit of the United States and the United Kingdom, and is used for wind speed in American weather reporting.",
    anchor: "A typical US highway limit is 65 to 70 mph, and a UK motorway limit is 70 mph.",
  },
  "m/s": {
    origin:
      "Metres per second is the SI unit of speed, derived directly from the two base units of length and time without any additional scaling factor.",
    usedBy:
      "It is the standard in physics and engineering, and in scientific meteorology for wind speed. Almost every physics formula involving velocity expects it.",
    anchor: "Sound travels at about 343 m/s in air, and light at 299,792,458 m/s exactly.",
  },
  knot: {
    origin:
      "A knot is one nautical mile per hour. The name comes from the practice of measuring a ship's speed by paying out a rope with knots tied at regular intervals and counting how many passed in a timed interval.",
    usedBy:
      "It is the speed unit of shipping and aviation worldwide. Because it derives from the nautical mile, it relates directly to latitude on a chart.",
    anchor: "A cruising airliner travels at around 500 knots, and a knot is about 1.85 km/h.",
  },

  // ---- volume ----
  L: {
    origin:
      "The litre is one cubic decimetre — a cube 10 cm on each side. It is not formally an SI base unit but is accepted for use alongside them, and it was designed so that one litre of water weighs one kilogram.",
    usedBy:
      "It is the standard unit for beverages, fuel and liquid capacity in most of the world.",
    anchor: "A standard water bottle is 500 mL, and a large fizzy-drink bottle is 2 litres.",
  },
  mL: {
    origin:
      "A millilitre is one thousandth of a litre, and is exactly equal to one cubic centimetre. Medical contexts frequently write cc where the volume is identical.",
    usedBy:
      "It is the unit of medicine doses, cosmetics, and precise cooking measurement.",
    anchor: "A teaspoon is about 5 mL, and a standard can of soft drink is 330 mL.",
  },
  gal: {
    origin:
      "The gallon is the most treacherous unit in everyday use, because two incompatible versions share the name. The US liquid gallon is 3.785 litres; the imperial gallon used in the UK and Canada is 4.546 litres — roughly 20% larger.",
    usedBy:
      "It measures fuel and large liquid quantities in the United States, and persists in the United Kingdom mainly for fuel economy figures expressed in miles per gallon.",
    anchor: "A US gallon is about 3.8 litres and weighs roughly 8.34 lb; an imperial gallon is about 4.5 litres.",
  },
  cup: {
    origin:
      "The cup has no single definition, which is a genuine problem in recipes. A US customary cup is 236.6 mL, a US legal cup used on nutrition labels is 240 mL, a metric cup is 250 mL and an imperial cup is 284 mL.",
    usedBy:
      "It is the standard volume measure in American and Australian recipes. Recipes rarely state which cup they mean, and in baking the difference is enough to matter.",
    anchor: "A US cup is 236.6 mL; weighing ingredients in grams avoids the ambiguity entirely.",
  },
  tbsp: {
    origin:
      "The tablespoon is 15 mL in most of the world, but 20 mL in Australia — a difference that quietly changes results in recipes travelling between countries.",
    usedBy:
      "It is a standard cooking measure, and is used for medicine doses in some regions despite the ambiguity.",
    anchor: "A tablespoon is 15 mL, or three teaspoons, in US and UK usage.",
  },
  tsp: {
    origin:
      "The teaspoon is standardised at about 5 mL for cooking and medicine. Actual teaspoons from a cutlery drawer vary considerably and should not be used for medication.",
    usedBy:
      "It is the smallest common cooking measure and the standard unit for small medicine doses.",
    anchor: "A teaspoon is 5 mL, and there are three teaspoons in a tablespoon.",
  },
  floz: {
    origin:
      "The fluid ounce measures volume rather than weight, and like the gallon it comes in two sizes: the US fluid ounce is 29.57 mL and the imperial is 28.41 mL. It is only coincidentally related to the ounce of weight.",
    usedBy:
      "It is used for beverage and cosmetic volumes in the United States and, in its imperial form, on some British packaging.",
    anchor: "A US fluid ounce is about 29.6 mL, and a standard US drink can is 12 fl oz.",
  },
  pt: {
    origin:
      "The pint differs between systems by a wide margin: a US liquid pint is 473 mL while an imperial pint is 568 mL. The British pint remains a legally protected measure for draught beer and milk.",
    usedBy:
      "It is used for beer, milk and liquid packaging in the United States, the United Kingdom and Ireland.",
    anchor: "A UK pint is 568 mL; a US pint is 473 mL — a difference of nearly 20%.",
  },
  qt: {
    origin:
      "The quart is a quarter of a gallon, which is what its name means. It inherits the gallon's split: a US quart is 946 mL and an imperial quart is 1,137 mL.",
    usedBy:
      "It is used for milk, oil and cooking liquids in the United States, and appears in older British recipes.",
    anchor: "A US quart is 946 mL — just under a litre, which is why the two are often treated as interchangeable in cooking.",
  },

  // ---- area ----
  m2: {
    origin:
      "The square metre is the area of a square one metre on each side. It is the SI derived unit of area, requiring no conversion factor from the base unit.",
    usedBy:
      "It is the standard for floor areas, property listings and land measurement in metric countries.",
    anchor: "A typical parking space is about 12 m², and a small bedroom is around 10 to 12 m².",
  },
  ft2: {
    origin:
      "The square foot is the area of a square one foot on each side. Because the foot is 0.3048 m exactly, a square foot is 0.09290304 m² exactly.",
    usedBy:
      "It is the standard measure for property size in the United States, and is widely used in commercial real estate internationally even in otherwise metric markets.",
    anchor: "A typical US single-family home is 1,500 to 2,500 ft², and a square foot is roughly the area of a dinner plate's bounding square.",
  },
  acre: {
    origin:
      "The acre was originally the area a yoke of oxen could plough in a day — a working unit rather than a geometric one, which is why it is an awkward 43,560 square feet. It descends from a strip one furlong long by one chain wide.",
    usedBy:
      "It remains the standard unit for land area in the United States and the United Kingdom, particularly in agriculture and property sales.",
    anchor: "An acre is about 4,047 m², or roughly 60% of a football pitch.",
  },
  ha: {
    origin:
      "The hectare is 10,000 square metres — a square 100 m on each side. It was introduced as the metric answer to the acre, sized to be a practical unit for fields rather than rooms.",
    usedBy:
      "It is the standard unit for agricultural land, forestry and land-use planning in metric countries.",
    anchor: "A hectare is about 2.47 acres, and slightly larger than an international rugby pitch.",
  },
  km2: {
    origin:
      "The square kilometre is the area of a square one kilometre on each side — one million square metres.",
    usedBy:
      "It is the standard unit for the areas of cities, regions, countries and protected land.",
    anchor: "A square kilometre is 100 hectares, and Central Park in New York is about 3.4 km².",
  },
  mi2: {
    origin:
      "The square mile is the area of a square one mile on each side, equal to 640 acres. That relationship underpins the US Public Land Survey System, which divided much of the country into one-square-mile sections.",
    usedBy:
      "It is used for the areas of counties, states and large land holdings in the United States and United Kingdom.",
    anchor: "A square mile is 640 acres, or about 2.59 km².",
  },

  // ---- time ----
  s: {
    origin:
      "The second was originally 1/86,400 of a day, but the Earth's rotation is not perfectly constant. Since 1967 it has been defined by the caesium atom — 9,192,631,770 oscillations of a specific transition — which is why atomic clocks define time rather than merely measure it.",
    usedBy:
      "It is the SI base unit of time and the foundation of every other time measurement, including the definitions of the metre and the kilogram.",
    anchor: "A second is roughly one relaxed heartbeat, and light travels 299,792 km in one.",
  },
  min: {
    origin:
      "The minute of 60 seconds descends from Babylonian base-60 arithmetic, adopted because 60 divides evenly by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30. That divisibility is why base-60 survived where decimal time failed.",
    usedBy:
      "It is the universal unit for short durations — meetings, cooking, travel times and appointments.",
    anchor: "There are 60 seconds in a minute and 1,440 minutes in a day.",
  },
  h: {
    origin:
      "The hour comes from the Egyptian division of daylight into twelve parts. Those hours originally varied in length with the seasons; fixed-length hours arrived only with mechanical clocks.",
    usedBy:
      "It is the standard unit for working time, scheduling and pay rates worldwide.",
    anchor: "There are 24 hours in a day and 168 in a week.",
  },
  day: {
    origin:
      "A day is one rotation of the Earth relative to the Sun, standardised at exactly 86,400 seconds. The actual rotation drifts slightly, which is why leap seconds have occasionally been inserted to keep clocks aligned with the Earth.",
    usedBy:
      "It is the fundamental unit of calendars, deadlines, notice periods and scheduling everywhere.",
    anchor: "A day is 24 hours, 1,440 minutes or 86,400 seconds.",
  },
  week: {
    origin:
      "The seven-day week has no astronomical basis at all — unlike the day, month and year, it corresponds to nothing in nature. It descends from Babylonian and Hebrew tradition and has survived essentially unchanged for millennia.",
    usedBy:
      "It structures working patterns, pay cycles, school terms and project planning across almost every culture.",
    anchor: "A week is 7 days or 168 hours, and there are about 52.18 weeks in a year.",
  },
  year: {
    origin:
      "A year is one orbit of the Earth around the Sun, which takes about 365.2422 days rather than a whole number. The leap-year rule — divisible by 4, except centuries, unless divisible by 400 — exists to absorb that remainder.",
    usedBy:
      "It is the base unit of calendars, ages, interest rates and long-term planning.",
    anchor: "A common year is 365 days and a leap year 366; the average is 365.2425 days under the Gregorian calendar.",
  },

  // ---- pressure ----
  psi: {
    origin:
      "Pounds per square inch expresses pressure as force divided by area, using imperial units for both. It is not an SI unit but remains deeply entrenched in industry.",
    usedBy:
      "It is the standard for tyre pressure, hydraulics and compressed gas in the United States, and appears on tyre gauges worldwide.",
    anchor: "Car tyres are typically inflated to 30 to 35 psi, and atmospheric pressure at sea level is about 14.7 psi.",
  },
  bar: {
    origin:
      "The bar was defined deliberately as 100,000 pascals, which makes it very close to average atmospheric pressure at sea level. That closeness is the point — it puts everyday pressures near a value of 1.",
    usedBy:
      "It is common in European engineering, meteorology in its millibar form, and diving, where each 10 metres of depth adds roughly one bar.",
    anchor: "One bar is about 14.5 psi, and sea-level atmospheric pressure is roughly 1.013 bar.",
  },
  kPa: {
    origin:
      "The kilopascal is 1,000 pascals, the pascal being the SI unit of pressure — one newton per square metre. The pascal alone is inconveniently small for everyday pressures, hence the kilo prefix.",
    usedBy:
      "It is the standard pressure unit in scientific work and in the automotive and meteorological standards of many metric countries.",
    anchor: "Atmospheric pressure at sea level is about 101.3 kPa, and one kPa is about 0.145 psi.",
  },
  atm: {
    origin:
      "The standard atmosphere is defined as exactly 101,325 pascals — a reference value representing typical sea-level pressure rather than a measurement of it on any given day.",
    usedBy:
      "It is used in chemistry, physics and diving as a convenient reference for expressing pressure as a multiple of everyday conditions.",
    anchor: "One atmosphere is 14.7 psi or 1.013 bar, and pressure roughly doubles at 10 metres underwater.",
  },

  // ---- energy ----
  J: {
    origin:
      "The joule is the SI unit of energy, defined as the work done applying one newton over one metre. It is named after James Prescott Joule, whose experiments established that heat and mechanical work are the same quantity.",
    usedBy:
      "It is the standard energy unit throughout physics and engineering, and underlies the watt, which is one joule per second.",
    anchor: "Lifting an apple one metre takes about one joule.",
  },
  kJ: {
    origin:
      "The kilojoule is 1,000 joules, adopted for food energy labelling because joule values for meals would otherwise run into hundreds of thousands.",
    usedBy:
      "It is the primary food energy unit in Europe, Australia and New Zealand, usually printed alongside kilocalories.",
    anchor: "One kilocalorie is 4.184 kJ, so a 2,000 kcal daily intake is about 8,400 kJ.",
  },
  cal: {
    origin:
      "The calorie is the energy needed to raise one gram of water by one degree Celsius. It is a small unit, and the source of enduring confusion with the kilocalorie.",
    usedBy:
      "The small calorie is used in chemistry and physics. It is not the unit on food packaging, despite the shared name.",
    anchor: "One calorie is 4.184 joules — one thousandth of the 'calorie' quoted on food labels.",
  },
  kcal: {
    origin:
      "The kilocalorie is 1,000 small calories. What food labels and diet advice call a calorie is almost always a kilocalorie, sometimes written with a capital C to distinguish it — a distinction that is rarely observed and constantly causes confusion.",
    usedBy:
      "It is the food energy unit in the United States and in everyday nutritional conversation worldwide.",
    anchor: "A typical daily intake is around 2,000 kcal, which is 2,000,000 small calories.",
  },
  kWh: {
    origin:
      "The kilowatt-hour is the energy used by a one-kilowatt appliance running for one hour — a unit of energy built from a unit of power multiplied by time.",
    usedBy:
      "It is the billing unit for electricity worldwide and the unit used to state electric vehicle battery capacity.",
    anchor: "One kWh is 3.6 million joules, and runs a typical fridge for about a day.",
  },

  // ---- power ----
  W: {
    origin:
      "The watt is one joule per second — a rate of energy use rather than an amount. It is named after James Watt, whose improvements to the steam engine drove much of the Industrial Revolution.",
    usedBy:
      "It is the SI unit of power, used for appliances, lighting, audio equipment and electrical ratings everywhere.",
    anchor: "A modern LED bulb draws 8 to 12 W, and a kettle around 2,000 to 3,000 W.",
  },
  kW: {
    origin:
      "The kilowatt is 1,000 watts, a practical scale for machinery and vehicles where watt figures would be unwieldy.",
    usedBy:
      "It is standard for electric motor ratings, vehicle power in most of the world, and household electrical capacity.",
    anchor: "One kilowatt is about 1.34 horsepower, and a typical electric car motor produces 100 to 200 kW.",
  },
  hp: {
    origin:
      "Horsepower was devised by James Watt as a marketing measure — he needed to express his steam engines' output in terms buyers already understood, so he estimated the sustained work rate of a draught horse. It is a genuinely arbitrary unit that survived on familiarity.",
    usedBy:
      "It remains the standard for engine output in the United States and in automotive marketing worldwide, alongside kilowatts.",
    anchor: "One horsepower is about 746 watts, and a typical family car engine produces 120 to 200 hp.",
  },

  // ---- angle ----
  deg: {
    origin:
      "The 360-degree circle comes from Babylonian astronomy and their base-60 number system. The number survives because 360 divides evenly by a great many integers, making fractions of a circle convenient to express.",
    usedBy:
      "It is the everyday unit for angles in navigation, construction, geometry teaching and design software.",
    anchor: "A right angle is 90°, a full turn 360°, and one degree is 60 arcminutes.",
  },
  rad: {
    origin:
      "The radian is defined by the circle itself: it is the angle subtended by an arc equal in length to the radius. That makes it the natural angular unit — calculus formulas for sine and cosine only work cleanly in radians.",
    usedBy:
      "It is the standard in mathematics, physics and programming. Most languages' trigonometric functions expect radians, which is a frequent source of wrong results.",
    anchor: "A full turn is 2π radians, so one radian is about 57.3°.",
  },

  // ---- frequency ----
  Hz: {
    origin:
      "The hertz is one cycle per second, named after Heinrich Hertz, who first demonstrated electromagnetic waves. It replaced the older term 'cycles per second' in 1960.",
    usedBy:
      "It measures anything periodic — sound pitch, alternating current, screen refresh rates and radio frequencies.",
    anchor: "Human hearing spans roughly 20 Hz to 20,000 Hz, and mains electricity runs at 50 or 60 Hz.",
  },
  MHz: {
    origin:
      "A megahertz is one million hertz. Early personal computers were rated in megahertz, and processor clock speeds stayed in this range until the late 1990s.",
    usedBy:
      "It is used for radio broadcast frequencies, older processor speeds and memory bus rates.",
    anchor: "FM radio broadcasts between about 88 and 108 MHz.",
  },
  GHz: {
    origin:
      "A gigahertz is one billion hertz, or 1,000 megahertz. Processor clock speeds reached this range around 2000 and then largely stopped climbing, as manufacturers turned to multiple cores instead of raw frequency.",
    usedBy:
      "It describes processor clock speeds, Wi-Fi bands and mobile network frequencies.",
    anchor: "Wi-Fi operates on 2.4 GHz and 5 GHz bands, and a modern processor runs at 3 to 5 GHz.",
  },
};

/* Per-dimension framing: the conceptual point that makes this class of
   conversion worth understanding, rather than a generic "enter a value" line. */
export const DIMENSION_NOTES = {
  length:
    "Length conversions between metric and imperial are exact by definition rather than approximate. The 1959 international yard and pound agreement fixed the inch at precisely 2.54 cm and the yard at 0.9144 m, so these factors are definitions and carry no measurement error.",
  weight:
    "Strictly these are conversions of mass rather than weight — mass is how much matter something contains, weight is the force gravity exerts on it. The distinction rarely matters on Earth, where the two are proportional, but it is why the same object masses the same on the Moon while weighing about a sixth as much.",
  temperature:
    "Temperature is the one conversion here that needs a formula rather than a single factor, because Celsius and Fahrenheit do not share a zero point. That offset also means a temperature difference converts differently from a temperature: a rise of 10 °C is a rise of 18 °F, not 50 °F.",
  data:
    "Digital storage has two competing conventions. The SI definition makes a kilobyte 1,000 bytes; the binary convention used by much software makes it 1,024, properly called a kibibyte. The gap compounds at every step, reaching about 10% by the terabyte — which is why a drive sold as 1 TB shows as roughly 931 GB.",
  speed:
    "Every speed unit is a distance divided by a time, so converting between them means converting the distance and the time together. That is why the factors are less memorable than simple length conversions.",
  volume:
    "Volume carries more traps than any other category, because the same unit names mean different amounts in different countries. US and imperial gallons differ by about 20%, pints by nearly as much, and the cup has four separate definitions in common use.",
  area:
    "Area conversions square the underlying length factor, which is why they feel counterintuitive. A metre is about 3.28 feet, but a square metre is about 10.76 square feet — the factor is squared, not carried across.",
  time:
    "Time is the one system almost every country shares, and the only major measurement system that resisted metrication. Decimal time was introduced during the French Revolution and abandoned within two years, leaving base-60 minutes and seconds inherited from Babylonian arithmetic.",
  pressure:
    "Pressure is force divided by area, so every pressure unit combines two other units. The values cluster near everyday atmospheric pressure — about 14.7 psi, 1.013 bar or 101.3 kPa — because most practical scales were built around it.",
  energy:
    "Energy conversions run into the calorie problem: the calorie on a food label is really a kilocalorie, a thousand times the calorie used in chemistry. Mixing the two produces errors of a factor of a thousand.",
  power:
    "Power is a rate — energy per unit time — not an amount of energy. A kilowatt describes how fast energy is used; a kilowatt-hour describes how much was used. Confusing the two is the most common error in reading an electricity bill.",
  angle:
    "Degrees are convenient for humans and radians are natural to mathematics, since a radian is defined by the circle's own radius. Most programming languages' trigonometric functions expect radians, which is a frequent cause of wrong results in geometry code.",
  frequency:
    "Frequency units are straightforward decimal multiples of the hertz, with no competing conventions or historical irregularities — a rare case where conversion is genuinely just moving a decimal point.",
};

/* Direction-specific context, keyed by conversion slug.
   68 of the 100 pages exist as reverse twins (cm-to-inches and inches-to-cm),
   which draw on the same two units and would otherwise read almost identically.
   The reason you convert in one direction is genuinely different from the other,
   so this is where that difference gets stated. */
export const PAIR_CONTEXT = {
  // ---- length ----
  "cm-to-inches":
    "This is the direction you need when a metric measurement has to be given to someone working in inches — quoting furniture or luggage dimensions to a US buyer, or reading a European product spec for an American audience.",
  "inches-to-cm":
    "This is the direction most people outside the US need: a product listed in inches, a piece of furniture from a US retailer, or a tool size given in inches when your tape measure is metric.",
  "mm-to-inches":
    "Engineering drawings and component specifications are almost always in millimetres, so this is the conversion for sourcing a metric-specified part from a supplier who works in inches.",
  "inches-to-mm":
    "Machining and fabrication work in millimetres, so an imperial dimension from a drawing or a hardware spec usually has to come across to millimetres before anything can be cut or drilled.",
  "meters-to-feet":
    "Useful for giving a metric height or distance to an audience that thinks in feet — building heights, room dimensions, or an altitude figure for aviation, where feet remain standard worldwide.",
  "feet-to-meters":
    "The everyday conversion for anyone reading US property listings, American building specifications or climbing and diving figures quoted in feet.",
  "km-to-miles":
    "The conversion for reading distances abroad: a European or Asian road sign, a race distance, or a car's fuel range quoted in kilometres when you think in miles.",
  "miles-to-km":
    "Needed when planning travel in a metric country from a mileage figure, or converting a running distance — most race distances are defined in kilometres even where roads are signed in miles.",
  "meters-to-yards":
    "Mostly a sporting conversion: athletics and swimming are measured in metres, while American football and some golf distances are in yards.",
  "yards-to-meters":
    "Used when a distance given in yards — an American sports figure, or fabric and landscaping material sold by the yard — needs to be understood or ordered in metric.",
  "feet-to-inches":
    "A within-imperial conversion, needed whenever a height or length in feet has to be expressed as a single inch figure, which is how many technical specifications and size charts are written.",
  "inches-to-feet":
    "The reverse: turning a long inch measurement into feet and inches, which is how heights and room dimensions are actually spoken about rather than written in specs.",
  "cm-to-feet":
    "The conversion for expressing a metric height in the feet-and-inches format used in the US and UK — most often for a person's height on a form or profile.",
  "feet-to-cm":
    "Needed when a height given in feet and inches has to go onto a metric form — medical records, sports registration and most official documents outside the US ask for centimetres.",
  "km-to-meters":
    "A straightforward decimal shift within the metric system, used when a distance stated in kilometres needs the precision of metres — surveying, route planning or athletics.",
  "mm-to-cm":
    "A decimal shift used when a fine engineering measurement in millimetres needs to be expressed at the coarser scale people use conversationally.",
  "cm-to-mm":
    "Used when a measurement needs the precision of millimetres — technical drawings and manufacturing specifications are written in millimetres precisely to avoid decimal centimetres.",
  "m-to-cm":
    "Needed when a room or object measured in metres has to be given in centimetres, which is how most furniture, appliance and clothing dimensions are listed.",
  "cm-to-meters":
    "Used when accumulating many centimetre measurements into a single figure — flooring, fabric and construction quantities are ordered in metres.",
  "miles-to-feet":
    "An imperial conversion needed mainly in aviation, surveying and American civil engineering, where a distance in miles has to be expressed at the resolution of feet.",
  "yards-to-feet":
    "A within-imperial conversion used in construction and American sport, where a distance stated in yards has to be broken down into feet.",
  "inches-to-meters":
    "Used when a small imperial measurement has to enter a metric calculation — most often converting a component or fitting size before it can be combined with metric dimensions.",
  "nautical-miles-to-km":
    "Needed to relate a marine or aviation distance to land distances. Because the nautical mile is tied to latitude, sea and air charts use it while everything ashore is in kilometres.",

  // ---- weight ----
  "kg-to-lbs":
    "The direction needed when a metric weight has to be given to a US audience — body weight on an American form, or a shipping weight for a US carrier.",
  "lbs-to-kg":
    "The everyday conversion outside the US: a body weight quoted in pounds, a US recipe, or a baggage allowance stated in pounds when the airline scale reads kilograms.",
  "grams-to-ounces":
    "The conversion for cooking a metric recipe with American measuring equipment, and for postage, where US rates are banded in ounces.",
  "ounces-to-grams":
    "Needed to cook an American recipe accurately. Weighing in grams is considerably more precise than the cup measures US recipes otherwise use, especially in baking.",
  "kg-to-grams":
    "A decimal shift used when a bulk weight has to be broken into the gram quantities used in recipes, nutrition labelling and portioning.",
  "grams-to-kg":
    "Used when accumulating gram measurements into a single figure — totalling ingredient weights, or converting a nutrition figure into a shipping or bulk quantity.",
  "lbs-to-ounces":
    "A within-imperial conversion needed for US postal rates, food portioning and infant weights, all of which are stated in pounds and ounces.",
  "ounces-to-pounds":
    "The reverse: turning an ounce figure into pounds, which is how larger weights are actually quoted in the US even when measured in ounces.",
  "stones-to-kg":
    "Almost exclusively a British body-weight conversion — turning a weight given in stones into the kilograms that medical records and gym equipment use.",
  "kg-to-stones":
    "The conversion British and Irish users need to make sense of a metric scale reading, since body weight is still discussed in stones and pounds there.",
  "tons-to-kg":
    "Needed for freight, vehicle and industrial weights. Take care which ton is meant — a metric tonne is 1,000 kg, a US short ton about 907 kg and a British long ton about 1,016 kg.",
  "mg-to-grams":
    "A medical and nutritional conversion, used when a dose or trace amount stated in milligrams has to be related to a gram quantity on a label.",
  "pounds-to-grams":
    "Used when an imperial weight has to enter a metric calculation precisely — cooking, postage and laboratory work all need gram resolution rather than kilograms.",

  // ---- temperature ----
  "celsius-to-fahrenheit":
    "The direction travellers to the United States need, and anyone reading an American recipe or weather forecast. Oven temperatures are the most common use, and the difference is large enough to ruin baking.",
  "fahrenheit-to-celsius":
    "What Americans need abroad, and what anyone needs to interpret a US weather report or recipe. The quick mental approximation — subtract 30 and halve — is close enough for weather but not for cooking.",
  "celsius-to-kelvin":
    "A scientific conversion: chemistry and physics calculations involving gas laws and thermodynamics require absolute temperature, so Celsius readings must be shifted to kelvin before use.",
  "kelvin-to-celsius":
    "Used to make an absolute temperature intelligible in everyday terms — interpreting a scientific result, or reading the colour temperature rating on a light bulb.",
  "fahrenheit-to-kelvin":
    "A two-step conversion needed when American-sourced temperature data has to enter a scientific calculation requiring absolute temperature.",
  "kelvin-to-fahrenheit":
    "Used when a scientific or astronomical figure in kelvin has to be expressed for a US audience that thinks in Fahrenheit.",

  // ---- data ----
  "mb-to-gb":
    "Used when totalling many file sizes into a storage or data-allowance figure — working out whether a folder of photos will fit, or how much of a mobile plan a download consumes.",
  "gb-to-mb":
    "Needed when a plan or drive quoted in gigabytes has to be compared against individual file sizes, which are almost always listed in megabytes.",
  "kb-to-mb":
    "Used when many small files — web assets, documents, email attachments — need totalling into a figure that can be compared against an upload limit.",
  "mb-to-kb":
    "Needed for web performance work, where individual asset budgets are set in kilobytes even though total page weight is discussed in megabytes.",
  "gb-to-tb":
    "Used when planning storage at scale — working out how many gigabytes of backups or media fit on a terabyte drive.",
  "tb-to-gb":
    "The conversion that explains the most common storage complaint: a drive sold as 1 TB shows as roughly 931 GB, because the manufacturer counted in decimal and the operating system in binary.",
  "kb-to-gb":
    "A large jump used when aggregating very many small files, such as estimating the total size of a log archive or a document store.",
  "tb-to-mb":
    "A large-scale conversion used in capacity planning, where a terabyte allocation has to be understood in terms of individual file sizes.",
  "bytes-to-kb":
    "The smallest step in the storage scale, used when reading raw byte counts from a program or API and needing a human-readable figure.",

  // ---- speed ----
  "kmh-to-mph":
    "The conversion drivers need when reading a metric speedometer or road sign and thinking in miles per hour — or when relating a metric vehicle specification to a US audience.",
  "mph-to-kmh":
    "Needed when driving in a metric country from a US or UK frame of reference, and for interpreting American vehicle specifications and wind speeds.",
  "ms-to-kmh":
    "A physics-to-everyday conversion: scientific and engineering work uses metres per second, while road speeds and weather reports use kilometres per hour.",
  "kmh-to-ms":
    "The reverse, needed to bring a road or wind speed into a physics calculation — almost every formula involving velocity expects metres per second.",
  "knots-to-kmh":
    "Used to relate a marine or aviation speed to land speeds, since shipping and flying use knots while everything ashore is in kilometres per hour.",
  "knots-to-mph":
    "The same relation for a US or UK audience — interpreting a reported aircraft or vessel speed in the miles per hour used on the road.",
  "mph-to-ms":
    "Needed when an imperial speed has to enter a scientific calculation, since physics formulas require metres per second rather than any road unit.",

  // ---- volume ----
  "liters-to-gallons":
    "Used for fuel economy and large liquid quantities. Check which gallon is meant — the US gallon is about 3.79 litres and the imperial gallon about 4.55, a difference of roughly 20%.",
  "gallons-to-liters":
    "Needed when a US fuel, paint or liquid quantity has to be bought or measured in a metric country, where the same product is sold in litres.",
  "ml-to-liters":
    "Used when many small volumes total into a larger one — batching recipes, or working out how many millilitre servings a litre bottle provides.",
  "liters-to-ml":
    "Needed for precise measurement in cooking, medicine and laboratory work, where litre quantities have to be divided into millilitre doses.",
  "cups-to-ml":
    "The conversion for cooking an American or Australian recipe with metric equipment. Note that the cup is not standard — US customary is 236.6 mL, metric 250 mL and imperial 284 mL.",
  "ml-to-cups":
    "Needed to follow a metric recipe with American measuring cups. Because cup definitions vary between countries, weighing in grams is more reliable for baking.",
  "gallons-to-ml":
    "A large-to-small conversion used when a bulk liquid quantity has to be divided into precise doses or portions.",
  "tbsp-to-tsp":
    "A within-recipe conversion, useful when a measuring spoon is missing. Note that a tablespoon is three teaspoons in US and UK usage but four in Australia, where it is 20 mL.",
  "cups-to-tbsp":
    "Used when scaling a recipe down, or when a cup measure is unavailable and the quantity has to be built from tablespoons.",
  "floz-to-ml":
    "Needed for beverage and cosmetic volumes given in US fluid ounces. The US fluid ounce is 29.57 mL and the imperial 28.41 mL, so check which is meant.",
  "pints-to-liters":
    "Used for beer, milk and liquid packaging. The difference matters more here than almost anywhere: a UK pint is 568 mL while a US pint is 473 mL.",
  "quarts-to-liters":
    "Needed for American milk, oil and cooking quantities. A US quart is 946 mL, just under a litre, which is why the two are often treated as interchangeable in cooking.",

  // ---- area ----
  "sqm-to-sqft":
    "The standard conversion in commercial property, where floor area is frequently quoted in square feet internationally even in otherwise metric markets.",
  "sqft-to-sqm":
    "Needed to compare a US property listing against metric ones, or to convert a floor area for a metric building specification or flooring order.",
  "acres-to-sqm":
    "Used when a land parcel given in acres has to enter a metric planning or surveying calculation.",
  "sqft-to-acres":
    "A US land conversion, used when a parcel measured in square feet has to be expressed at the scale land is actually traded in.",
  "hectares-to-acres":
    "The standard agricultural conversion, needed when comparing metric farmland figures against US or UK holdings quoted in acres.",
  "acres-to-hectares":
    "Needed for agricultural subsidy, land registry and planning paperwork in metric countries, which record area in hectares.",
  "sqkm-to-sqmi":
    "Used for the areas of cities, regions and countries, where reference sources differ on which unit they report.",

  // ---- time ----
  "hours-to-minutes":
    "Used for scheduling and billing, where an hourly figure has to be broken into the minute resolution that timesheets and appointment systems use.",
  "minutes-to-hours":
    "Needed when accumulated minutes — tracked work, exercise, travel legs — have to be totalled into the hours used for pay and reporting.",
  "minutes-to-seconds":
    "Used in timing, media production and technical configuration, where durations are frequently specified in seconds regardless of how they are discussed.",
  "seconds-to-minutes":
    "Needed to make a raw second count intelligible — reading a duration from a log, an API response or a media file's metadata.",
  "days-to-hours":
    "Used for project estimation and service-level calculations, where a period in days has to be expressed in the hours actually available.",
  "hours-to-days":
    "Needed when accumulated hours have to be understood as elapsed days — useful for effort estimates and for reading long-running process durations.",
  "weeks-to-days":
    "Used for deadlines and notice periods, which are frequently agreed in weeks but counted in days for legal and contractual purposes.",
  "days-to-weeks":
    "Needed to express a day count in the weeks people actually plan in — pregnancy stages, project sprints and notice periods are all discussed in weeks.",
  "years-to-days":
    "Used for age, interest and long-duration calculations. Note that a year is not exactly 365 days — the average under the Gregorian calendar is 365.2425.",

  // ---- pressure ----
  "psi-to-bar":
    "Needed when a US-specified pressure has to be set on European equipment, which is calibrated in bar — most commonly tyre inflation and compressed air.",
  "bar-to-psi":
    "The conversion for using a psi-calibrated gauge against a specification in bar, which is the usual situation with imported equipment and diving gear.",
  "kpa-to-psi":
    "Used in automotive work, where tyre placards in metric countries state kilopascals while most gauges read psi.",
  "atm-to-psi":
    "A reference conversion used in diving and chemistry, relating a pressure expressed as multiples of atmospheric pressure to a practical gauge reading.",

  // ---- energy ----
  "kj-to-cal":
    "Needed to read European, Australian and New Zealand food labelling, which states energy in kilojoules, against dietary advice given in calories.",
  "kcal-to-kj":
    "The reverse, needed when a US calorie figure has to be entered into a system or label that uses kilojoules.",
  "kwh-to-joules":
    "A conversion from the billing unit of electricity to the SI unit of energy, needed whenever consumption data enters a physics or engineering calculation.",

  // ---- power ----
  "hp-to-kw":
    "Needed when an engine output quoted in horsepower has to go onto metric documentation — vehicle registration and technical specifications in most countries use kilowatts.",
  "kw-to-hp":
    "The conversion for comparing a metric-specified motor or vehicle against the horsepower figures used in US and marketing contexts.",
  "watts-to-hp":
    "Used for smaller motors and appliances, where output is rated in watts but has to be compared against equipment specified in horsepower.",

  // ---- angle ----
  "degrees-to-radians":
    "Essential in programming and physics, because almost every language's trigonometric functions expect radians. Passing degrees to them is one of the most common causes of wrong geometry results.",
  "radians-to-degrees":
    "Needed to make a calculated angle intelligible, since design software, navigation and construction all work in degrees rather than radians.",

  // ---- frequency ----
  "ghz-to-mhz":
    "Used in computing and radio, where a processor or band specified in gigahertz has to be compared against figures quoted in megahertz.",
  "mhz-to-hz":
    "Needed when a radio or clock frequency has to enter a calculation at base units, since formulas involving frequency expect hertz.",
};

export function unitFact(key) {
  return UNIT_FACTS[key] || null;
}
export function dimensionNote(dim) {
  return DIMENSION_NOTES[dim] || null;
}
export function pairContext(slug) {
  return PAIR_CONTEXT[slug] || null;
}
