import type { Metadata } from "next";
import type { SiteContact } from "@/lib/contact";

export const PRODUCTION_SITE_URL = "https://shreejiartsignage.in";
export const SITE_NAME = "Shreeji Art";

export const DEFAULT_SEO_TITLE = "Shreeji Art | Signage Company in Ahmedabad";
export const DEFAULT_SEO_DESCRIPTION =
  "Shreeji Art is a signage company in Ahmedabad providing custom LED signs, acrylic signage, 3D letters, ACP signage, stainless steel signs, wayfinding signage, fabrication, branding and installation solutions.";

export function absoluteUrl(path = "/") {
  return new URL(path, PRODUCTION_SITE_URL).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image = "/shreeji-final-logo.png",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          alt: `${SITE_NAME} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function localBusinessJsonLd(contact: SiteContact) {
  const sameAs = [
    contact.facebookUrl,
    contact.instagramUrl,
    contact.linkedinUrl,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: contact.companyName,
    url: PRODUCTION_SITE_URL,
    logo: absoluteUrl(contact.logoUrl),
    image: absoluteUrl(contact.logoUrl),
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "C-60, Karmchari Nagar Society-1, Karmachari Nagar Road, Behind Junior Genius, Opposite Rannapark, Ghatlodia",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      postalCode: "380061",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact.latitude,
      longitude: contact.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    sameAs,
  };
}
