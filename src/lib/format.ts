export const CURRENCIES = [
  { code: "BDT", symbol: "৳", label: "Bangladeshi Taka" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "PKR", symbol: "Rs", label: "Pakistani Rupee" },
  { code: "LKR", symbol: "Rs", label: "Sri Lankan Rupee" },
  { code: "NPR", symbol: "Rs", label: "Nepalese Rupee" },
  { code: "AED", symbol: "AED", label: "UAE Dirham" },
  { code: "SAR", symbol: "SAR", label: "Saudi Riyal" },
  { code: "MYR", symbol: "RM", label: "Malaysian Ringgit" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
] as const;

export const isCurrency = (c: string) => CURRENCIES.some((x) => x.code === c);

export function formatPrice(price: number | null | undefined, currency: string) {
  if (price == null || Number.isNaN(price)) return "";
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;
  const n = Number.isInteger(price)
    ? price.toLocaleString("en-US")
    : price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return symbol.length > 1 && /^[A-Z]+$/.test(symbol) ? `${symbol} ${n}` : `${symbol}${n}`;
}

/** Accepts "@name", "name" or a full profile link and returns just the handle. */
export function handleOf(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.|m\.)?[^/]+\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
}

export const digitsOf = (value: string) => value.replace(/[^\d]/g, "");
