import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatPrice,
  markets,
  spreadInPips,
  type MarketKey,
} from "./marketData";

/** Asset classes as tabs, each with an indicative pricing table. */
export default function MarketsTabs() {
  const keys = Object.keys(markets) as MarketKey[];

  return (
    <Tabs defaultValue="forex" className="w-full">
      <TabsList className="h-auto w-full sm:w-auto flex-wrap justify-start gap-1 bg-muted p-1">
        {keys.map((k) => (
          <TabsTrigger
            key={k}
            value={k}
            className="px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {markets[k].label}
          </TabsTrigger>
        ))}
      </TabsList>

      {keys.map((k) => {
        const m = markets[k];
        return (
          <TabsContent key={k} value={k} className="mt-6">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
              <div>
                <h3 className="font-display text-3xl font-semibold text-foreground mb-3">
                  {m.label}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {m.blurb}
                </p>
                <Link
                  to={m.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gold-ink hover:underline"
                >
                  Explore {m.label.toLowerCase()} <ArrowRight size={16} />
                </Link>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <caption className="sr-only">
                    Indicative {m.label} prices
                  </caption>
                  <thead>
                    <tr className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      <th scope="col" className="p-4 text-left font-semibold">
                        Instrument
                      </th>
                      <th scope="col" className="p-4 text-right font-semibold">
                        Bid
                      </th>
                      <th scope="col" className="p-4 text-right font-semibold">
                        Ask
                      </th>
                      <th scope="col" className="p-4 text-right font-semibold">
                        Spread
                      </th>
                      <th scope="col" className="p-4 text-right font-semibold">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-mono tabular-nums">
                    {m.quotes.map((q) => (
                      <tr key={q.symbol} className="border-t border-border">
                        <th scope="row" className="p-4 text-left font-sans">
                          <span className="block font-semibold text-foreground">
                            {q.symbol}
                          </span>
                          <span className="block text-xs font-normal text-muted-foreground">
                            {q.name}
                          </span>
                        </th>
                        <td className="p-4 text-right text-foreground">
                          {formatPrice(q.bid, q.digits)}
                        </td>
                        <td className="p-4 text-right text-foreground">
                          {formatPrice(q.ask, q.digits)}
                        </td>
                        <td className="p-4 text-right text-gold-ink font-semibold">
                          {spreadInPips(q)}
                        </td>
                        <td
                          className={`p-4 text-right font-semibold ${q.change >= 0 ? "text-success" : "text-destructive"}`}
                        >
                          {q.change >= 0 ? "+" : ""}
                          {q.change.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
