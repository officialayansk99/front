import { GenericHero } from "./components/GenericHero";
import { Server, Activity, Lock, Globe } from "lucide-react";

export default function VPS() {
  return (
    <div>
      <GenericHero
        title="VPS Hosting"
        subtitle="Ultra-low latency Virtual Private Servers for automated and algorithmic trading."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Never Miss a Trade
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Our VPS hosting solutions ensure your Expert Advisors (EAs) and
            algorithmic trading scripts run 24/7 without interruption,
            regardless of your personal computer or internet connection status.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-24">
          {[
            {
              icon: Activity,
              title: "Ultra-Low Latency",
              desc: "Servers located adjacent to major liquidity providers for microsecond execution.",
            },
            {
              icon: Server,
              title: "99.99% Uptime",
              desc: "Enterprise-grade infrastructure ensures your trading never stops.",
            },
            {
              icon: Lock,
              title: "Maximum Security",
              desc: "DDoS protection and robust firewalls keep your trading environment secure.",
            },
            {
              icon: Globe,
              title: "Global Locations",
              desc: "Choose a server location closest to your preferred trading hub.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card/80 border border-border/30"
            >
              <div className="w-12 h-12 rounded-xl bg-card/60 flex items-center justify-center mb-6">
                <item.icon size={24} className="text-primary/80" />
              </div>
              <h3 className="font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-12 text-center border border-border/40 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] z-0" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Get Your Free VPS Today
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Equiti Capitals offers a complimentary VPS to clients who maintain a
              minimum account balance and meet our monthly trading volume
              requirements. Contact support to claim yours.
            </p>
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
              Request VPS Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
