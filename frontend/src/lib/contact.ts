export interface SiteContact {
  companyName: string;
  companyDescription: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  emailHref: string;
  address: string;
  shortLocation: string;
  businessHours: string;
  latitude: number;
  longitude: number;
  mapsHref: string;
  mapsSearchHref: string;
  mapsEmbedSrc: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  logoUrl: string;
}

export const SITE_CONTACT: SiteContact = {
  companyName: "Shreeji Art",
  companyDescription:
    "Premium signage solutions crafted for businesses across Ahmedabad and Gujarat.",
  phone: "+91 7383628386",
  phoneHref: "tel:+917383628386",
  whatsappHref: "https://wa.me/917383628386",
  email: "shreejiart1119@gmail.com",
  emailHref: "mailto:shreejiart1119@gmail.com",
  address:
    "C-60, Karmchari Nagar Society-1, Karmachari Nagar Road, Behind Junior Genius, Opposite Rannapark, Ghatlodia, Ahmedabad, Gujarat – 380061, India",
  shortLocation: "Ghatlodia, Ahmedabad, Gujarat",
  businessHours: "Monday - Saturday, 9:00 AM - 8:00 PM",
  latitude: 23.065653,
  longitude: 72.544802,
  mapsHref:
    "https://www.google.com/maps/dir/?api=1&destination=23.065653,72.544802",
  mapsSearchHref:
    "https://www.google.com/maps/search/?api=1&query=23.065653,72.544802",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=23.065653,72.544802&z=17&output=embed",
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  logoUrl: "/shreeji-final-logo.png",
};

export type PublicSiteSettings = Record<string, string | null | undefined>;

const LEGACY_PLACEHOLDER_VALUES = new Set([
  "+91 99999 99999",
  "info@shreejiart.in",
  "Ahmedabad, Gujarat - 380001",
  "919999999999",
]);

function firstNonEmpty(...values: Array<string | null | undefined>) {
  return values.find((value) => {
    const trimmed = value?.trim();
    return trimmed && !LEGACY_PLACEHOLDER_VALUES.has(trimmed);
  })?.trim();
}

function phoneToTelHref(phone: string) {
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  if (!normalized) return SITE_CONTACT.phoneHref;
  return `tel:${normalized.startsWith("+") ? normalized : `+${normalized}`}`;
}

function phoneToWhatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : SITE_CONTACT.whatsappHref;
}

function emailToHref(email: string) {
  return email.includes("@") ? `mailto:${email.trim()}` : SITE_CONTACT.emailHref;
}

function parseCoordinate(value: string | null | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolveSiteContact(settings?: PublicSiteSettings | null): SiteContact {
  const phone = firstNonEmpty(settings?.company_phone, SITE_CONTACT.phone) ?? SITE_CONTACT.phone;
  const email = firstNonEmpty(settings?.company_email, SITE_CONTACT.email) ?? SITE_CONTACT.email;
  const latitude = parseCoordinate(settings?.company_latitude, SITE_CONTACT.latitude);
  const longitude = parseCoordinate(settings?.company_longitude, SITE_CONTACT.longitude);
  const coordinateQuery = `${latitude},${longitude}`;
  const whatsappNumber = firstNonEmpty(settings?.whatsapp_number);

  return {
    companyName:
      firstNonEmpty(settings?.company_name, SITE_CONTACT.companyName) ??
      SITE_CONTACT.companyName,
    companyDescription:
      firstNonEmpty(settings?.company_description, SITE_CONTACT.companyDescription) ??
      SITE_CONTACT.companyDescription,
    phone,
    phoneHref: phoneToTelHref(phone),
    whatsappHref: whatsappNumber
      ? phoneToWhatsappHref(whatsappNumber)
      : phoneToWhatsappHref(phone),
    email,
    emailHref: emailToHref(email),
    address:
      firstNonEmpty(settings?.company_address, SITE_CONTACT.address) ??
      SITE_CONTACT.address,
    shortLocation:
      firstNonEmpty(
        settings?.short_location,
        [settings?.company_city, settings?.company_state].filter(Boolean).join(", "),
        SITE_CONTACT.shortLocation
      ) ?? SITE_CONTACT.shortLocation,
    businessHours:
      firstNonEmpty(settings?.business_hours, SITE_CONTACT.businessHours) ??
      SITE_CONTACT.businessHours,
    latitude,
    longitude,
    mapsHref:
      firstNonEmpty(
        settings?.google_maps_directions_url,
        settings?.google_maps_url,
        `https://www.google.com/maps/dir/?api=1&destination=${coordinateQuery}`
      ) ?? SITE_CONTACT.mapsHref,
    mapsSearchHref:
      firstNonEmpty(
        settings?.google_maps_search_url,
        `https://www.google.com/maps/search/?api=1&query=${coordinateQuery}`
      ) ?? SITE_CONTACT.mapsSearchHref,
    mapsEmbedSrc:
      firstNonEmpty(
        settings?.google_maps_embed_url,
        `https://www.google.com/maps?q=${coordinateQuery}&z=17&output=embed`
      ) ?? SITE_CONTACT.mapsEmbedSrc,
    facebookUrl: firstNonEmpty(settings?.facebook_url, SITE_CONTACT.facebookUrl) ?? "",
    instagramUrl:
      firstNonEmpty(settings?.instagram_url, SITE_CONTACT.instagramUrl) ?? "",
    linkedinUrl: firstNonEmpty(settings?.linkedin_url, SITE_CONTACT.linkedinUrl) ?? "",
    logoUrl: firstNonEmpty(settings?.logo_url, SITE_CONTACT.logoUrl) ?? SITE_CONTACT.logoUrl,
  };
}
