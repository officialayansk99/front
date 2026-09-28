/**
 * Indicative quotes for the landing page. These are static illustrations, not
 * a price feed — every place that renders them says so. Live prices live in
 * MetaTrader 5.
 */
export type Quote = {
  symbol: string;
  name: string;
  bid: number;
  ask: number;
  /** Decimal places the instrument is quoted to. */
  digits: number;
  /** Size of one pip, used to express the spread in pips. */
  pip: number;
  change: number;
};

export type MarketKey = "forex" | "commodities" | "stocks" | "crypto";

export const markets: Record<
  MarketKey,
  { label: string; href: string; blurb: string; quotes: Quote[] }
> = {
  forex: {
    label: "Forex",
    href: "/forex",
    blurb:
      "Majors, minors and exotics with raw pricing from Tier-1 liquidity, around the clock five days a week.",
    quotes: [
      {
        symbol: "EUR/USD",
        name: "Euro / US Dollar",
        bid: 1.08418,
        ask: 1.0842,
        digits: 5,
        pip: 0.0001,
        change: 0.12,
      },
      {
        symbol: "GBP/USD",
        name: "Pound / US Dollar",
        bid: 1.26536,
        ask: 1.26541,
        digits: 5,
        pip: 0.0001,
        change: -0.08,
      },
      {
        symbol: "USD/JPY",
        name: "US Dollar / Yen",
        bid: 154.818,
        ask: 154.823,
        digits: 3,
        pip: 0.01,
        change: 0.24,
      },
      {
        symbol: "AUD/USD",
        name: "Aussie / US Dollar",
        bid: 0.64918,
        ask: 0.64924,
        digits: 5,
        pip: 0.0001,
        change: -0.15,
      },
      {
        symbol: "USD/CAD",
        name: "US Dollar / Loonie",
        bid: 1.36396,
        ask: 1.36403,
        digits: 5,
        pip: 0.0001,
        change: 0.09,
      },
      {
        symbol: "EUR/GBP",
        name: "Euro / Pound",
        bid: 0.85676,
        ask: 0.85683,
        digits: 5,
        pip: 0.0001,
        change: -0.04,
      },
    ],
  },
  commodities: {
    label: "Commodities",
    href: "/commodities",
    blurb:
      "Precious metals and energies — hedge inflation or trade the headlines with tight, transparent pricing.",
    quotes: [
      {
        symbol: "XAU/USD",
        name: "Gold",
        bid: 2384.42,
        ask: 2384.58,
        digits: 2,
        pip: 0.01,
        change: 0.67,
      },
      {
        symbol: "XAG/USD",
        name: "Silver",
        bid: 28.214,
        ask: 28.236,
        digits: 3,
        pip: 0.001,
        change: 0.41,
      },
      {
        symbol: "WTI",
        name: "US Crude Oil",
        bid: 78.62,
        ask: 78.65,
        digits: 2,
        pip: 0.01,
        change: -0.32,
      },
    ],
  },
  stocks: {
    label: "Stocks",
    href: "/stocks",
    blurb:
      "CFDs on the world's most-watched companies. Go long or short without owning the underlying share.",
    quotes: [
      {
        symbol: "AAPL",
        name: "Apple",
        bid: 189.84,
        ask: 189.88,
        digits: 2,
        pip: 0.01,
        change: 0.54,
      },
      {
        symbol: "NVDA",
        name: "NVIDIA",
        bid: 121.36,
        ask: 121.41,
        digits: 2,
        pip: 0.01,
        change: 1.83,
      },
      {
        symbol: "TSLA",
        name: "Tesla",
        bid: 176.12,
        ask: 176.2,
        digits: 2,
        pip: 0.01,
        change: -1.12,
      },
    ],
  },
  crypto: {
    label: "Crypto",
    href: "/cryptocurrencies",
    blurb:
      "Trade price moves in major digital assets on MT5 — no wallets or exchange accounts required.",
    quotes: [
      {
        symbol: "BTC/USD",
        name: "Bitcoin",
        bid: 68412,
        ask: 68428,
        digits: 0,
        pip: 1,
        change: 1.42,
      },
      {
        symbol: "ETH/USD",
        name: "Ethereum",
        bid: 3542.1,
        ask: 3543.6,
        digits: 1,
        pip: 0.1,
        change: 0.96,
      },
      {
        symbol: "SOL/USD",
        name: "Solana",
        bid: 162.35,
        ask: 162.61,
        digits: 2,
        pip: 0.01,
        change: -0.71,
      },
    ],
  },
};

/** The six instruments shown on the hero's market board. */
export const boardQuotes: Quote[] = [
  markets.forex.quotes[0],
  markets.forex.quotes[1],
  markets.forex.quotes[2],
  markets.commodities.quotes[0],
  markets.crypto.quotes[0],
  markets.stocks.quotes[1],
];

export const formatPrice = (value: number, digits: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const spreadInPips = (q: Quote) => ((q.ask - q.bid) / q.pip).toFixed(1);

/**
 * A deterministic little price path for the sparkline, seeded by the symbol so
 * it is stable across renders and ends in the direction of the day's change.
 */
export function sparkline(q: Quote, points = 24): number[] {
  let seed = [...q.symbol].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const drift = q.change / points;
  const out: number[] = [];
  let v = 0;
  for (let i = 0; i < points; i++) {
    v += drift + (rand() - 0.5) * Math.abs(q.change || 0.2) * 0.35;
    out.push(v);
  }
  return out;
}
