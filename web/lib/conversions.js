// Unit-conversion engine. One data table drives dozens of dedicated,
// individually-searchable conversion pages (great for SEO / long-tail traffic).

export const UNITS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523, t: 1000, st: 6.35029318 },
  data: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
  speed: { "m/s": 1, "km/h": 0.2777778, mph: 0.44704, knot: 0.5144444, "ft/s": 0.3048 },
  volume: { L: 1, mL: 0.001, gal: 3.785411784, qt: 0.946352946, cup: 0.2365882365, floz: 0.0295735296, m3: 1000 },
  area: { m2: 1, km2: 1e6, cm2: 0.0001, ft2: 0.09290304, in2: 0.00064516, acre: 4046.8564224, ha: 10000, mi2: 2589988.11 },
  time: { s: 1, min: 60, h: 3600, day: 86400, week: 604800, year: 31557600 },
};

export function convert(value, from, to, dim) {
  if (dim === "temperature") {
    let c = from === "c" ? value : from === "f" ? (value - 32) * 5 / 9 : value - 273.15;
    const out = to === "c" ? c : to === "f" ? c * 9 / 5 + 32 : c + 273.15;
    return Math.round(out * 1e6) / 1e6;
  }
  const u = UNITS[dim];
  if (!u || u[from] == null || u[to] == null) return NaN;
  const r = (value * u[from]) / u[to];
  return Math.round(r * 1e9) / 1e9;
}

// [slug, dim, from, to, "From Label", "To Label", "unit-abbr-from", "unit-abbr-to"]
const P = [
  ["cm-to-inches", "length", "cm", "in", "Centimeters", "Inches", "cm", "in"],
  ["inches-to-cm", "length", "in", "cm", "Inches", "Centimeters", "in", "cm"],
  ["mm-to-inches", "length", "mm", "in", "Millimeters", "Inches", "mm", "in"],
  ["inches-to-mm", "length", "in", "mm", "Inches", "Millimeters", "in", "mm"],
  ["meters-to-feet", "length", "m", "ft", "Meters", "Feet", "m", "ft"],
  ["feet-to-meters", "length", "ft", "m", "Feet", "Meters", "ft", "m"],
  ["km-to-miles", "length", "km", "mi", "Kilometers", "Miles", "km", "mi"],
  ["miles-to-km", "length", "mi", "km", "Miles", "Kilometers", "mi", "km"],
  ["meters-to-yards", "length", "m", "yd", "Meters", "Yards", "m", "yd"],
  ["yards-to-meters", "length", "yd", "m", "Yards", "Meters", "yd", "m"],
  ["feet-to-inches", "length", "ft", "in", "Feet", "Inches", "ft", "in"],
  ["inches-to-feet", "length", "in", "ft", "Inches", "Feet", "in", "ft"],
  ["cm-to-feet", "length", "cm", "ft", "Centimeters", "Feet", "cm", "ft"],
  ["km-to-meters", "length", "km", "m", "Kilometers", "Meters", "km", "m"],

  ["kg-to-lbs", "weight", "kg", "lb", "Kilograms", "Pounds", "kg", "lb"],
  ["lbs-to-kg", "weight", "lb", "kg", "Pounds", "Kilograms", "lb", "kg"],
  ["grams-to-ounces", "weight", "g", "oz", "Grams", "Ounces", "g", "oz"],
  ["ounces-to-grams", "weight", "oz", "g", "Ounces", "Grams", "oz", "g"],
  ["kg-to-grams", "weight", "kg", "g", "Kilograms", "Grams", "kg", "g"],
  ["lbs-to-ounces", "weight", "lb", "oz", "Pounds", "Ounces", "lb", "oz"],
  ["stones-to-kg", "weight", "st", "kg", "Stones", "Kilograms", "st", "kg"],
  ["tons-to-kg", "weight", "t", "kg", "Tonnes", "Kilograms", "t", "kg"],

  ["celsius-to-fahrenheit", "temperature", "c", "f", "Celsius", "Fahrenheit", "°C", "°F"],
  ["fahrenheit-to-celsius", "temperature", "f", "c", "Fahrenheit", "Celsius", "°F", "°C"],
  ["celsius-to-kelvin", "temperature", "c", "k", "Celsius", "Kelvin", "°C", "K"],
  ["kelvin-to-celsius", "temperature", "k", "c", "Kelvin", "Celsius", "K", "°C"],

  ["mb-to-gb", "data", "MB", "GB", "Megabytes", "Gigabytes", "MB", "GB"],
  ["gb-to-mb", "data", "GB", "MB", "Gigabytes", "Megabytes", "GB", "MB"],
  ["kb-to-mb", "data", "KB", "MB", "Kilobytes", "Megabytes", "KB", "MB"],
  ["gb-to-tb", "data", "GB", "TB", "Gigabytes", "Terabytes", "GB", "TB"],
  ["tb-to-gb", "data", "TB", "GB", "Terabytes", "Gigabytes", "TB", "GB"],
  ["mb-to-kb", "data", "MB", "KB", "Megabytes", "Kilobytes", "MB", "KB"],

  ["kmh-to-mph", "speed", "km/h", "mph", "km/h", "mph", "km/h", "mph"],
  ["mph-to-kmh", "speed", "mph", "km/h", "mph", "km/h", "mph", "km/h"],
  ["ms-to-kmh", "speed", "m/s", "km/h", "m/s", "km/h", "m/s", "km/h"],
  ["knots-to-kmh", "speed", "knot", "km/h", "Knots", "km/h", "kn", "km/h"],

  ["liters-to-gallons", "volume", "L", "gal", "Liters", "Gallons", "L", "gal"],
  ["gallons-to-liters", "volume", "gal", "L", "Gallons", "Liters", "gal", "L"],
  ["ml-to-liters", "volume", "mL", "L", "Milliliters", "Liters", "mL", "L"],
  ["liters-to-ml", "volume", "L", "mL", "Liters", "Milliliters", "L", "mL"],
  ["cups-to-ml", "volume", "cup", "mL", "Cups", "Milliliters", "cup", "mL"],
  ["ml-to-cups", "volume", "mL", "cup", "Milliliters", "Cups", "mL", "cup"],

  ["sqm-to-sqft", "area", "m2", "ft2", "Square Meters", "Square Feet", "m²", "ft²"],
  ["sqft-to-sqm", "area", "ft2", "m2", "Square Feet", "Square Meters", "ft²", "m²"],
  ["acres-to-sqm", "area", "acre", "m2", "Acres", "Square Meters", "ac", "m²"],
  ["hectares-to-acres", "area", "ha", "acre", "Hectares", "Acres", "ha", "ac"],

  ["hours-to-minutes", "time", "h", "min", "Hours", "Minutes", "h", "min"],
  ["minutes-to-seconds", "time", "min", "s", "Minutes", "Seconds", "min", "s"],
  ["days-to-hours", "time", "day", "h", "Days", "Hours", "d", "h"],
  ["weeks-to-days", "time", "week", "day", "Weeks", "Days", "wk", "d"],
  ["years-to-days", "time", "year", "day", "Years", "Days", "yr", "d"],
];

export const PAIRS = P.map(([slug, dim, from, to, fromLabel, toLabel, fu, tu]) => ({ slug, dim, from, to, fromLabel, toLabel, fu, tu }));
export const conversionsBySlug = Object.fromEntries(PAIRS.map((p) => [p.slug, p]));
