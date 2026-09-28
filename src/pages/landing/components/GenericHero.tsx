import { motion } from "framer-motion";

interface GenericHeroProps {
  title: string;
  subtitle: string;
  image?: string;
}

export function GenericHero({ title, subtitle, image }: GenericHeroProps) {
  return (
    <div className="relative pt-24 pb-0 px-6 border-b border-border bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`grid ${image ? "lg:grid-cols-2" : "grid-cols-1"} gap-10 items-end`}
        >
          {/* Text side */}
          <div
            className={`pb-16 ${image ? "" : "text-center max-w-4xl mx-auto"}`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-semibold leading-[1.06] mb-6 text-foreground"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-xl"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Image side */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative rounded-t-2xl overflow-hidden border border-border/50 border-b-0 shadow-2xl bg-card/30 backdrop-blur">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-64 object-cover object-top"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
