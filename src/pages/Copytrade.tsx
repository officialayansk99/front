import { motion } from "framer-motion";
import { copytraders } from "@/data/mock";
import { TrendingUp, BarChart3, DollarSign, Percent } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Copytrade() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Copy Trade</h1>
        <p className="text-muted-foreground mt-1">
          Follow top traders and mirror their strategies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {copytraders.map((trader) => (
          <motion.div
            key={trader.name}
            variants={item}
            className="glass rounded-xl p-6 space-y-4 hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                {trader.avatar}
              </div>
              <div>
                <p className="font-semibold text-foreground">{trader.name}</p>
                <p className="text-xs text-muted-foreground">
                  Professional Trader
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Win Rate",
                  value: `${trader.winRate}%`,
                  icon: Percent,
                  color: "text-success",
                },
                {
                  label: "Trades",
                  value: trader.totalTrades.toLocaleString(),
                  icon: BarChart3,
                  color: "text-primary",
                },
                {
                  label: "Commission",
                  value: `${trader.commission}%`,
                  icon: DollarSign,
                  color: "text-warning",
                },
                {
                  label: "Profit",
                  value: `$${trader.profit.toLocaleString()}`,
                  icon: TrendingUp,
                  color: "text-success",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-secondary/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon size={12} className={stat.color} />
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Follow Trader
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
