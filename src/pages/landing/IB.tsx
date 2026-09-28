import { GenericHero } from "./components/GenericHero";
import { Link } from "react-router-dom";
import { Users, DollarSign, BarChart3 } from "lucide-react";

export default function IB() {
  return (
    <div>
      <GenericHero
        title="Introducing Brokers (IB)"
        subtitle="Partner with Equiti Capitals and earn lucrative commissions for every client you refer."
      />
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-12 text-foreground">
          Why Become an Equiti Capitals IB?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-card/80 border border-border/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/80/20 flex items-center justify-center mx-auto mb-6">
              <DollarSign size={28} className="text-primary/80" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">
              High Rebates
            </h3>
            <p className="text-muted-foreground">
              Earn highly competitive rebates based on the trading volume of
              your referred clients.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card/80 border border-border/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/80/20 flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={28} className="text-primary/80" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">
              Advanced Reporting
            </h3>
            <p className="text-muted-foreground">
              Track your clients, monitor commissions, and analyze performance
              in real-time through our IB portal.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card/80 border border-border/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/80/20 flex items-center justify-center mx-auto mb-6">
              <Users size={28} className="text-primary/80" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">
              Dedicated Support
            </h3>
            <p className="text-muted-foreground">
              Get a dedicated account manager to assist you with growing your
              business and onboarding clients.
            </p>
          </div>
        </div>

        <Link
          to="/login"
          className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/70 text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          Become an IB Today
        </Link>
      </div>
    </div>
  );
}
