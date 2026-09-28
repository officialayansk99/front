import { GenericHero } from "./components/GenericHero";
import { Award, Gift, Star, ShieldCheck } from "lucide-react";

export default function Loyalty() {
  return (
    <div>
      <GenericHero
        title="Equiti Loyalty Program"
        subtitle="Rewarding our most dedicated traders with exclusive benefits and rebates."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            The More You Trade, The More You Earn
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            At Equiti Capitals, we value long-term partnerships. Our Loyalty
            Program is designed to reward your consistency and volume with
            tiered benefits that grow alongside your trading success.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-24">
          {[
            {
              tier: "Silver",
              volume: "0-50 Lots",
              rebate: "5% Rebate",
              color: "from-gray-400/20 to-gray-500/20",
              icon: Award,
            },
            {
              tier: "Gold",
              volume: "50-200 Lots",
              rebate: "10% Rebate",
              color: "from-primary/20 to-primary/70/20",
              icon: Star,
            },
            {
              tier: "Platinum",
              volume: "200-500 Lots",
              rebate: "15% Rebate",
              color: "from-primary/20 to-accent/20",
              icon: Gift,
            },
            {
              tier: "Diamond",
              volume: "500+ Lots",
              rebate: "25% Rebate",
              color: "from-primary/20 to-primary/70/20",
              icon: ShieldCheck,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card border border-border relative overflow-hidden group hover:border-primary/30 transition-all shadow-sm hover:shadow-xl"
            >
              <div
                className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${item.color}`}
              />
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-1 text-foreground">
                {item.tier}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {item.volume}
              </p>
              <div className="text-2xl font-black text-primary">
                {item.rebate}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-12 border border-border relative overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                How it works
              </h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shrink-0 text-primary-foreground">
                    1
                  </div>
                  <p className="text-muted-foreground">
                    Register for a live trading account and opt-in to the
                    Loyalty Program.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shrink-0 text-primary-foreground">
                    2
                  </div>
                  <p className="text-muted-foreground">
                    Trade your favorite instruments (Forex, Metals, Indices,
                    Crypto).
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shrink-0 text-primary-foreground">
                    3
                  </div>
                  <p className="text-muted-foreground">
                    Accumulate trading volume and automatically move up the
                    tiers.
                  </p>
                </li>
              </ul>
            </div>
            <div className="text-center p-8 bg-muted/50 rounded-2xl border border-border">
              <h4 className="text-xl font-bold mb-4 text-foreground">
                Start Climbing Tiers
              </h4>
              <p className="text-sm text-muted-foreground mb-8">
                All live account holders are eligible for Silver Tier
                immediately upon their first trade.
              </p>
              <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg transition-all">
                Join Program
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
