/** SeekPoint mark: a magnifying glass with a play triangle in the lens -
 * "seek" (search) + "point" (a moment in a video/document). */
export default function Logo({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="4" />
      <path d="M16 13.5 L27 20 L16 26.5 Z" fill="currentColor" />
      <line x1="29.5" y1="29.5" x2="41" y2="41" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}
