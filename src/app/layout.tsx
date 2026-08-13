import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wealth Lead Engine — AI-Powered Client Acquisition",
  description:
    "Discover your Wealth Readiness Score. An AI-powered assessment that helps you understand how prepared your financial life is for what comes next.",
  keywords: "wealth readiness, financial assessment, financial advisor, wealth management, retirement planning",
  openGraph: {
    title: "Wealth Lead Engine",
    description: "Discover your Wealth Readiness Score in under 5 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
