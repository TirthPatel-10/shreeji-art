import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { SITE_CONTACT } from "@/lib/contact";
import { getPublicSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const companyName = settings.company_name || SITE_CONTACT.companyName;
  const metaTitle =
    settings.meta_title || `${companyName} — Premium Signage & Branding, Ahmedabad`;
  const metaDescription =
    settings.meta_description ||
    `${companyName} crafts premium LED signs, acrylic letters, 3D signs, ACP signage, and custom branding solutions in Ahmedabad, India.`;
  const logoUrl = settings.logo_url || SITE_CONTACT.logoUrl;

  return {
    title: {
      default: metaTitle,
      template: `%s | ${companyName}`,
    },
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    description: metaDescription,
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
      siteName: companyName,
      description: metaDescription,
    },
  };
}

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
