import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Shreeji Art — Premium Signage & Branding, Ahmedabad",
    template: "%s | Shreeji Art",
  },
  icons: {
    icon: "/shreeji-final-logo.png",
    apple: "/shreeji-final-logo.png",
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
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
