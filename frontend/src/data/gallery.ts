export interface LocalGalleryItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  alt: string;
  description?: string;
  placeholder: boolean;
}

export interface DisplayGalleryItem {
  id: string;
  title: string;
  category: string;
  categorySlug?: string;
  image: string;
  alt?: string;
  description?: string;
  placeholder?: boolean;
}

export const GALLERY_FALLBACK_IMAGE = "/gallery/shared/gallery-fallback.svg";

export const GALLERY_CATEGORIES = [
  { label: "All", value: "" },
  { label: "Stainless Steel", value: "Stainless Steel" },
  { label: "Acrylic Signage", value: "Acrylic Signage" },
  { label: "ACP Cladding", value: "ACP Cladding" },
  { label: "Glow Sign", value: "Glow Sign" },
  { label: "LED Sign", value: "LED Sign" },
  { label: "3D Letters", value: "3D Letters" },
  { label: "Office Branding", value: "Office Branding" },
  { label: "Retail Branding", value: "Retail Branding" },
  { label: "Industrial Signage", value: "Industrial Signage" },
  { label: "Wayfinding", value: "Wayfinding" },
  { label: "Custom Fabrication", value: "Custom Fabrication" },
  { label: "Installation", value: "Installation" },
] as const;

export const GALLERY_DATA: LocalGalleryItem[] = [
  // ── Stainless Steel ───────────────────────────────────────────────
  {
    id: "local-ss-01",
    title: "Stainless Steel Dimensional Letters",
    category: "Stainless Steel",
    categorySlug: "stainless-steel",
    image: "/gallery/stainless-steel/stainless-steel-01.svg",
    alt: "Premium brushed stainless steel dimensional letters mounted on wall",
    description: "Brushed-finish dimensional letters with gold accent rule and standoff mounting",
    placeholder: true,
  },
  {
    id: "local-ss-02",
    title: "Stainless Steel Corporate Nameplate",
    category: "Stainless Steel",
    categorySlug: "stainless-steel",
    image: "/gallery/stainless-steel/stainless-steel-02.svg",
    alt: "Stainless steel corporate nameplate with brushed texture and gold border",
    description: "3D dimensional nameplate with fine brushed finish and gold inlay border",
    placeholder: true,
  },
  // ── Acrylic Signage ───────────────────────────────────────────────
  {
    id: "local-ac-01",
    title: "Edge-Lit Acrylic Sign",
    category: "Acrylic Signage",
    categorySlug: "acrylic",
    image: "/gallery/acrylic/acrylic-01.svg",
    alt: "Edge-lit acrylic sign glowing blue on dark background",
    description: "Full-perimeter edge-lit acrylic panel with custom LED colour",
    placeholder: true,
  },
  {
    id: "local-ac-02",
    title: "Layered Acrylic Panel Sign",
    category: "Acrylic Signage",
    categorySlug: "acrylic",
    image: "/gallery/acrylic/acrylic-02.svg",
    alt: "Layered translucent acrylic panels on standoffs",
    description: "Three-layer acrylic system with frosted back-panel and standoff mounting",
    placeholder: true,
  },
  // ── ACP Cladding ──────────────────────────────────────────────────
  {
    id: "local-acp-01",
    title: "ACP Panel Facade",
    category: "ACP Cladding",
    categorySlug: "acp",
    image: "/gallery/acp/acp-01.svg",
    alt: "ACP panel grid facade on commercial building exterior",
    description: "4×3 ACP panel cladding system with cyan reveal joints",
    placeholder: true,
  },
  {
    id: "local-acp-02",
    title: "ACP Fascia Signage",
    category: "ACP Cladding",
    categorySlug: "acp",
    image: "/gallery/acp/acp-02.svg",
    alt: "ACP fascia signage board on building storefront",
    description: "Full-width ACP fascia with 3D depth profile and integrated branding",
    placeholder: true,
  },
  // ── Glow Sign ─────────────────────────────────────────────────────
  {
    id: "local-gs-01",
    title: "Illuminated Glow Sign Board",
    category: "Glow Sign",
    categorySlug: "glow-sign",
    image: "/gallery/glow-sign/glow-sign-01.svg",
    alt: "Illuminated glow sign board with fuchsia backlit glow on dark background",
    description: "Backlit sign cabinet with vibrant bloom-glow effect and 3D depth",
    placeholder: true,
  },
  {
    id: "local-gs-02",
    title: "Circular Glow Sign",
    category: "Glow Sign",
    categorySlug: "glow-sign",
    image: "/gallery/glow-sign/glow-sign-02.svg",
    alt: "Circular glow sign with concentric ring light halo",
    description: "Round glow sign with multi-ring LED halo and edge-light rings",
    placeholder: true,
  },
  // ── LED Sign ──────────────────────────────────────────────────────
  {
    id: "local-led-01",
    title: "LED Channel Letter Sign",
    category: "LED Sign",
    categorySlug: "led-sign",
    image: "/gallery/led-sign/led-sign-01.svg",
    alt: "Amber LED channel letters forming a dimensional letter S",
    description: "Individual channel letters with internal LED modules and dot-matrix pattern",
    placeholder: true,
  },
  {
    id: "local-led-02",
    title: "LED Strip Sign Board",
    category: "LED Sign",
    categorySlug: "led-sign",
    image: "/gallery/led-sign/led-sign-02.svg",
    alt: "LED strip sign board with horizontal rows of amber light strips",
    description: "Sign cabinet with high-density LED strip rows and backlit company name",
    placeholder: true,
  },
  // ── 3D Letters ────────────────────────────────────────────────────
  {
    id: "local-3d-01",
    title: "3D Dimensional Letters",
    category: "3D Letters",
    categorySlug: "3d-letters",
    image: "/gallery/3d-letters/3d-letters-01.svg",
    alt: "Violet 3D dimensional letters with depth shadow effect",
    description: "Premium dimensional letters with cast shadow and gold accent baseline",
    placeholder: true,
  },
  {
    id: "local-3d-02",
    title: "3D Letter Block Display",
    category: "3D Letters",
    categorySlug: "3d-letters",
    image: "/gallery/3d-letters/3d-letters-02.svg",
    alt: "Isometric 3D letter blocks mounted on wall",
    description: "Isometric letter blocks with 3D top and side faces, wall-mounted",
    placeholder: true,
  },
  // ── Office Branding ───────────────────────────────────────────────
  {
    id: "local-ob-01",
    title: "Reception Wall Branding",
    category: "Office Branding",
    categorySlug: "office-branding",
    image: "/gallery/office-branding/office-branding-01.svg",
    alt: "Dark corporate sign panel on bright reception wall",
    description: "Dark navy sign panel with gold border and standoff screws on white wall",
    placeholder: true,
  },
  {
    id: "local-ob-02",
    title: "Office Door Name Plate",
    category: "Office Branding",
    categorySlug: "office-branding",
    image: "/gallery/office-branding/office-branding-02.svg",
    alt: "Office door with glass panel and mounted company name plate",
    description: "Glass-door office with illuminated corporate nameplate and gold detailing",
    placeholder: true,
  },
  // ── Retail Branding ───────────────────────────────────────────────
  {
    id: "local-rb-01",
    title: "Retail Storefront Fascia",
    category: "Retail Branding",
    categorySlug: "retail-branding",
    image: "/gallery/retail-branding/retail-branding-01.svg",
    alt: "Retail store fascia signage with orange accent and awning",
    description: "Full-width storefront fascia with canopy, illuminated name and shopfront windows",
    placeholder: true,
  },
  {
    id: "local-rb-02",
    title: "Projecting Blade Sign",
    category: "Retail Branding",
    categorySlug: "retail-branding",
    image: "/gallery/retail-branding/retail-branding-02.svg",
    alt: "Orange projecting blade sign mounted on building wall",
    description: "Perpendicular blade sign with 3D depth, wall bracket and directional arrow",
    placeholder: true,
  },
  // ── Industrial Signage ────────────────────────────────────────────
  {
    id: "local-is-01",
    title: "Industrial Safety Sign",
    category: "Industrial Signage",
    categorySlug: "industrial-signage",
    image: "/gallery/industrial-signage/industrial-signage-01.svg",
    alt: "Yellow and black diagonal stripe industrial safety sign on pole",
    description: "High-visibility safety board with diagonal warning stripes and bold text",
    placeholder: true,
  },
  {
    id: "local-is-02",
    title: "Industrial Panel Signage",
    category: "Industrial Signage",
    categorySlug: "industrial-signage",
    image: "/gallery/industrial-signage/industrial-signage-02.svg",
    alt: "Heavy-border industrial information panel with zone labels",
    description: "Zoned information panel with hex bolt corners and orange header band",
    placeholder: true,
  },
  // ── Wayfinding ────────────────────────────────────────────────────
  {
    id: "local-wf-01",
    title: "Directional Arrow Signs",
    category: "Wayfinding",
    categorySlug: "wayfinding",
    image: "/gallery/wayfinding/wayfinding-01.svg",
    alt: "Green directional arrow signs on pole pointing to reception, emergency and parking",
    description: "Multi-directional arrow signs on single pole with colour-coded bands",
    placeholder: true,
  },
  {
    id: "local-wf-02",
    title: "Floor Directory Board",
    category: "Wayfinding",
    categorySlug: "wayfinding",
    image: "/gallery/wayfinding/wayfinding-02.svg",
    alt: "Building floor directory board with green header and row listings",
    description: "Multi-floor directory board with emerald header, row entries and arrow indicators",
    placeholder: true,
  },
  // ── Custom Fabrication ────────────────────────────────────────────
  {
    id: "local-cf-01",
    title: "CNC-Cut Custom Shapes",
    category: "Custom Fabrication",
    categorySlug: "custom-fabrication",
    image: "/gallery/custom-fabrication/custom-fabrication-01.svg",
    alt: "Gold CNC-cut geometric shapes: ring, rectangle, hexagon and triangle",
    description: "Precision CNC-routed gold geometric shapes on grid work surface",
    placeholder: true,
  },
  {
    id: "local-cf-02",
    title: "CNC Routing in Progress",
    category: "Custom Fabrication",
    categorySlug: "custom-fabrication",
    image: "/gallery/custom-fabrication/custom-fabrication-02.svg",
    alt: "CNC routing machine cutting a gold workpiece with sparks",
    description: "CNC router cutting custom sign components with real-time control panel",
    placeholder: true,
  },
  // ── Installation ──────────────────────────────────────────────────
  {
    id: "local-in-01",
    title: "Sign Installation Layout",
    category: "Installation",
    categorySlug: "installation",
    image: "/gallery/installation/installation-01.svg",
    alt: "Wall with blue alignment guides, bracket marks and level indicator for sign installation",
    description: "Pre-installation survey: alignment guides, mounting brackets and spirit-level check",
    placeholder: true,
  },
  {
    id: "local-in-02",
    title: "On-Site Sign Installation",
    category: "Installation",
    categorySlug: "installation",
    image: "/gallery/installation/installation-02.svg",
    alt: "Crane lifting a sign panel up a building facade during on-site installation",
    description: "Heavy-lift installation of large-format sign using crane and scissor-lift team",
    placeholder: true,
  },
];
