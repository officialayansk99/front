import { GenericHero } from "./components/GenericHero";

export default function Legal({
  type,
}: {
  type: "privacy" | "terms" | "risk" | "conditions";
}) {
  const content = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "How we collect, use, and protect your personal information.",
      sections: [
        {
          h: "1. Data Collection",
          p: "We collect personal data you provide directly to us when you create an account, including your name, email, and financial information for KYC purposes.",
        },
        {
          h: "2. Data Usage",
          p: "Your data is used to provide, maintain, and improve our services, process transactions, and communicate with you regarding your account.",
        },
        {
          h: "3. Security Measures",
          p: "We implement industry-standard encryption and security protocols to ensure your data remains confidential and protected from unauthorized access.",
        },
      ],
    },
    terms: {
      title: "Terms & Conditions",
      subtitle: "The legal agreement between you and Equiti Capitals.",
      sections: [
        {
          h: "1. Acceptance of Terms",
          p: "By accessing our platform, you agree to comply with these terms and all applicable laws and regulations.",
        },
        {
          h: "2. Trading Eligibility",
          p: "Users must be at least 18 years old and reside in a jurisdiction where our services are permitted by law.",
        },
        {
          h: "3. Account Responsibility",
          p: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        },
      ],
    },
    risk: {
      title: "Risk Warnings",
      subtitle:
        "Important disclosures regarding the risks of financial trading.",
      sections: [
        {
          h: "1. High Risk Investment",
          p: "Trading Forex and CFDs on margin carries a high level of risk and may not be suitable for all investors.",
        },
        {
          h: "2. Leverage Risk",
          p: "High leverage can work against you as well as for you. The possibility exists that you could sustain a loss of some or all of your initial investment.",
        },
        {
          h: "3. Market Volatility",
          p: "Financial markets are subject to rapid and unpredictable price movements, which can be influenced by global events, news, and economic data.",
        },
      ],
    },
    conditions: {
      title: "Trading Conditions",
      subtitle: "Detailed information on our execution, leverage, and margins.",
      sections: [
        {
          h: "1. Execution Policy",
          p: "We aim to provide the fastest execution with minimal slippage using our high-performance liquidity bridge.",
        },
        {
          h: "2. Margin Requirements",
          p: "Margin requirements vary by instrument and account type. Please refer to your MT4/MT5 platform for real-time margin data.",
        },
        {
          h: "3. Negative Balance Protection",
          p: "Equiti Capitals provides negative balance protection to retail clients, ensuring you never lose more than your total account balance.",
        },
      ],
    },
  };

  const active = content[type];

  return (
    <div>
      <GenericHero title={active.title} subtitle={active.subtitle} />
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="space-y-12">
          {active.sections.map((section, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card/60 border border-border/30"
            >
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {section.h}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {section.p}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-16 p-8 bg-primary/10 rounded-2xl border border-primary/20 text-center text-sm text-muted-foreground">
          This document was last updated on April 21, 2024. If you have any
          questions regarding these terms, please contact our legal department
          at legal@equiticapitals.com.
        </div>
      </div>
    </div>
  );
}
