export const SERVICE_SLUGS = [
  "led-sign-boards",
  "acrylic-signs",
  "3d-letter-signs",
  "acp-signage",
  "stainless-steel-signs",
  "glow-sign-boards",
  "office-branding",
  "retail-branding",
  "industrial-signage",
  "wayfinding",
  "custom-fabrication",
  "installation",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type ServiceIconKey =
  | "lightbulb"
  | "square"
  | "type"
  | "layers"
  | "shield"
  | "sparkles"
  | "briefcase"
  | "store"
  | "factory"
  | "map"
  | "wrench"
  | "installation";

export interface ServiceDetail {
  slug: ServiceSlug;
  label: string;
  shortLabel?: string;
  category: "Signage" | "Branding" | "Custom Solutions";
  icon: ServiceIconKey;
  image: string;
  summary: string;
  description: string;
  overview: string;
  applications: string[];
  benefits: string[];
  materials: string[];
  process: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedSlugs: ServiceSlug[];
  relatedKeywords: string[];
  apiSlugs?: string[];
}

const commonFaq = [
  {
    question: "Do you provide installation?",
    answer:
      "Yes. Our team handles measurement, fabrication, delivery, mounting, wiring where required, and final finishing at site.",
  },
  {
    question: "Can I request a custom size or finish?",
    answer:
      "Yes. Every project is measured and fabricated to suit the site, brand guidelines, lighting needs, and budget.",
  },
];

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: "led-sign-boards",
    label: "LED Sign Boards",
    category: "Signage",
    icon: "lightbulb",
    image: "/gallery/led-sign/led-sign-01.svg",
    summary: "High-visibility illuminated signage for storefronts, showrooms, hotels, and commercial buildings.",
    description:
      "Premium LED sign boards designed for strong night visibility, clean daytime finish, and dependable long-term performance.",
    overview:
      "LED sign boards are ideal when your brand needs to remain visible after dark without losing a refined commercial appearance. Shreeji Art designs the structure, lighting layout, face material, wiring, and mounting method as one complete signage system.",
    applications: ["Retail storefronts", "Showrooms", "Hotels and restaurants", "Corporate facades", "Healthcare and clinics"],
    benefits: ["Strong night visibility", "Energy-efficient lighting", "Custom shapes and sizes", "Weather-ready construction", "Professional installation"],
    materials: ["LED modules and drivers", "Acrylic or flex faces", "Aluminium or MS frames", "ACP backing panels", "Weather-sealed electrical components"],
    process: ["Site measurement", "Lighting and layout planning", "Fabrication and wiring", "Quality testing", "On-site installation"],
    faq: [
      {
        question: "Are LED sign boards suitable for outdoor use?",
        answer:
          "Yes. Outdoor LED signage is fabricated with weather-resistant materials, sealed wiring, and suitable mounting based on site exposure.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["glow-sign-boards", "3d-letter-signs", "acp-signage"],
    relatedKeywords: ["led", "light", "illuminated", "glow"],
    apiSlugs: ["led-signs"],
  },
  {
    slug: "acrylic-signs",
    label: "Acrylic Signs",
    category: "Signage",
    icon: "square",
    image: "/gallery/acrylic/acrylic-01.svg",
    summary: "Clean, polished acrylic signage for reception areas, retail interiors, nameplates, and brand displays.",
    description:
      "Elegant acrylic signs with precise cutting, polished edges, and optional illumination for a refined brand presence.",
    overview:
      "Acrylic signage gives brands a premium indoor finish with excellent clarity and flexibility. It works well for reception signs, direction boards, display panels, and illuminated interiors.",
    applications: ["Reception walls", "Office nameplates", "Retail displays", "Clinics and hospitals", "Interior brand panels"],
    benefits: ["Premium glossy finish", "Lightweight and durable", "Flexible color options", "Edge-lit options available", "Easy maintenance"],
    materials: ["Clear acrylic", "Frosted acrylic", "Vinyl graphics", "LED edge lighting", "Standoff mounts"],
    process: ["Artwork review", "Material and finish selection", "CNC or laser cutting", "Polishing and assembly", "Final mounting"],
    faq: [
      {
        question: "Can acrylic signs be backlit?",
        answer:
          "Yes. Acrylic can be edge-lit, backlit, or combined with vinyl and LEDs depending on the desired visual effect.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["office-branding", "3d-letter-signs", "stainless-steel-signs"],
    relatedKeywords: ["acrylic", "interior", "reception"],
  },
  {
    slug: "3d-letter-signs",
    label: "3D Letter Signs",
    category: "Signage",
    icon: "type",
    image: "/gallery/3d-letters/3d-letters-01.svg",
    summary: "Dimensional letters that add depth, shadow, and a premium architectural feel to your brand.",
    description:
      "Custom 3D letters fabricated in acrylic, metal, or composite materials with front-lit, backlit, or non-lit finishes.",
    overview:
      "3D letter signage gives a brand physical presence. It is especially effective on facades, reception walls, retail counters, and premium commercial interiors where flat graphics feel too simple.",
    applications: ["Facade brand names", "Reception walls", "Showroom signage", "Event backdrops", "Retail counters"],
    benefits: ["Premium dimensional depth", "Multiple lighting options", "Custom brand colors", "Indoor and outdoor use", "Strong visual hierarchy"],
    materials: ["Acrylic letters", "Stainless steel letters", "Aluminium composite", "Foam or PVC base", "LED modules for halo effects"],
    process: ["Logo file preparation", "Depth and material selection", "Cutting and finishing", "Lighting integration", "Template-based installation"],
    faq: [
      {
        question: "Can 3D letters be halo-lit?",
        answer:
          "Yes. We can fabricate halo-lit letters with rear spacing so the light softly glows against the wall surface.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["led-sign-boards", "stainless-steel-signs", "office-branding"],
    relatedKeywords: ["3d", "letter", "dimensional", "halo"],
  },
  {
    slug: "acp-signage",
    label: "ACP Signage",
    category: "Signage",
    icon: "layers",
    image: "/gallery/acp/acp-01.svg",
    summary: "Durable ACP boards and facade panels for clean large-format commercial signage.",
    description:
      "ACP signage systems for storefront facades, panel boards, pylon signs, cladding, and branded building fronts.",
    overview:
      "ACP signage is a practical premium solution for larger exterior surfaces. It provides a clean, flat, weather-resistant base for brand panels, letter installations, and facade upgrades.",
    applications: ["Shop fronts", "Building facades", "Showroom fascia", "Outdoor boards", "Commercial complexes"],
    benefits: ["Clean flat finish", "Weather resistance", "Large-format capability", "Lightweight structure", "Pairs well with 3D letters"],
    materials: ["ACP sheets", "Aluminium framing", "Vinyl or UV print", "Acrylic letters", "LED modules where required"],
    process: ["Facade measurement", "Panel planning", "Frame fabrication", "ACP fixing", "Branding and final finishing"],
    faq: [
      {
        question: "Is ACP suitable for large outdoor signage?",
        answer:
          "Yes. ACP is commonly used for large facades and outdoor sign bases because it is light, flat, and weather-resistant.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["3d-letter-signs", "led-sign-boards", "retail-branding"],
    relatedKeywords: ["acp", "facade", "cladding", "panel"],
  },
  {
    slug: "stainless-steel-signs",
    label: "Stainless Steel Signs",
    category: "Branding",
    icon: "shield",
    image: "/gallery/stainless-steel/stainless-steel-01.svg",
    summary: "Premium stainless steel letters, nameplates, and plaques for long-lasting professional branding.",
    description:
      "Brushed, mirror, satin, and gold-finish stainless steel signage for offices, hotels, hospitals, and premium storefronts.",
    overview:
      "Stainless steel signage creates a high-trust, long-lasting impression. It is best for brands that need a solid, elegant finish with excellent durability and low maintenance.",
    applications: ["Office entrances", "Hotel branding", "Hospital signage", "Corporate nameplates", "Luxury retail"],
    benefits: ["Premium metallic finish", "Long service life", "Low maintenance", "Indoor and outdoor suitability", "Precise letter cutting"],
    materials: ["304 stainless steel", "Brushed steel", "Mirror steel", "Gold titanium finish", "Standoff hardware"],
    process: ["Finish selection", "Laser/CNC cutting", "Bending or depth fabrication", "Polishing", "Template installation"],
    faq: [
      {
        question: "Which stainless steel finish looks most premium?",
        answer:
          "Brushed and gold titanium finishes are popular for premium interiors, while mirror steel creates a sharper reflective effect.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["3d-letter-signs", "acrylic-signs", "office-branding"],
    relatedKeywords: ["stainless", "steel", "ss", "metal"],
    apiSlugs: ["stainless-steel-signage"],
  },
  {
    slug: "glow-sign-boards",
    label: "Glow Sign Boards",
    category: "Signage",
    icon: "sparkles",
    image: "/gallery/glow-sign/glow-sign-01.svg",
    summary: "Bright, practical glow signs for shops, clinics, restaurants, and everyday commercial visibility.",
    description:
      "Backlit glow sign boards built for clear visibility, fast turnaround, and strong value for street-facing businesses.",
    overview:
      "Glow sign boards are a dependable option for businesses that need illuminated visibility at a practical cost. They work especially well in high-traffic local commercial areas.",
    applications: ["Shops and pharmacies", "Restaurants", "Clinics", "Service outlets", "Small commercial fronts"],
    benefits: ["Bright illuminated face", "Cost-effective visibility", "Custom sizes", "Fast production", "Easy serviceability"],
    materials: ["Flex or acrylic face", "LED tube or strip lighting", "Aluminium frame", "Vinyl graphics", "Weather protection"],
    process: ["Size confirmation", "Artwork setup", "Frame fabrication", "Print and lighting", "Installation and testing"],
    faq: [
      {
        question: "What is the difference between LED signs and glow signs?",
        answer:
          "Glow signs usually use a lit cabinet or face, while premium LED signs can include channel letters, modules, and more refined lighting systems.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["led-sign-boards", "acp-signage", "retail-branding"],
    relatedKeywords: ["glow", "backlit", "illuminated"],
  },
  {
    slug: "office-branding",
    label: "Office Branding",
    category: "Branding",
    icon: "briefcase",
    image: "/gallery/office-branding/office-branding-01.svg",
    summary: "Reception signs, wall graphics, cabin labels, and workplace branding systems.",
    description:
      "Complete office branding solutions that make your workplace feel polished, navigable, and aligned with your brand.",
    overview:
      "Office branding turns workspaces into clear, professional brand environments. We design and install reception identity, room signs, wall graphics, wayfinding, and interior brand elements.",
    applications: ["Reception areas", "Conference rooms", "Cabin nameplates", "Glass partitions", "Workplace wayfinding"],
    benefits: ["Professional first impression", "Consistent brand language", "Better navigation", "Custom material choices", "Clean installation"],
    materials: ["Acrylic panels", "Vinyl graphics", "Frosted films", "3D letters", "Stainless steel hardware"],
    process: ["Brand audit", "Space measurement", "Layout planning", "Fabrication", "Clean installation"],
    faq: [
      {
        question: "Can you match our brand guidelines?",
        answer:
          "Yes. We can work from your logo files, colors, and brand guidelines to keep the office branding consistent.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["acrylic-signs", "wayfinding", "stainless-steel-signs"],
    relatedKeywords: ["office", "corporate", "reception", "workspace"],
  },
  {
    slug: "retail-branding",
    label: "Retail Branding",
    category: "Branding",
    icon: "store",
    image: "/gallery/retail-branding/retail-branding-01.svg",
    summary: "Storefront, interior, display, and promotional signage for retail brands.",
    description:
      "End-to-end retail branding that helps customers recognize, enter, navigate, and remember your store.",
    overview:
      "Retail branding combines storefront signage, product-zone communication, promotional graphics, and installation details into a complete customer-facing experience.",
    applications: ["Storefront fascia", "Window graphics", "In-store displays", "Directional signage", "Promotional boards"],
    benefits: ["Improved storefront presence", "Stronger brand recall", "Clear customer navigation", "Seasonal update options", "End-to-end execution"],
    materials: ["ACP panels", "Acrylic letters", "Vinyl graphics", "LED modules", "Display boards"],
    process: ["Retail site review", "Visual concept", "Material planning", "Production", "Store-safe installation"],
    faq: [
      {
        question: "Can you handle both exterior and interior retail branding?",
        answer:
          "Yes. We can plan storefront signage, window graphics, interior category signs, and promotional elements together.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["led-sign-boards", "acp-signage", "glow-sign-boards"],
    relatedKeywords: ["retail", "store", "shop", "showroom"],
  },
  {
    slug: "industrial-signage",
    label: "Industrial Signage",
    category: "Branding",
    icon: "factory",
    image: "/gallery/industrial-signage/industrial-signage-01.svg",
    summary: "Durable safety, identification, directional, and facility signage for industrial sites.",
    description:
      "Industrial signage built for factories, warehouses, plants, and commercial facilities where clarity and durability matter.",
    overview:
      "Industrial signage supports safety, navigation, identification, and operational clarity. We fabricate boards that are readable, practical, and suited for demanding site conditions.",
    applications: ["Factories", "Warehouses", "Industrial estates", "Construction sites", "Utility and safety zones"],
    benefits: ["Clear safety communication", "Weather-ready materials", "High visibility", "Custom sizes", "Site-specific installation"],
    materials: ["ACP sheets", "Retroreflective vinyl", "MS frames", "Powder-coated panels", "UV print"],
    process: ["Site requirement mapping", "Content and icon planning", "Material selection", "Fabrication", "Installation by zone"],
    faq: [
      {
        question: "Can you create safety and directional signs for large sites?",
        answer:
          "Yes. We can plan signage by zone, department, route, and safety requirement for large industrial premises.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["wayfinding", "acp-signage", "custom-fabrication"],
    relatedKeywords: ["industrial", "factory", "warehouse", "safety"],
  },
  {
    slug: "wayfinding",
    label: "Wayfinding",
    category: "Branding",
    icon: "map",
    image: "/gallery/wayfinding/wayfinding-01.svg",
    summary: "Directional signs, directories, room labels, and navigation systems for commercial spaces.",
    description:
      "Wayfinding signage that helps visitors, customers, and teams move through your space with confidence.",
    overview:
      "Wayfinding is more than arrows. It is a complete navigation system designed around entrances, decision points, departments, rooms, parking, emergency routes, and visitor behavior.",
    applications: ["Hospitals and clinics", "Corporate offices", "Schools and colleges", "Commercial buildings", "Factories and warehouses"],
    benefits: ["Reduced visitor confusion", "Cleaner navigation", "Brand-consistent signs", "Better accessibility", "Scalable system planning"],
    materials: ["ACP panels", "Acrylic plates", "Vinyl graphics", "Stainless steel mounts", "Wall and hanging hardware"],
    process: ["Route mapping", "Sign schedule planning", "Design system setup", "Fabrication", "Location-wise installation"],
    faq: [
      {
        question: "Do you plan the full wayfinding system?",
        answer:
          "Yes. We can map visitor flow and create a sign schedule for entrances, corridors, rooms, floors, parking, and exits.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["office-branding", "industrial-signage", "acrylic-signs"],
    relatedKeywords: ["wayfinding", "direction", "directory", "navigation"],
  },
  {
    slug: "custom-fabrication",
    label: "Custom Fabrication",
    category: "Custom Solutions",
    icon: "wrench",
    image: "/gallery/custom-fabrication/custom-fabrication-01.svg",
    summary: "Made-to-order signage structures, shapes, frames, panels, and installation-ready components.",
    description:
      "Custom fabrication for signage projects that need unique dimensions, finishes, structural details, or brand forms.",
    overview:
      "Custom fabrication helps turn unusual signage concepts into practical built pieces. We support custom shapes, frames, panels, letters, mounting systems, and mixed-material assemblies.",
    applications: ["Custom logo forms", "Display structures", "Facade elements", "Special panels", "Exhibition and launch signage"],
    benefits: ["Site-specific build quality", "Custom dimensions", "Mixed-material execution", "Workshop-controlled finish", "Installation-ready output"],
    materials: ["Metal frames", "ACP panels", "Acrylic", "PVC and foam board", "Paint and powder coating"],
    process: ["Requirement study", "Technical drawing", "Material selection", "Workshop fabrication", "Finishing and delivery"],
    faq: [
      {
        question: "Can you build from a reference image?",
        answer:
          "Yes. We can convert a reference, logo, or concept into a practical fabrication plan after checking size, material, and installation needs.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["installation", "3d-letter-signs", "industrial-signage"],
    relatedKeywords: ["fabrication", "custom", "cnc", "metal"],
  },
  {
    slug: "installation",
    label: "Installation",
    category: "Custom Solutions",
    icon: "installation",
    image: "/gallery/installation/installation-01.svg",
    summary: "Professional signage installation, mounting, wiring coordination, alignment, and final handover.",
    description:
      "Careful on-site installation for signage projects where finish, safety, alignment, and durability matter.",
    overview:
      "A good sign can lose impact if installation is poor. Our installation approach covers site readiness, mounting method, alignment, electrical coordination, testing, and clean handover.",
    applications: ["Facade signs", "Retail stores", "Office interiors", "Industrial sites", "Large-format boards"],
    benefits: ["Clean alignment", "Safer mounting", "Reduced site disruption", "Electrical coordination", "Professional final finish"],
    materials: ["Mounting brackets", "Fasteners", "Standoff hardware", "Electrical fittings", "Sealants and finishing materials"],
    process: ["Site readiness check", "Marking and alignment", "Mounting", "Wiring and testing", "Final cleanup and handover"],
    faq: [
      {
        question: "Do you install signs fabricated by others?",
        answer:
          "We can review the sign, site, and mounting requirements first. If it is practical and safe, we can help with installation.",
      },
      ...commonFaq,
    ],
    relatedSlugs: ["custom-fabrication", "led-sign-boards", "acp-signage"],
    relatedKeywords: ["installation", "mounting", "site", "wiring"],
  },
];

export const SERVICE_DETAILS_BY_SLUG = Object.fromEntries(
  SERVICE_DETAILS.map((service) => [service.slug, service])
) as Record<ServiceSlug, ServiceDetail>;

export const SERVICE_NAV_GROUPS = [
  {
    title: "Signage",
    items: SERVICE_DETAILS.filter((service) => service.category === "Signage"),
  },
  {
    title: "Branding",
    items: SERVICE_DETAILS.filter((service) => service.category === "Branding"),
  },
  {
    title: "Custom Solutions",
    items: SERVICE_DETAILS.filter((service) => service.category === "Custom Solutions"),
  },
];

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return SERVICE_DETAILS_BY_SLUG[slug as ServiceSlug];
}

export function getRelatedServices(service: ServiceDetail): ServiceDetail[] {
  return service.relatedSlugs.map((slug) => SERVICE_DETAILS_BY_SLUG[slug]);
}
