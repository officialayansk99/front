import { GenericHero } from "./components/GenericHero";
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Clock,
  MessageSquare,
  Mail,
} from "lucide-react";

export default function FundingGuides({
  type,
}: {
  type: "deposit" | "withdraw";
}) {
  const isDeposit = type === "deposit";

  const steps = isDeposit
    ? [
        {
          title: "Log in to Dashboard",
          desc: "Access your secure Equiti Capitals client portal using your credentials.",
        },
        {
          title: "Select Deposit",
          desc: "Navigate to the 'Funds' section and choose your preferred payment method.",
        },
        {
          title: "Confirm Amount",
          desc: "Enter the amount you wish to fund and follow the on-screen instructions.",
        },
        {
          title: "Start Trading",
          desc: "Funds are typically credited instantly or within 24 hours depending on the method.",
        },
      ]
    : [
        {
          title: "Request Withdrawal",
          desc: "Go to the 'Funds' section in your dashboard and select 'Withdrawal'.",
        },
        {
          title: "Choose Method",
          desc: "Select the same method used for your deposit to ensure smooth processing.",
        },
        {
          title: "Verification",
          desc: "Ensure your account is fully KYC verified to avoid processing delays.",
        },
        {
          title: "Receive Funds",
          desc: "Withdrawals are processed by our finance team within 24 business hours.",
        },
      ];

  const methods = [
    {
      name: "Bank Wire",
      time: "1-3 Business Days",
      fee: "Zero Fees",
      icon: Banknote,
    },
    {
      name: "Credit/Debit Card",
      time: "Instant",
      fee: "Zero Fees",
      icon: CreditCard,
    },
    {
      name: "Cryptocurrency",
      time: "Instant (Network dependent)",
      fee: "Network Fees only",
      icon: ShieldCheck,
    },
  ];

  return (
    <div>
      <GenericHero
        title={isDeposit ? "How to Deposit" : "How to Withdraw"}
        subtitle={
          isDeposit
            ? "Fast and secure ways to fund your trading account."
            : "Simple and transparent process to access your profits."
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Steps Grid */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            The 4-Step Process
          </h2>
          <p className="text-muted-foreground">
            Follow these simple steps to manage your funds.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-24">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground mb-6 relative z-10">
                {idx + 1}
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-6 left-12 w-full h-[2px] bg-card/60 z-0" />
              )}
              <h3 className="font-bold text-lg mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Methods Table */}
        <div className="glass-strong rounded-3xl border border-border/40 overflow-hidden">
          <div className="p-8 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-bold text-xl text-foreground">
              Supported Payment Methods
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={14} /> 24/5 Finance Support
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-card/60 text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="px-8 py-4">Method</th>
                  <th className="px-8 py-4">Processing Time</th>
                  <th className="px-8 py-4">Equiti Capitals Fees</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {methods.map((method, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-card/60 flex items-center justify-center text-primary/80">
                          <method.icon size={20} />
                        </div>
                        <span className="font-bold text-foreground">
                          {method.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      {method.time}
                    </td>
                    <td className="px-8 py-6 text-primary font-bold">
                      {method.fee}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-primary text-xs font-bold transition-all">
                        {isDeposit ? "Deposit Now" : "Withdraw Now"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-24 text-center p-12 rounded-3xl bg-gradient-to-tr from-primary/10 to-transparent border border-primary/20">
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            Need assistance with your {type}?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our finance department is available to help you with any questions
            regarding transfers, limits, or verification.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold">
              <MessageSquare size={18} className="text-primary/80" /> Live
              Support
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold">
              <Mail size={18} className="text-primary/80" /> Email Finance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
