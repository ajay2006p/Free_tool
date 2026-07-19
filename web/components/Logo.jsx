/* FreeTool brand mark — the circular "FT" badge, matching the favicon and the
   app icons so the tab and the header show the same logo. Served from
   /logo.png, which is the 180×180 app icon with its black corners masked out
   to a transparent circle (the site header is white). */
import Image from "next/image";

export default function Logo({ size = 30 }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{ flexShrink: 0 }}
    />
  );
}
