export type NavItem = {
  href: string;
  label: string;
};

export type HeroCollageImage = {
  src: string;
  alt: string;
  className: string;
  tier: "near" | "mid" | "far";
};

export type ServiceCategory =
  | "coating"
  | "custom-paint"
  | "powder-coating"
  | "tinting"
  | "wrapping"
  | "maintenance";

export type ServiceItem = {
  title: string;
  description: string;
  features: string[];
  audience?: "vehicle-owner" | "detailer" | "both";
  category?: ServiceCategory;
  useCase?: string;
  ctaLabel?: string;
};

export type ServiceGroup = {
  title: string;
  description: string;
  services: ServiceItem[];
  ctaLabel?: string;
};

export type ProductItem = {
  title: string;
  description: string;
  features: string[];
  audience: "detailer" | "customer";
};

export type ProductCatalogGroup = {
  title: string;
  description: string;
  products: ProductItem[];
};

export type BookingMode = "solutions" | "onsite" | "pickup-drop";

export type BookingEligibilityRule = {
  label: string;
  requiredFor: BookingMode[];
};

export type ServiceCard = {
  title: string;
  description: string;
  features: string[];
};

export type PackageCard = {
  name: string;
  price: string;
  description: string;
  badge?: string;
  features: string[];
};

export type WorkMediaItem = {
  title: string;
  label: string;
  mediaType: "image" | "video";
  src: string;
  poster: string;
  alt: string;
  span: string;
  heightClass: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  vehicle: string;
  location: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type StatItem = {
  value: string;
  label: string;
  note: string;
};

export type BrandConfig = {
  name: string;
  shortName: string;
  tagline: string;
  subtitle: string;
  location: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  mapUrl: string;
  canonicalUrl: string;
  hours: string;
};

export const BRAND: BrandConfig = {
  name: "NANO GRIT",
  shortName: "Nano Grit",
  tagline: "Detailing & Coating Solutions",
  subtitle: "Advanced Paint Protection Coatings for Cars & Bikes",
  location: "Bangalore, Karnataka",
  phone: "+91 99018 54580",
  phoneHref: "tel:+919901854580",
  whatsapp: "919901854580",
  email: "nanogritindia@gmail.com",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=12.9694933,77.4870477",
  canonicalUrl: "https://nanogritindia.com",
  hours: "Mon-Sat, 9:00 AM-8:00 PM",
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Our Works" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const HERO_COLLAGE: HeroCollageImage[] = [
  {
    src: "/media/collage/collage-01.jpg",
    alt: "Workshop hood reflection",
    className:
      "left-[-3%] top-8 h-[7rem] w-[6rem] rotate-[-7deg] md:h-[10rem] md:w-[7rem]",
    tier: "near",
  },
  {
    src: "/media/collage/collage-02.jpg",
    alt: "Paint correction pass under solutions light",
    className:
      "left-[17%] top-4 h-[6rem] w-[4.5rem] rotate-[6deg] md:h-[8rem] md:w-[6rem]",
    tier: "mid",
  },
  {
    src: "/media/collage/collage-03.jpg",
    alt: "Headlight detail close shot",
    className:
      "left-[39%] top-14 h-[6.5rem] w-[5rem] rotate-[-5deg] md:h-[9rem] md:w-[6.5rem]",
    tier: "far",
  },
  {
    src: "/media/collage/collage-04.jpg",
    alt: "Wheel and brake detail focus",
    className:
      "left-[58%] top-5 h-[5.5rem] w-[4rem] rotate-[4deg] md:h-[7.5rem] md:w-[5rem]",
    tier: "near",
  },
  {
    src: "/media/collage/collage-05.jpg",
    alt: "Water beading and gloss closeup",
    className:
      "right-[10%] top-8 h-[6rem] w-[5rem] rotate-[-6deg] md:h-[8rem] md:w-[6rem]",
    tier: "mid",
  },
  {
    src: "/media/collage/collage-06.jpg",
    alt: "Technician and workshop tools context",
    className:
      "left-[2%] bottom-9 h-[5rem] w-[6.5rem] rotate-[5deg] md:h-[7rem] md:w-[9rem]",
    tier: "far",
  },
  {
    src: "/media/collage/collage-07.jpg",
    alt: "Panel light line inspection",
    className:
      "left-[34%] bottom-5 h-[4.5rem] w-[6rem] rotate-[-4deg] md:h-[6.5rem] md:w-[8rem]",
    tier: "near",
  },
  {
    src: "/media/collage/collage-08.jpg",
    alt: "Final shine delivery moment",
    className:
      "right-[6%] bottom-6 h-[6rem] w-[5rem] rotate-[5deg] md:h-[8rem] md:w-[6rem]",
    tier: "mid",
  },
];

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: "Detailing & Protection",
    description:
      "Core detailing and coating stack for gloss, durability, and long-term finish stability.",
    ctaLabel: "Get Quote on WhatsApp",
    services: [
      {
        title: "Glass / Windshield Coating",
        description: "Improves water behavior and visibility under rain and highway spray.",
        features: ["Hydrophobic sheet-off", "Night visibility support", "Wiper-safe layers"],
        category: "coating",
        audience: "vehicle-owner",
      },
      {
        title: "Plastics Coating",
        description: "UV-resistant trim protection for black plastics and exterior inserts.",
        features: ["Fade resistance", "Rich black restore", "Heat and wash durability"],
        category: "coating",
        audience: "vehicle-owner",
      },
      {
        title: "Alloy Wheel Coating",
        description: "Brake dust release and easier wheel maintenance.",
        features: ["High-heat compatible", "Dust release boost", "Gloss or satin support"],
        category: "coating",
        audience: "vehicle-owner",
      },
      {
        title: "Paint Coating",
        description: "Multi-layer paint protection for deep gloss and contaminant resistance.",
        features: ["Layered durability", "Gloss retention", "Chemical resistance"],
        category: "coating",
        audience: "vehicle-owner",
      },
      {
        title: "Leather Coating",
        description: "Protective layer for leather seats and touch areas.",
        features: ["Color-transfer resistance", "Easy wipe maintenance", "Matte OEM feel"],
        category: "coating",
        audience: "vehicle-owner",
      },
      {
        title: "Tinting Services",
        description: "Cabin heat and glare control with legal-grade film options.",
        features: ["Heat rejection", "UV filtering", "Clean edge finish"],
        category: "tinting",
        audience: "vehicle-owner",
      },
      {
        title: "Wrapping Services",
        description: "Color and protection wraps for style updates and surface shielding.",
        features: ["Gloss/satin/matte options", "Panel-wise application", "Removable finish"],
        category: "wrapping",
        audience: "vehicle-owner",
      },
    ],
  },
  {
    title: "Maintenance Products",
    description:
      "Post-coating upkeep products built for extending gloss and beading performance.",
    ctaLabel: "Get Product Quote",
    services: [
      {
        title: "Solvent-Based Ceramic Booster",
        description: "High-impact gloss and hydrophobic recharge for enthusiast maintenance.",
        features: ["Strong water behavior", "Deep gloss recharge", "Durable top-up layer"],
        category: "maintenance",
        audience: "vehicle-owner",
      },
      {
        title: "Water-Based Ceramic Booster",
        description: "User-friendly maintenance coating for routine gloss upkeep.",
        features: ["Simple application", "Safe routine use", "Balanced beading support"],
        category: "maintenance",
        audience: "vehicle-owner",
      },
    ],
  },
  {
    title: "Custom Paint & Finishing",
    description:
      "From concept design to execution, we can build custom paint and powder finishes.",
    ctaLabel: "Send Design for Quote",
    services: [
      {
        title: "Custom Paint Services",
        description: "Any design reference you share can be translated into a custom finish.",
        features: ["Design-driven workflow", "Color match and blend", "Final finish QA"],
        category: "custom-paint",
        audience: "both",
        useCase: "Best for owners who want unique identity builds.",
      },
      {
        title: "Custom Paint Specialization",
        description: "Advanced paint execution for show-build and statement vehicles.",
        features: ["Layer planning", "Controlled curing", "Premium finish control"],
        category: "custom-paint",
        audience: "both",
      },
      {
        title: "Paint Works Done",
        description: "Body paint restoration and full-panel refinishing support.",
        features: ["Defect correction prep", "Panel refinishing", "Finish leveling"],
        category: "custom-paint",
        audience: "vehicle-owner",
      },
      {
        title: "Custom Powder Coating",
        description: "Custom textures and colors for wheels and select metal components.",
        features: ["Custom color options", "Texture variants", "Durable high-temp finish"],
        category: "powder-coating",
        audience: "both",
      },
      {
        title: "Powder Coating",
        description: "Functional and visual coating for long-term metal protection.",
        features: ["Corrosion resistance", "Uniform coverage", "Longer finish life"],
        category: "powder-coating",
        audience: "both",
      },
      {
        title: "Powder Coating Benefits",
        description: "Stronger wear resistance compared to conventional paint-only finish.",
        features: ["Chip resistance", "Chemical durability", "Low maintenance surface"],
        category: "powder-coating",
        audience: "both",
      },
    ],
  },
];

