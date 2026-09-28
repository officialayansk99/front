import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Cpu,
  Zap,
  BarChart3,
  Globe,
  Download,
  ShieldCheck,
} from "lucide-react";
import { GenericHero } from "./components/GenericHero";

export default function Platform() {
  return (
    <div className="bg-background">
      <GenericHero
        title="Institutional Platforms"
        subtitle="Harness the power of MetaTrader 5, the world's most advanced multi-asset platform for trading Forex and CFDs."
      />

      {/* Main MT5 Feature Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-[10px] mb-6">
              <Cpu size={14} /> Next-Gen Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-foreground leading-tight">
              MetaTrader 5: <br />
              The Professional's Choice
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Successor to the legendary MT4, MetaTrader 5 provides an even more
              powerful environment for technical analysis and automated trading.
              Equiti Capitals's bridge technology connects you directly to deep
              liquidity pools for unrivaled execution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  icon: <Zap size={20} />,
                  title: "Ultra-Fast Execution",
                  desc: "Order processing under 30ms with no requotes.",
                },
                {
                  icon: <BarChart3 size={20} />,
                  title: "38+ Indicators",
                  desc: "Comprehensive library for technical analysis.",
                },
                {
                  icon: <Globe size={20} />,
                  title: "Multi-Asset",
                  desc: "Trade Forex, Gold, Stocks, and Crypto on one platform.",
                },
                {
                  icon: <Monitor size={20} />,
                  title: "Depth of Market",
                  desc: "Full transparency with Level II pricing.",
                },
              ].map((feat, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{feat.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative p-1 bg-gradient-to-br from-primary/30 to-transparent rounded-[2.5rem] shadow-2xl">
              <div className="bg-slate-950 rounded-[2.3rem] overflow-hidden aspect-[4/3] flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <img
                  src="/mt5-logo.png"
                  alt="MT5 Logo"
                  className="w-48 relative z-10 drop-shadow-[0_0_30px_rgba(45,125,246,0.3)] group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay details */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                  <div className="glass-dark px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold text-white tracking-widest uppercase">
                    v5.0.4200
                  </div>
                  <ShieldCheck className="text-primary w-8 h-8" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Availability Section */}
        <div className="pt-24 border-t border-border/50">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">
              Available on all devices
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download and start trading in minutes. Your Equiti Capitals account
              works seamlessly across all MetaTrader 5 versions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                device: "Desktop",
                os: "Windows / macOS",
                icon: <Monitor size={32} />,
                features: [
                  "Expert Advisors (EAs)",
                  "One-click Trading",
                  "Custom Indicators",
                ],
                primary: true,
                link: "https://www.metatrader5.com/en/download",
              },
              {
                device: "Mobile",
                os: "iOS / Android",
                icon: <Smartphone size={32} />,
                features: [
                  "Real-time Quotes",
                  "Push Notifications",
                  "Full Account History",
                ],
                primary: false,
                link: "https://www.metatrader5.com/en/download",
              },
              {
                device: "Web",
                os: "Any Browser",
                icon: <Globe size={32} />,
                features: [
                  "No Download Required",
                  "Secure Login",
                  "Basic Charting Tools",
                ],
                primary: false,
                link: "https://www.metatrader5.com/en/download",
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2rem] border transition-all duration-300 ${p.primary ? "bg-card border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/20" : "bg-card/50 border-border hover:border-primary/30"}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${p.primary ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-primary"}`}
                >
                  {p.icon}
                </div>
                <h4 className="text-2xl font-bold mb-1">{p.device}</h4>
                <p className="text-xs text-primary font-bold tracking-widest uppercase mb-6">
                  {p.os}
                </p>

                <ul className="space-y-3 mb-10">
                  {p.features.map((f, j) => (
                    <li
                      key={j}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${p.primary ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" : "border border-border hover:bg-muted"}`}
                >
                  <Download size={18} />{" "}
                  {p.device === "Web" ? "Open Web Terminal" : "Download Now"}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
