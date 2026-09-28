import { motion } from "framer-motion";
import { referrals } from "@/data/mock";
import { cn } from "@/lib/utils";

const levels = ["Standard", "Silver", "Gold", "Platinum"];

export default function ReferEarn() {
  const currentLevel = 1; // Silver

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full min-w-0"
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Refer & Earn
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your referral network and commissions
        </p>
      </div>

      {/* Progress */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Commission Level</h3>
        <div className="flex items-center gap-2 min-w-0 overflow-x-auto pb-1 scrollbar-hide">
          {levels.map((l, i) => (
            <div key={l} className="flex-1 min-w-[4.5rem] shrink-0">
              <div
                className={cn(
                  "h-2 rounded-full",
                  i <= currentLevel ? "gradient-primary" : "bg-secondary",
                )}
              />
              <p
                className={cn(
                  "text-xs mt-2 text-center",
                  i <= currentLevel
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}
              >
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Referrals table */}
      <div className="glass rounded-xl overflow-x-auto min-w-0">
        <table className="w-full text-sm min-w-[36rem]">
          <thead>
            <tr className="border-b border-border/30 text-muted-foreground text-xs">
              {["Name", "Mobile", "Email", "Level"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referrals.map((r, i) => (
              <tr
                key={i}
                className="border-b border-border/10 hover:bg-secondary/20 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {r.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.mobile}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full border font-medium",
                      r.level === "Gold"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : r.level === "Silver"
                          ? "bg-muted text-foreground border-border"
                          : "bg-secondary text-muted-foreground border-border",
                    )}
                  >
                    {r.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