export const PRODUCT_CATALOG_GROUPS: ProductCatalogGroup[] = [
  {
    title: "Products for Detailers",
    description: "Professional-grade coatings for detailing teams and workshops.",
    products: [
      {
        title: "Glass / Windshield Coating",
        description: "Rain behavior and visibility enhancement for treated glass.",
        features: ["Hydrophobic action", "Highway ready", "Layer compatibility"],
        audience: "detailer",
      },
      {
        title: "Plastics Coating",
        description: "UV and fade control for textured and smooth trim.",
        features: ["Trim darkening", "Sun protection", "Wash resilience"],
        audience: "detailer",
      },
      {
        title: "Alloy Wheels Coating",
        description: "Brake dust release and wheel cleanup support.",
        features: ["Heat stable", "Dust control", "Gloss retention"],
        audience: "detailer",
      },
      {
        title: "Paint Coating",
        description: "Core ceramic stack for gloss and chemical defense.",
        features: ["Layering options", "Long-term finish", "Hydrophobic behavior"],
        audience: "detailer",
      },
      {
        title: "Leather Coating",
        description: "Cabin surface defense for seat bolsters and high-contact areas.",
        features: ["Easy maintenance", "OEM-feel finish", "Transfer resistance"],
        audience: "detailer",
      },
    ],
  },
  {
    title: "Maintenance Products for Customers",
    description: "Simple ceramic boosters to maintain protection between solutions visits.",
    products: [
      {
        title: "Solvent-Based Booster",
        description: "Performance-focused gloss and beading refresh.",
        features: ["Strong water repellency", "Deep shine top-up", "Longer hold"],
        audience: "customer",
      },
      {
        title: "Water-Based Booster",
        description: "Routine-use maintenance booster for weekly or bi-weekly care.",
        features: ["User-friendly use", "Balanced gloss", "Quick wipe finish"],
        audience: "customer",
      },
    ],
  },
];

