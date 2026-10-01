import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * Equiti Capitals lockup: a "rising bars" mark + wordmark, in the Onyx &
 * Teal palette.
 *
 * The mark is three ascending rounded bars — a chart read as a signal of growth
 * — kept deliberately name-neutral so the wordmark can change without redrawing
 * the symbol. Teal bars (mint on dark surfaces), heavy enough to hold up as a
 * small favicon and a large nav mark alike.
 *
 * The viewBox is deliberately tight (2.5:1) because every caller sizes this by
 * height with `w-auto`; slack inside the viewBox would render as dead space
 * next to the nav items.
 */
export default function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 240 96"
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
        className="fill-[#23a594] dark:fill-[#83cfc1]"
        opacity="0.45"
      />
      <rect
        x="38"
        y="34"
        width="16"
        height="48"
        rx="5"
        className="fill-[#23a594] dark:fill-[#83cfc1]"
        opacity="0.75"
      />
      <rect
        x="62"
        y="14"
        width="16"
        height="68"
        rx="5"
        className="fill-[#23a594] dark:fill-[#83cfc1]"
      />

      {/* Wordmark. textLength pins each line to an exact width so a wider face
          (Fraunces on the site vs. the Georgia fallback) can't overflow and get
          clipped by the viewBox. letterSpacing is set to land at roughly the
          same width on its own, because SVG rasterisers — including the one that
          bakes the email PNG — ignore textLength entirely. Belt and braces: both
          render paths agree. */}
      <text
        x="96"
        y="55"
        textLength="132"
        lengthAdjust="spacing"
        letterSpacing="0"
        fontSize="36"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="800"
        className="fill-[#14140f] dark:fill-[#f2efe6]"
      >
        EQUITI
      </text>

      <text
        x="98"
        y="76"
        textLength="86"
        lengthAdjust="spacing"
        letterSpacing="3.9"
        fontSize="11"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        className="fill-[#23a594] dark:fill-[#83cfc1]"
      >
        CAPITALS
      </text>
    </svg>
  );
}
