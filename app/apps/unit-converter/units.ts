/**
 * Unit tables for the converter.
 *
 * Every category converts through a single base unit: `value × factor` gives
 * the base amount, `base ÷ factor` gives the target. Temperature is the one
 * exception — it needs an offset as well as a scale, so it carries explicit
 * `toBase`/`fromBase` functions instead of a factor.
 */

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  /** Base units in one of this unit. Ignored when `toBase` is present. */
  factor: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
}

export interface UnitCategory {
  id: string;
  name: string;
  /** Sensible starting pair so the tool is useful before any input. */
  defaults: [string, string];
  units: Unit[];
}

const unit = (
  id: string,
  name: string,
  symbol: string,
  factor: number
): Unit => ({ id, name, symbol, factor });

export const unitCategories: UnitCategory[] = [
  {
    id: "length",
    name: "Length",
    defaults: ["m", "ft"],
    units: [
      unit("nm", "Nanometre", "nm", 1e-9),
      unit("um", "Micrometre", "µm", 1e-6),
      unit("mm", "Millimetre", "mm", 0.001),
      unit("cm", "Centimetre", "cm", 0.01),
      unit("m", "Metre", "m", 1),
      unit("km", "Kilometre", "km", 1000),
      unit("in", "Inch", "in", 0.0254),
      unit("ft", "Foot", "ft", 0.3048),
      unit("yd", "Yard", "yd", 0.9144),
      unit("mi", "Mile", "mi", 1609.344),
      unit("nmi", "Nautical mile", "nmi", 1852),
      unit("ly", "Light year", "ly", 9.4607304725808e15),
    ],
  },
  {
    id: "mass",
    name: "Mass",
    defaults: ["kg", "lb"],
    units: [
      unit("mcg", "Microgram", "µg", 1e-9),
      unit("mg", "Milligram", "mg", 1e-6),
      unit("g", "Gram", "g", 0.001),
      unit("kg", "Kilogram", "kg", 1),
      unit("t", "Tonne", "t", 1000),
      unit("oz", "Ounce", "oz", 0.028349523125),
      unit("lb", "Pound", "lb", 0.45359237),
      unit("st", "Stone", "st", 6.35029318),
      unit("ton-us", "US ton", "ton", 907.18474),
      unit("ton-uk", "Imperial ton", "long ton", 1016.0469088),
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    defaults: ["c", "f"],
    units: [
      {
        id: "c",
        name: "Celsius",
        symbol: "°C",
        factor: 1,
        toBase: (value) => value,
        fromBase: (value) => value,
      },
      {
        id: "f",
        name: "Fahrenheit",
        symbol: "°F",
        factor: 1,
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => (value * 9) / 5 + 32,
      },
      {
        id: "k",
        name: "Kelvin",
        symbol: "K",
        factor: 1,
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
      {
        id: "r",
        name: "Rankine",
        symbol: "°R",
        factor: 1,
        toBase: (value) => ((value - 491.67) * 5) / 9,
        fromBase: (value) => (value + 273.15) * 1.8,
      },
    ],
  },
  {
    id: "area",
    name: "Area",
    defaults: ["m2", "ft2"],
    units: [
      unit("mm2", "Square millimetre", "mm²", 1e-6),
      unit("cm2", "Square centimetre", "cm²", 1e-4),
      unit("m2", "Square metre", "m²", 1),
      unit("ha", "Hectare", "ha", 10_000),
      unit("km2", "Square kilometre", "km²", 1e6),
      unit("in2", "Square inch", "in²", 0.00064516),
      unit("ft2", "Square foot", "ft²", 0.09290304),
      unit("yd2", "Square yard", "yd²", 0.83612736),
      unit("acre", "Acre", "ac", 4046.8564224),
      unit("mi2", "Square mile", "mi²", 2_589_988.110336),
    ],
  },
  {
    id: "volume",
    name: "Volume",
    defaults: ["l", "gal-us"],
    units: [
      unit("ml", "Millilitre", "ml", 0.001),
      unit("l", "Litre", "l", 1),
      unit("m3", "Cubic metre", "m³", 1000),
      unit("tsp", "Teaspoon (US)", "tsp", 0.00492892159375),
      unit("tbsp", "Tablespoon (US)", "tbsp", 0.01478676478125),
      unit("floz-us", "Fluid ounce (US)", "fl oz", 0.0295735295625),
      unit("cup", "Cup (US)", "cup", 0.2365882365),
      unit("pt-us", "Pint (US)", "pt", 0.473176473),
      unit("qt-us", "Quart (US)", "qt", 0.946352946),
      unit("gal-us", "Gallon (US)", "gal", 3.785411784),
      unit("floz-uk", "Fluid ounce (UK)", "fl oz", 0.0284130625),
      unit("pt-uk", "Pint (UK)", "pt", 0.56826125),
      unit("gal-uk", "Gallon (UK)", "gal", 4.54609),
    ],
  },
  {
    id: "speed",
    name: "Speed",
    defaults: ["kmh", "mph"],
    units: [
      unit("ms", "Metre per second", "m/s", 1),
      unit("kmh", "Kilometre per hour", "km/h", 1 / 3.6),
      unit("mph", "Mile per hour", "mph", 0.44704),
      unit("fts", "Foot per second", "ft/s", 0.3048),
      unit("kn", "Knot", "kn", 0.514444444444),
      unit("mach", "Mach (sea level)", "M", 340.29),
    ],
  },
  {
    id: "data",
    name: "Data",
    defaults: ["mb", "mib"],
    units: [
      unit("b", "Bit", "b", 1 / 8),
      unit("byte", "Byte", "B", 1),
      unit("kb", "Kilobyte (1000)", "kB", 1e3),
      unit("mb", "Megabyte (1000)", "MB", 1e6),
      unit("gb", "Gigabyte (1000)", "GB", 1e9),
      unit("tb", "Terabyte (1000)", "TB", 1e12),
      unit("kib", "Kibibyte (1024)", "KiB", 1024),
      unit("mib", "Mebibyte (1024)", "MiB", 1024 ** 2),
      unit("gib", "Gibibyte (1024)", "GiB", 1024 ** 3),
      unit("tib", "Tebibyte (1024)", "TiB", 1024 ** 4),
    ],
  },
  {
    id: "time",
    name: "Time",
    defaults: ["min", "s"],
    units: [
      unit("ms", "Millisecond", "ms", 0.001),
      unit("s", "Second", "s", 1),
      unit("min", "Minute", "min", 60),
      unit("h", "Hour", "h", 3600),
      unit("d", "Day", "d", 86_400),
      unit("wk", "Week", "wk", 604_800),
      unit("mo", "Month (30 days)", "mo", 2_592_000),
      unit("yr", "Year (365 days)", "yr", 31_536_000),
    ],
  },
  {
    id: "pressure",
    name: "Pressure",
    defaults: ["bar", "psi"],
    units: [
      unit("pa", "Pascal", "Pa", 1),
      unit("kpa", "Kilopascal", "kPa", 1000),
      unit("bar", "Bar", "bar", 100_000),
      unit("psi", "Pound per square inch", "psi", 6894.757293168),
      unit("atm", "Atmosphere", "atm", 101_325),
      unit("torr", "Torr", "Torr", 133.322368421),
      unit("mmhg", "Millimetre of mercury", "mmHg", 133.322387415),
    ],
  },
  {
    id: "energy",
    name: "Energy",
    defaults: ["kcal", "kj"],
    units: [
      unit("j", "Joule", "J", 1),
      unit("kj", "Kilojoule", "kJ", 1000),
      unit("cal", "Calorie", "cal", 4.184),
      unit("kcal", "Kilocalorie", "kcal", 4184),
      unit("wh", "Watt hour", "Wh", 3600),
      unit("kwh", "Kilowatt hour", "kWh", 3_600_000),
      unit("btu", "British thermal unit", "BTU", 1055.05585262),
      unit("ftlb", "Foot-pound", "ft·lb", 1.3558179483314),
    ],
  },
];

export function getCategory(id: string): UnitCategory {
  return unitCategories.find((c) => c.id === id) ?? unitCategories[0]!;
}

export function getUnit(category: UnitCategory, id: string): Unit {
  return category.units.find((u) => u.id === id) ?? category.units[0]!;
}

export function convert(value: number, from: Unit, to: Unit): number {
  const base = from.toBase ? from.toBase(value) : value * from.factor;
  return to.fromBase ? to.fromBase(base) : base / to.factor;
}

/**
 * Readable output across fifteen orders of magnitude: exponent notation only
 * where a decimal string would be unreadable, and trailing zeros stripped so
 * exact conversions don't look approximate.
 */
export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  if (magnitude >= 1e15 || magnitude < 1e-9) {
    return value.toExponential(6).replace(/\.?0+e/, "e");
  }

  // 10 significant digits is comfortably inside double precision while still
  // showing the full exact value for everyday conversions.
  const digits = Math.max(0, 10 - Math.floor(Math.log10(magnitude)) - 1);
  return Number(value.toFixed(Math.min(digits, 12)))
    .toLocaleString(undefined, { maximumFractionDigits: 12 })
    .toString();
}
