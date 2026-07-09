"use client";

import { usePathname } from "next/navigation";

// Renders the public site chrome (header, footer, ads, analytics beacon) on
// normal pages, but NOTHING extra on /admin routes — the admin panel provides
// its own full-screen shell and must not show the site header/footer or count
// its own visits in analytics.
export default function SiteFrame({ header, footer, extras, children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {extras}
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
