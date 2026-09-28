import { motion } from "framer-motion";
import {
  boardQuotes,
  formatPrice,
  sparkline,
  spreadInPips,
  type Quote,
} from "./marketData";

function Sparkline({ quote }: { quote: Quote }) {
  const data = sparkline(quote);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 100},${28 - ((v - min) / range) * 24}`,
    )
    .join(" ");
  const up = quote.change >= 0;

  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="w-full h-9"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        className={up ? "stroke-success" : "stroke-destructive"}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The hero's "market board": six instruments as quote cards, in place of the
 * platform mockup the sibling brands lead with. Prices are indicative.
 */
export default function MarketBoard() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {boardQuotes.map((q, i) => {
          const up = q.change >= 0;
          return (
            <motion.div
              key={q.symbol}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-3 sm:p-4 text-left shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground">
                    {q.symbol}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {q.name}
                  </p>
                </div>
                <span
                  className={`font-mono text-[11px] font-semibold tabular-nums ${up ? "text-success" : "text-destructive"}`}
                >
                  {up ? "+" : ""}
                  {q.change.toFixed(2)}%
                </span>
              </div>

              <Sparkline quote={q} />

              <div className="grid grid-cols-2 gap-1 sm:gap-1.5 font-mono tabular-nums">
                <div className="rounded-md bg-muted px-1.5 sm:px-2 py-1.5">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    Bid
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-foreground">
                    {formatPrice(q.bid, q.digits)}
                  </p>
                </div>
                <div className="rounded-md bg-muted px-1.5 sm:px-2 py-1.5">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    Ask
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-foreground">
                    {formatPrice(q.ask, q.digits)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Spread{" "}
                <span className="font-mono font-semibold text-gold-ink tabular-nums">
                  {spreadInPips(q)}
                </span>
              </p>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Indicative prices for illustration only. Live, tradable quotes are
        available in MetaTrader 5.
      </p>
    </div>
  );
}
