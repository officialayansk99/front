import { GenericHero } from "./components/GenericHero";
import { CheckCircle, TrendingUp, Globe, Shield } from "lucide-react";

export default function Forex() {
  return (
    <div>
      <GenericHero
        title="Forex Trading"
        subtitle="Trade the world's most liquid market with RAW spreads starting from 0.0 pips."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Why Trade Forex with Equiti Capitals?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The foreign exchange market is the largest and most liquid
              financial market in the world. With Equiti Capitals, you gain direct
              access to Tier-1 liquidity providers, ensuring ultra-fast
              execution and razor-thin spreads across major, minor, and exotic
              currency pairs.
            </p>
            <ul className="space-y-4">
              {[
                "RAW Spreads from 0.0 Pips",
                "Leverage up to 1:2000",
                "Deep Liquidity & No Requotes",
                "Over 60+ Currency Pairs",
                "24/5 Dedicated Market Support",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <CheckCircle className="text-primary/80" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 glass-strong rounded-3xl border border-border/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px]" />
            <div className="space-y-6 relative z-10">
              {[
                { pair: "EUR/USD", spread: "0.1" },
                { pair: "GBP/USD", spread: "0.2" },
                { pair: "USD/JPY", spread: "0.2" },
                { pair: "AUD/USD", spread: "0.3" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-card/60 border border-border/30 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-sm">
                      FX
                    </div>
                    <span className="font-bold text-lg">{item.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Typical Spread
                    </div>
                    <div className="font-bold text-primary">
                      {item.spread} pips
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Global Market Access",
              icon: Globe,
              desc: "Trade global forex markets seamlessly from a single unified platform.",
            },
            {
              title: "Advanced Analysis",
              icon: TrendingUp,
              desc: "Utilize advanced charting tools and indicators to analyze market trends.",
            },
            {
              title: "Secure Execution",
              icon: Shield,
              desc: "Your trades are executed securely with top-tier encryption and stability.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card/80 border border-border/30 hover:border-white/20 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/80/20 flex items-center justify-center mb-6">
                <feature.icon size={28} className="text-primary/80" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
