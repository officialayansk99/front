import { GenericHero } from "./components/GenericHero";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Commodities() {
  return (
    <div>
      <GenericHero
        title="Commodities Trading"
        subtitle="Diversify your portfolio with Gold, Silver, Oil, and other major commodities."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1 p-8 glass-strong rounded-3xl border border-border/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/15 blur-[80px]" />
            <div className="space-y-6 relative z-10">
              {[
                { name: "Gold (XAU/USD)", desc: "Safe Haven Asset" },
                { name: "Silver (XAG/USD)", desc: "Precious Metal" },
                { name: "US Oil (WTI)", desc: "Energy Commodity" },
                { name: "UK Oil (Brent)", desc: "Energy Commodity" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-card/60 border border-border/30 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center font-bold text-sm">
                      CMD
                    </div>
                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Hedge Against Inflation
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Commodities are a vital component of any well-diversified trading
              portfolio. Equiti Capitals offers competitive pricing on precious
              metals and energies, allowing you to speculate on global supply
              and demand dynamics without taking physical delivery.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Trade Gold with unmatched tight spreads",
                "No hidden fees or commissions",
                "High liquidity on major metals and energies",
                "Protect your portfolio from currency devaluation",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <CheckCircle className="text-primary" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/login"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/70 text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Trade Commodities Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
