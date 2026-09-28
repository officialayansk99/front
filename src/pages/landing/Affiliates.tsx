import { GenericHero } from "./components/GenericHero";
import { Link } from "react-router-dom";
import { Megaphone, Target, TrendingUp } from "lucide-react";

export default function Affiliates() {
  return (
    <div>
      <GenericHero
        title="Affiliate Program"
        subtitle="Monetize your traffic and earn high commissions by partnering with a global leader."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Join Our Growing Network
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Whether you are a blogger, social media influencer, or a digital
            marketer, the Equiti Capitals Affiliate Program offers you the tools
            and high-conversion assets needed to generate significant revenue.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: Megaphone,
              title: "Marketing Material",
              desc: "Access a library of banners, landing pages, and email templates optimized for conversion.",
            },
            {
              icon: Target,
              title: "CPA & Revenue Share",
              desc: "Choose a commission structure that fits your business model—either CPA or Revenue Share.",
            },
            {
              icon: TrendingUp,
              title: "High Conversion",
              desc: "Partner with a brand that traders trust, leading to higher conversion rates and lifetime value.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-10 rounded-3xl bg-card/80 border border-border/30 hover:border-primary/50 transition-all text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-card/60 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <item.icon size={36} className="text-primary/80" />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-12 border border-border/40 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px]" />
          <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10">
            Start Earning Today
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 relative z-10">
            Registration is free and takes less than 2 minutes. Our affiliate
            managers are ready to help you scale your operations.
          </p>
          <Link
            to="/login"
            className="inline-block px-12 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/70 text-primary-foreground font-bold hover:shadow-xl hover:shadow-primary/35 transition-all relative z-10 uppercase tracking-widest text-sm"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