export const BOOKING_MODES: { value: BookingMode; label: string; note: string }[] = [
  {
    value: "solutions",
    label: "Solutions Visit",
    note: "Drop your vehicle at the Nano Grit solutions bay for full-bay treatment.",
  },
  {
    value: "onsite",
    label: "Onsite Service",
    note: "Available when closed area, water, and electric facilities are present.",
  },
  {
    value: "pickup-drop",
    label: "Pickup & Drop",
    note: "Available by request based on service zone and package.",
  },
];

export const BOOKING_ELIGIBILITY_RULES: BookingEligibilityRule[] = [
  { label: "Closed area available", requiredFor: ["onsite"] },
  { label: "Water facility available", requiredFor: ["onsite"] },
  { label: "Electric facility available", requiredFor: ["onsite"] },
];

export const BOOKING_HIGHLIGHTS = [
  "Book a calendar slot request and get confirmation from our team.",
  "Next week forecast is shared based on active bay load and vehicle type.",
  "Advance/deposit is collected only after consultation and slot confirmation.",
  "Premium vehicles can be towed from customer location when required.",
];

export const SERVICES: ServiceCard[] = SERVICE_GROUPS.flatMap((group) =>
  group.services.map((service) => ({
    title: service.title,
    description: service.description,
    features: service.features,
  })),
);

export const PROCESS = [
  "Inspection & surface audit",
  "Prep wash and decontamination",
  "Paint correction and clarity pass",
  "Coating application and leveling",
  "Controlled curing protocol",
  "Final delivery under workshop light",
];

export const BENEFITS = [
  "Gloss That Holds",
  "Water Shedding Control",
  "Swirl Recovery Logic",
  "Panel-by-Panel Inspection",
];

export const STATS: StatItem[] = [
  { value: "7K+", label: "Cars Detailed", note: "Premium finish delivery" },
  { value: "3K+", label: "Bikes Coated", note: "Track and street care" },
  { value: "5Y", label: "Coating Life", note: "With maintenance plan" },
  { value: "4.9/5", label: "Client Rating", note: "Across verified feedback" },
];

