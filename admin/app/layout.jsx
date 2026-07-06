import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "DevHub";

export const metadata = {
  title: { default: `${siteName} Admin`, template: `%s · ${siteName} Admin` },
  description: "Content management for the platform.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
