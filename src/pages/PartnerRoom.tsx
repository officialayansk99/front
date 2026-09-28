import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function PartnerRoom() {
  const [copied, setCopied] = useState(false);
  const refLink = "https://elitfx.com/ref/USER123";

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full min-w-0"
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Partner Room
        </h1>
        <p className="text-muted-foreground mt-1">
          Share and earn with your referral link
        </p>
      </div>

      {/* Referral card */}
      <div className="rounded-xl p-6 gradient-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
          }}
        />
        <div className="relative space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            Your Referral Link
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 min-w-0">
            <div className="flex-1 min-w-0 bg-background/20 backdrop-blur rounded-lg px-4 py-2.5 text-sm text-foreground font-mono break-all">
              {refLink}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-lg bg-background/20 backdrop-blur text-foreground hover:bg-background/30 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
