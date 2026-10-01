import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Force the bone version, for surfaces that stay dark in light mode. */
  onDark?: boolean;
}

/**
 * Equiti Capitals lockup: a "rising bars" mark beside the full name set as one
 * lowercase serif wordmark.
 *
 * The lockup is monochrome — ink on light surfaces, bone on dark — so it holds
 * up on any background and does not depend on the accent colour. The mark is
 * three ascending rounded bars, a chart read as a signal of growth.
 *
 * The viewBox is deliberately tight (about 3.3:1) because every caller sizes
 * this by height with `w-auto`; slack inside the viewBox would render as dead
 * space next to the nav items.
 */
export default function Logo({ className, onDark }: LogoProps) {
  const fill = onDark ? "fill-[#f2efe6]" : "fill-[#14140f] dark:fill-[#f2efe6]";

  return (
    <svg
      viewBox="0 0 320 96"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Equiti Capitals"
      className={cn("w-auto", className)}
    >
      {/* Rising bars — short, medium, tall */}
      <rect
        x="14"
        y="52"
        width="16"
        height="30"
        rx="5"
        className={fill}
        opacity="0.4"
      />
      <rect
        x="38"
        y="34"
        width="16"
        height="48"
        rx="5"
        className={fill}
        opacity="0.7"
      />
      <rect x="62" y="14" width="16" height="68" rx="5" className={fill} />

      {/* Wordmark. textLength pins the line to an exact width so a wider face
          (Fraunces on the site vs. the Georgia fallback) cannot overflow and
          get clipped by the viewBox. */}
      <text
        x="96"
        y="59"
        textLength="210"
        lengthAdjust="spacingAndGlyphs"
        fontSize="30"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="700"
        className={fill}
      >
        equiti capitals
      </text>
    </svg>
  );
}
