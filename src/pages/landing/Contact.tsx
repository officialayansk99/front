import { GenericHero } from "./components/GenericHero";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div>
      <GenericHero
        title="Contact Us"
        subtitle="Our dedicated support team is available 24/5 to assist you."
      />
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Get In Touch
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="text-primary/80" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground mb-1">
                  Email Support
                </h4>
                <p className="text-muted-foreground">info@equiticapitals.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-card/80 border border-border/30">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full bg-card/60 border border-border/40 rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full bg-card/60 border border-border/40 rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-card/60 border border-border/40 rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-card/60 border border-border/40 rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary"
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/70 text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
