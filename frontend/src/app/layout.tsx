import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { SITE_CONTACT } from "@/lib/contact";
import { getPublicSiteContact, getPublicSiteSettings } from "@/lib/site-settings";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  PRODUCTION_SITE_URL,
  absoluteUrl,
  localBusinessJsonLd,
} from "@/lib/seo";
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
  const metaTitle = settings.meta_title || DEFAULT_SEO_TITLE;
  const metaDescription = settings.meta_description || DEFAULT_SEO_DESCRIPTION;
  const logoUrl = settings.logo_url || SITE_CONTACT.logoUrl;
  const absoluteLogoUrl = absoluteUrl(logoUrl);

  return {
    metadataBase: new URL(PRODUCTION_SITE_URL),
    title: {
      default: metaTitle,
      template: `%s | ${companyName}`,
    },
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    description: metaDescription,
    keywords: [
      "signage company Ahmedabad",
      "sign board manufacturer Ahmedabad",
      "LED sign boards",
      "acrylic signage",
      "3D letter signage",
      "ACP signage",
      "stainless steel signs",
      "wayfinding signage",
      "signage fabrication",
      "signage installation",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: companyName,
      title: metaTitle,
      description: metaDescription,
      url: PRODUCTION_SITE_URL,
      images: [
        {
          url: absoluteLogoUrl,
          alt: `${companyName} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [absoluteLogoUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await getPublicSiteContact();
  const jsonLd = localBusinessJsonLd(contact);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
