import { GenericHero } from "./components/GenericHero";
import { CheckCircle, Coins, Zap, ShieldCheck } from "lucide-react";

export default function Cryptocurrencies() {
  return (
    <div>
      <GenericHero
        title="Cryptocurrency Trading"
        subtitle="Trade the future of finance with Bitcoin, Ethereum, and other major digital assets."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Why Trade Crypto with Equiti Capitals?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Digital currencies are revolutionizing the financial landscape.
              Equiti Capitals provides a secure and institutional-grade platform
              to trade the most popular cryptocurrencies with high leverage and
              tight spreads.
            </p>
            <ul className="space-y-4">
              {[
                "Trade BTC, ETH, XRP, LTC, and more",
                "Leverage up to 1:100 on digital assets",
                "Deep liquidity from top-tier exchanges",
                "No digital wallet required",
                "Trade 24/7 on the global crypto market",
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
          </div>
          <div className="p-8 glass-strong rounded-3xl border border-border/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 blur-[80px]" />
            <div className="space-y-6 relative z-10">
              {[
                {
                  name: "Bitcoin (BTC)",
                  symbol: "BTC/USD",
                  price: "Live",
                  color: "from-primary to-primary/70",
                },
                {
                  name: "Ethereum (ETH)",
                  symbol: "ETH/USD",
                  price: "Live",
                  color: "from-primary to-primary/70",
                },
                {
                  name: "Ripple (XRP)",
                  symbol: "XRP/USD",
                  price: "Live",
                  color: "from-accent to-primary/80",
                },
                {
                  name: "Litecoin (LTC)",
                  symbol: "LTC/USD",
                  price: "Live",
                  color: "from-muted to-muted",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-card/60 border border-border/30 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center font-bold text-xs text-foreground`}
                    >
                      {item.name.split(" ")[0][0]}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Institutional Grade",
              icon: ShieldCheck,
              desc: "Trade on a platform built for professionals with maximum security.",
            },
            {
              title: "Fast Execution",
              icon: Zap,
              desc: "Execute crypto trades in milliseconds with our advanced order matching engine.",
            },
            {
              title: "Diverse Assets",
              icon: Coins,
              desc: "Access a wide range of digital currencies from a single account.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card/80 border border-border/30 hover:border-white/20 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/20 flex items-center justify-center mb-6">
                <feature.icon size={28} className="text-primary" />
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
