import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, Wallet, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    desc: "Sign up with your email and set a secure password",
  },
  {
    icon: ShieldCheck,
    title: "Complete KYC",
    desc: "Upload your identification and address proof documents",
  },
  {
    icon: Wallet,
    title: "Fund Account",
    desc: "Deposit funds using bank transfer, crypto, or card",
  },
  {
    icon: TrendingUp,
    title: "Start Trading",
    desc: "Access MT5, open positions, and start earning",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

export default function Instructions() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl w-full min-w-0"
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Getting Started
        </h1>
        <p className="text-muted-foreground mt-1">
          Follow these steps to start trading
        </p>
      </div>

      <div className="space-y-0">
        {steps.map((step, i) => (
          <motion.div key={step.title} variants={item} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0 glow-primary">
                <step.icon size={18} className="text-primary-foreground" />
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 flex-1 bg-border/50 my-2" />
              )}
            </div>
            {/* Content */}
            <div className="glass rounded-xl p-5 mb-4 flex-1">
              <h3 className="font-semibold text-foreground">
                Step {i + 1}: {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
