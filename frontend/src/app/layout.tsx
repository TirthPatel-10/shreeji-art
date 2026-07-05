import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Shreeji Art — Premium Signage & Branding, Ahmedabad",
    template: "%s | Shreeji Art",
  },
  description:
    "Shreeji Art crafts premium LED signs, acrylic letters, 3D signs, ACP signage, and custom branding solutions in Ahmedabad, India.",
  keywords: [
    "signage Ahmedabad",
    "LED signs",
    "acrylic signs",
    "3D letter signs",
    "ACP signage",
    "office branding",
    "retail branding",
    "custom signs India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Shreeji Art",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