export const PACKAGES: PackageCard[] = [
  {
    name: "Street Shield",
    price: "Starts at Rs 9,999",
    description:
      "Entry ceramic package for daily commuters who want easy maintenance.",
    features: ["Single-layer ceramic", "Decontamination wash", "3-month check-up"],
  },
  {
    name: "Track Gloss",
    price: "Starts at Rs 19,999",
    description:
      "Deep-gloss coating with correction stage for premium shine and clarity.",
    badge: "Most Popular",
    features: ["Two-stage correction", "Multi-layer ceramic", "Hydrophobic topcoat"],
  },
  {
    name: "Titanium Pro",
    price: "Starts at Rs 34,999",
    description:
      "High-durability package for enthusiasts keeping showroom-level finish.",
    features: [
      "Advanced correction",
      "Enhanced chemical resistance",
      "Annual inspection plan",
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The gloss looked unreal under street lights. The delivery felt like getting the car back for the first time.",
    name: "Rohit S.",
    vehicle: "Audi A4",
    location: "Bangalore",
  },
  {
    quote:
      "Water behavior changed completely after coating and the paint felt tighter, cleaner, and easier to maintain.",
    name: "Nikhil R.",
    vehicle: "Kawasaki Ninja",
    location: "Bangalore",
  },
  {
    quote:
      "Worth every rupee. The coating changed how the paint looks at night under street lights.",
    name: "Shivani K.",
    vehicle: "BMW 3 Series",
    location: "Delhi NCR",
  },
];

export const FAQS: FAQItem[] = [
  {
    question: "How does calendar booking work?",
    answer:
      "You share preferred slot and vehicle details. Our team confirms final time after workload and bay readiness checks.",
  },
  {
    question: "When do I make a payment?",
    answer:
      "A booking advance/deposit is requested only after consultation and schedule confirmation. Full service payment is done at delivery stage.",
  },
  {
    question: "What is required for onsite detailing?",
    answer:
      "Onsite service requires a closed area plus water and electric facilities. If these are unavailable, we route to solutions or pickup/drop workflow.",
  },
  {
    question: "Do you provide pickup and drop?",
    answer:
      "Yes, pickup and drop is available by request depending on package and service zone.",
  },
  {
    question: "Can premium vehicles be towed safely?",
    answer:
      "For select premium vehicles, towing from customer location to the detailing solutions bay can be arranged with prior confirmation.",
  },
  {
    question: "Can I share my own paint design idea?",
    answer:
      "Yes. Share your reference design through booking notes or WhatsApp and we will propose a custom paint or powder coating approach.",
  },
];

export const WORKS: WorkMediaItem[] = [
  {
    title: "Panel Reflection Restore",
    label: "Before to deep gloss",
    mediaType: "video",
    src: "/media/videos/work-01.mp4",
    poster: "/media/posters/work-01.jpg",
    alt: "Panel Reflection Restore",
    span: "md:col-span-4",
    heightClass: "aspect-[4/5]",
  },
  {
    title: "Correction Under Bay Light",
    label: "Swirl reduction pass",
    mediaType: "video",
    src: "/media/videos/work-02.mp4",
    poster: "/media/posters/work-02.jpg",
    alt: "Correction Under Bay Light",
    span: "md:col-span-8",
    heightClass: "aspect-video",
  },
  {
    title: "Headlamp & Edge Precision",
    label: "Clarity-focused detailing",
    mediaType: "video",
    src: "/media/videos/work-03.mp4",
    poster: "/media/posters/work-03.jpg",
    alt: "Headlamp & Edge Precision",
    span: "md:col-span-8",
    heightClass: "aspect-[5/3]",
  },
  {
    title: "Wet Surface Beading Test",
    label: "Hydrophobic finish check",
    mediaType: "video",
    src: "/media/videos/work-04.mp4",
    poster: "/media/posters/work-04.jpg",
    alt: "Wet Surface Beading Test",
    span: "md:col-span-4",
    heightClass: "aspect-[4/5]",
  },
  {
    title: "Final Finish",
    label: "Deep tone, sharp body lines, clean delivery",
    mediaType: "video",
    src: "/media/videos/work-05.mp4",
    poster: "/media/posters/work-05.jpg",
    alt: "Final Finish",
    span: "md:col-span-4",
    heightClass: "aspect-[4/5]",
  },
  {
    title: "Machine Stage",
    label: "Paint refinement in workshop light",
    mediaType: "video",
    src: "/media/videos/work-02.mp4",
    poster: "/media/posters/work-02.jpg",
    alt: "Machine Stage",
    span: "md:col-span-8",
    heightClass: "aspect-video",
  },
  {
    title: "Workshop Atmosphere",
    label: "Hands-on detailing in controlled bay",
    mediaType: "image",
    src: "/media/collage/collage-06.jpg",
    poster: "/media/collage/collage-06.jpg",
    alt: "Workshop Atmosphere",
    span: "md:col-span-8",
    heightClass: "aspect-video",
  },
  {
    title: "Gloss Line Check",
    label: "High-contrast paint inspection under bay lights",
    mediaType: "image",
    src: "/media/collage/collage-07.jpg",
    poster: "/media/collage/collage-07.jpg",
    alt: "Gloss Line Check",
    span: "md:col-span-8",
    heightClass: "aspect-video",
  },
  {
    title: "Solutions Delivery Mood",
    label: "Final handover visual after coating cure",
    mediaType: "video",
    src: "/media/videos/work-05.mp4",
    poster: "/media/posters/work-05.jpg",
    alt: "Solutions Delivery Mood",
    span: "md:col-span-4",
    heightClass: "aspect-[4/5]",
  },
];

export const CONTACT_DEFAULTS = {
  vehicleType: "Car",
  serviceGroup: SERVICE_GROUPS[0].title,
  serviceType: SERVICE_GROUPS[0].services[0].title,
  bookingMode: "solutions" as BookingMode,
};
