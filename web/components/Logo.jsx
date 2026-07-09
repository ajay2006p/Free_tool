/* FreeTool brand mark — a 2×2 "app grid" in a gradient tile, signalling
   "all your tools in one place". Pure inline SVG: crisp at any size, no image
   file to load, theme-independent. */
export default function Logo({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="ft-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#ft-logo-grad)" />
      <rect x="9" y="9" width="9.5" height="9.5" rx="3" fill="#fff" />
      <rect x="21.5" y="9" width="9.5" height="9.5" rx="3" fill="#fff" fillOpacity="0.78" />
      <rect x="9" y="21.5" width="9.5" height="9.5" rx="3" fill="#fff" fillOpacity="0.78" />
      <rect x="21.5" y="21.5" width="9.5" height="9.5" rx="3" fill="#fff" />
    </svg>
  );
}
