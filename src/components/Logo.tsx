import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Force the dark-surface version, for surfaces that stay dark in light mode. */
  onDark?: boolean;
}

/**
 * Equiti Capitals lockup: a rounded tile holding a capital "E" beside the full
 * name set as one sans-serif wordmark.
 *
 * The E's three arms are sliced by a single rising diagonal, so the letter
 * doubles as a chart climbing to the top right. On light surfaces the tile is
 * onyx with a mint E; on dark surfaces it inverts to a mint tile with an onyx
 * E, the same pairing as the site's buttons.
 *
 * The viewBox is deliberately tight (about 3.3:1) because every caller sizes
 * this by height with `w-auto`; slack inside the viewBox would render as dead
 * space next to the nav items.
 */
export default function Logo({ className, onDark }: LogoProps) {
  const text = onDark ? "fill-[#f2efe6]" : "fill-[#14140f] dark:fill-[#f2efe6]";
  const tile = onDark ? "fill-[#83cfc1]" : "fill-[#0b0b0d] dark:fill-[#83cfc1]";
  const glyph = onDark
    ? "fill-[#0b0b0d]"
    : "fill-[#83cfc1] dark:fill-[#0b0b0d]";

  return (
    <svg
      viewBox="0 0 320 96"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Equiti Capitals"
      className={cn("w-auto", className)}
    >
      {/* Tile + sliced E, drawn on a 96 grid and scaled to 72. */}
      <g transform="translate(8 12) scale(0.75)">
        <rect width="96" height="96" rx="22" className={tile} />
        <rect x="24" y="22" width="12" height="52" className={glyph} />
        <polygon points="24,22 76,22 69.1,34 24,34" className={glyph} />
        <polygon points="24,42 64.5,42 57.5,54 24,54" className={glyph} />
        <polygon points="24,62 52.9,62 46,74 24,74" className={glyph} />
      </g>

      {/* Wordmark. textLength pins the line to an exact width so a wider face
          (a system fallback while Inter loads) cannot overflow and
          get clipped by the viewBox. */}
      <text
        x="96"
        y="59"
        textLength="210"
        lengthAdjust="spacingAndGlyphs"
        fontSize="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        className={text}
      >
        Equiti Capitals
      </text>
    </svg>
  );
}
