/* AMDA site content — defaults, mirrors guide.md.
   Homepage + About + Admin all read from here.
   Admin edits are published to the server (DATA_DIR/site-content.json) and merged
   over these defaults, so a missing or partial file always falls back to this one. */

export const CONTENT_VERSION = 2;
// Old per-browser draft key. Only read once by the admin to offer recovering
// edits made before content moved to the server.
export const LEGACY_CONTENT_STORAGE_KEY = "amda-content-v1";

export type VisualPackage = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  formUrl: string; // Google Form link for "Get Started"; empty = contact section
};

export type ComplianceRow = { label: string; value: string };

export type TestimonialItem = {
  id: string;
  client: string;
  project: string;
  kind: "written" | "screenshot" | "photo" | "video" | "audio" | "delivery" | "training" | "outreach";
  quote?: string;
  media?: string; // /public path or remote URL; empty = placeholder
  date?: string;
};

/** Answer paragraphs are separated by a blank line. */
export type FaqItem = { q: string; a: string };

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo: string; // /public path; empty = initials monogram
  linkedin?: string;
};

export type SiteContent = {
  hero: {
    tag: string;
    titleA: string;
    titleAccent1: string;
    titleB: string;
    titleAccent2: string;
    titleC: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    backgroundImage: string; // e.g. "/AMDA TEAM.png" — empty = gradient only
  };
  whoWeAre: {
    heading: string;
    sub: string;
    body: string[];
  };
  story: {
    heading: string;
    headline: string;
    body: string[];
  };
  vision: string;
  mission: string;
  coreValues: string[];
  whoWeServe: string[];
  packages: VisualPackage[];
  cac: {
    title: string;
    summary: string;
    rows: ComplianceRow[];
  };
  trademark: {
    title: string;
    summary: string;
    rows: ComplianceRow[];
    priceLabel: string;
  };
  complianceAudit: {
    title: string;
    summary: string;
    price: string;
    formUrl: string; // Google Form link — empty = placeholder button
  };
  printPublish: {
    title: string;
    summary: string;
    items: string[];
  };
  whyChoose: { title: string; body: string }[];
  faqs: FaqItem[];
  operatingModel: { title: string; body: string }[];
  responseTime: string;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  coverage: string;
  socials: { linkedin: string; instagram: string; facebook: string; tiktok: string };
  founder: {
    name: string;
    title: string;
    bio: string;
    photo: string; // "/founderimage.png"
    linkedin: string;
  };
  team: TeamMember[];
  testimonials: TestimonialItem[];
  clientCount: string; // empty = "to be announced" placeholder (guide: do not invent)
};

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    tag: "Brand Strategy & Compliance Advisory",
    titleA: "Building",
    titleAccent1: "Scalable",
    titleB: "and",
    titleAccent2: "Protected",
    titleC: "Brands",
    sub: "A brand strategy, experience, and compliance advisory firm helping businesses build brands that are clear, credible, scalable, and legally protected.",
    primaryCta: "Start Your Project",
    secondaryCta: "Explore Services",
    backgroundImage: "/hero-bg.webp",
  },
  whoWeAre: {
    heading: "A Brand Building, Protection & Business Solutions Company",
    sub: "AMDA Global Solutions helps businesses, professionals, organizations, and creators build brands that are clear, credible, scalable, and protected.",
    body: [
      "We bring together brand strategy and visual identity, brand protection and compliance support, printing, and publishing to help our clients establish their identity, formalize and protect what they build, and present their work professionally.",
      "Our work serves startups and SMEs, established businesses, personal brands and professionals, organizations and NGOs, authors and aspiring authors, publishers, and other creators who need dependable support in building and presenting their brands or publications.",
      "From brand development and consultancy to business registration and compliance support, trademark and brand protection, commercial printing, book printing and publishing, AMDA provides practical solutions that help clients move from an idea or identity to a properly established and professionally presented brand or publication.",
    ],
  },
  story: {
    heading: "Our Story",
    headline: "We learned it the hard way, so other businesses don't have to.",
    body: [
      "AMDA Global Solutions was born from our experience of discovering the gap between branding, compliance, brand protection, and printing: services that are often treated separately, even though they are closely connected in the life of a business.",
      "Our journey began in the printing industry, where our founder worked as a graphics designer while learning the business of printing. As we worked with more businesses on logos and visual identities, we began to understand that building a brand goes far beyond creating something that looks good.",
      "We saw businesses invest in branding without first considering whether their names could be properly registered or protected. Some assumed that registering with the Corporate Affairs Commission was enough, only to discover later that there were other important steps involved in properly building and protecting their brands.",
      "Then, we experienced the problem ourselves. After establishing a design agency, our registered business name was revoked by the Corporate Affairs Commission shortly after we had invested in branding and launched the business. That experience pushed us to learn more about the relationship between branding, compliance, and brand protection, and showed us how costly avoidable mistakes can be.",
      "That experience became the foundation of AMDA. Today, we bring branding, printing and publishing, compliance support, and brand protection together, giving businesses access to connected solutions under one roof.",
      "Our goal is simple: to help businesses build intentionally, avoid preventable mistakes, protect what they build, and present themselves professionally as they grow.",
    ],
  },
  vision: "To become the number one trusted African brand partner.",
  mission: "To help businesses build intentional, sustainable, and protected brands.",
  coreValues: ["Integrity", "Excellence", "Impact"],
  whoWeServe: [
    "Startups and SMEs",
    "Established businesses",
    "Personal brands and professionals",
    "NGOs and organisations",
    "Authors and publishers",
    "Creators and public-facing professionals",
  ],
  packages: [
    {
      id: "starter",
      name: "Starter Package",
      price: "₦20,000",
      description: "Perfect for businesses starting their brand journey.",
      features: ["Brand Audit", "Consultation", "Recommendations"],
      cta: "Get Started",
      formUrl: "",
    },
    {
      id: "growth",
      name: "Growth Package",
      price: "₦70,000",
      description: "Ideal for businesses ready to level up their brand.",
      features: [
        "Brand & Visual Identity",
        "2 Social Media Designs with Captions",
        "30-Day Content Plan",
      ],
      cta: "Get Started",
      formUrl: "",
    },
    {
      id: "authority",
      name: "Authority Package",
      price: "₦150,000",
      description: "A complete brand system for established companies and businesses.",
      features: [
        "Full Brand System",
        "Brand Positioning Strategy",
        "6 Weeks of Content Support",
      ],
      cta: "Get Started",
      formUrl: "",
    },
  ],
  cac: {
    title: "Business Name Registration (CAC)",
    summary:
      "Register your business correctly with the Corporate Affairs Commission and start operating with confidence.",
    rows: [
      { label: "Business Name Registration", value: "₦35,000 – ₦45,000" },
      { label: "Incorporated Trustee (NGO, Church, Mosque etc.)", value: "₦130,000 – ₦150,000" },
      { label: "Limited Liability Company", value: "₦75,000 – ₦100,000" },
      { label: "Other Registration Types", value: "Contact us for pricing" },
    ],
  },
  trademark: {
    title: "Trademark Registration & Advisory",
    summary:
      "Secure ownership of your brand identity through proper trademark search, application, and protection guidance.",
    rows: [
      { label: "Trademark Search & Analysis", value: "Included" },
      { label: "Application Support", value: "Included" },
      { label: "Brand Protection & Guidance", value: "Included" },
      { label: "Partnership with Licensed Professionals", value: "Included" },
      { label: "Acknowledgement Letter, Acceptance Letter & Certificate", value: "Included" },
    ],
    priceLabel: "₦120,000 – ₦150,000",
  },
  complianceAudit: {
    title: "Brand Compliance Check & Audit",
    summary:
      "Full compliance audit of your brand: naming, registration, protection gaps, and next steps.",
    price: "₦20,000",
    formUrl: "",
  },
  printPublish: {
    title: "Print & Publish",
    summary:
      "Commercial printing, books, magazines and corporate materials, plus publishing support from manuscript to finished copy.",
    items: [
      "Commercial Printing",
      "Books",
      "Magazines",
      "Corporate Materials",
      "Publishing Support",
    ],
  },
  whyChoose: [
    { title: "End-to-End Support", body: "One accountable team from idea to launch: strategy, identity, compliance and print." },
    { title: "From Business Idea to Industry Leadership", body: "We meet you where you are and build with you as you grow." },
    { title: "One Trusted Partner", body: "No juggling vendors. Branding, compliance, publishing and business support under one roof." },
    { title: "Branding, Compliance, Publishing & Business Support Under One Roof", body: "Connected solutions instead of disconnected suppliers." },
    { title: "Professional Execution", body: "Systems, timelines and documentation you can rely on." },
    { title: "Long-Term Relationship Approach", body: "We build for durability and stay with you after launch." },
    { title: "Affordable & Scalable Solutions", body: "Clear packages that start small and scale with your ambition." },
  ],
  faqs: [
    {
      q: "What services does AMDA provide?",
      a: "AMDA Global Solutions provides services across five key areas: Branding, Protection, Compliance, Printing, and Publishing.",
    },
    {
      q: "Which package is right for my business?",
      a: "Our packages are designed to meet different business needs and stages. If you are unsure which package is right for you, we recommend starting with a consultation. We will understand your needs and recommend the most suitable service or package.",
    },
    {
      q: "What is included in the displayed price?",
      a: "The displayed price includes AMDA's service charge and applicable government or statutory fees. Where pricing varies based on specific requirements, such as the type or share capital of a company registration, the applicable price will be confirmed before proceeding.",
    },
    {
      q: "How long does the process take?",
      a: "Our response time is typically 1–12 hours. The actual completion time depends on the specific service and, where applicable, the processing time of the relevant government or regulatory body.",
    },
    {
      q: "What documents or information do I need to provide?",
      a: "Requirements vary depending on the service you need. Simply select the service you are interested in and complete the relevant enquiry form. The form will provide the information and documents required for that service.",
    },
    {
      q: "What happens if my business name is rejected or a trademark search finds a conflict?",
      a: "We recommend starting with a consultation so we can assess your proposed name before proceeding. Where a business name is rejected, we can provide alternative names and guide you through the next step. If a trademark search identifies an existing or conflicting mark, we will inform you and recommend suitable alternatives. Trademark/name search fees are non-refundable.",
    },
    {
      q: "Who owns the final brand assets?",
      a: "Upon full payment, the client owns the final approved brand designs and assets covered by the project. However, AMDA retains the right to showcase completed projects in its portfolio, website, social media, and other promotional materials, unless otherwise agreed with the client.",
    },
    {
      q: "Is AMDA a law firm?",
      a: "No. AMDA Global Solutions is not a law firm. We provide business and compliance advisory services and work with certified legal professionals where legal services are required.",
    },
    {
      q: "Can I visit the AMDA office?",
      a: "Yes. Customers are welcome to visit our physical office without an appointment.\n\nOffice Address:\nNo. 5 H Plaza, Beside NNPC Filling Station, New Nyanya, Karu, Nasarawa State, Nigeria.",
    },
    {
      q: "How does the enquiry process work?",
      a: "Simply select the service you need and complete the relevant enquiry form. We will review your enquiry, understand your needs, recommend the appropriate service or package, and guide you through the next steps.",
    },
  ],
  operatingModel: [
    {
      title: "Online & In-Person Support",
      body: "AMDA now operates with both online support and a physical office.",
    },
    {
      title: "Partner-Based Model",
      body: "We collaborate with licensed professionals and industry experts to deliver comprehensive solutions.",
    },
    {
      title: "System & Accountability",
      body: "We prioritize professional systems and accountability, ensuring transparent communication throughout.",
    },
  ],
  responseTime: "1–12 hours",
  address: "No. 5 H Plaza, Beside NNPC Filling Station, New Nyanya, Karu, Nasarawa State, Nigeria.",
  phone: "+234 707 779 8418",
  phoneHref: "tel:+2347077798418",
  email: "info@amdaglobal.com",
  coverage: "Nigeria & International (Africa)",
  socials: {
    linkedin: "https://www.linkedin.com/company/amdaglobal/",
    instagram: "https://www.instagram.com/amdaglobal/",
    facebook: "https://www.facebook.com/share/1Hyg3JTeDU/",
    tiktok: "https://www.tiktok.com/@amdaglobal",
  },
  founder: {
    name: "Jesse Hosea",
    title: "Founder & Creative Director, AMDA Global Solutions Ltd",
    bio: "Jesse Hosea is a branding consultant, creative professional, AI enthusiast, and entrepreneur with experience spanning branding, graphic design, printing, business development, and capacity building. With a background in Economics Education and several years of practical experience in the creative and printing industry, Jesse founded AMDA Global Solutions to help businesses build brands that are not only visually compelling but also properly positioned, protected, and prepared for growth. Through AMDA, he combines creativity, strategy, technology, and compliance to help businesses build stronger and more professional brands.",
    photo: "/founder.webp",
    linkedin: "https://www.linkedin.com/in/jessehosea/",
  },
  team: [],
  testimonials: [
    {
      id: "t-written-1",
      client: "Client Name",
      project: "Brand Identity",
      kind: "written",
      quote: "Testimonial placeholder: AMDA will supply written testimonials, screenshots, photos, video and voice-note testimonials. This card shows the written format.",
    },
    {
      id: "t-screenshot-1",
      client: "Client Name",
      project: "Compliance Support",
      kind: "screenshot",
      quote: "Screenshot testimonial placeholder: swap the media field with a real testimonial screenshot.",
      media: "/testimonial-outreach.webp",
    },
    {
      id: "t-delivery-1",
      client: "Chima Ariel Onoka",
      project: "Book Publishing: MULTIPLY",
      kind: "delivery",
      quote: "Book design and bulk print delivery for MULTIPLY.",
      media: "/newprojects/print-multiply-book.webp",
    },
    {
      id: "t-delivery-2",
      client: "Toko Academy",
      project: "KSCC 2026 Booklet",
      kind: "delivery",
      quote: "Kids Summer Coding Camp 2026 booklet: design and print run.",
      media: "/newprojects/print-toko-academy.webp",
    },
    {
      id: "t-delivery-3",
      client: "Victor Ajiboye",
      project: "Book Publishing: Edge of Exposure",
      kind: "delivery",
      quote: "Cover design and print delivery for Edge of Exposure.",
      media: "/newprojects/print-edge-exposure.webp",
    },
    {
      id: "t-photo-1",
      client: "NAF Protestant Sunday School",
      project: "Custom Apparel",
      kind: "photo",
      quote: "Custom branded tees for NAF Protestant Sunday School Teachers.",
      media: "/newprojects/brand-naf-sunday-shirts.webp",
    },
    {
      id: "t-video-1",
      client: "Client Name",
      project: "Brand Strategy",
      kind: "video",
      quote: "Video testimonial: tap play to watch.",
      media: "/testimonials/amda-testimonial-1.mp4",
    },
    {
      id: "t-audio-1",
      client: "Client Name",
      project: "Publishing Support",
      kind: "audio",
      quote: "Voice-note testimonial placeholder: upload the client voice note in admin.",
      media: "",
    },
  ],
  clientCount: "",
};
