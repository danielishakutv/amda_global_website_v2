# AMDA Global Solution — Next.js Website Build Prompt

## Project Overview

Build a modern, bold, fully responsive **single-page scrolling website** for **AMDA Global Solution** using **Next.js 14+ (App Router)** with **Tailwind CSS**. The website should feel premium, confident, and trustworthy — this is a brand strategy, experience, and compliance advisory firm serving businesses across Nigeria and Africa.

**Reference site for scroll behavior and layout flow:** https://scalingideasacademy.com/ — study its one-way scroll pattern where all content lives on a single page with smooth section transitions. The AMDA site should follow this single-page scroll structure but with far superior design quality — bolder typography, stronger visual hierarchy, and more polished aesthetics.

---

## Design Direction

### Aesthetic: Bold Editorial Meets African Luxury

- **NOT generic corporate.** This should feel like a premium brand consultancy — confident, intentional, sophisticated.
- Think: editorial magazine layout meets luxury brand presentation. Clean but bold. Structured but dynamic.
- Dark sections alternating with light sections to create visual rhythm as users scroll.
- Use generous whitespace, asymmetric layouts, and oversized typography for impact.

### Color Palette

- **Primary:** Deep Navy / Midnight Blue (`#0A1628` or similar dark tone)
- **Accent:** Rich Gold / Amber (`#C8952E` or warm gold — conveys trust, premium quality)
- **Secondary:** Clean White (`#FFFFFF`) and Light Gray (`#F5F5F0`)
- **Text:** Off-white on dark backgrounds, dark navy on light backgrounds
- **Subtle accents:** Muted teal or emerald for hover states and micro-interactions
- Use CSS variables for all colors for easy theming

### Typography

- **Display / Headings:** Use a distinctive serif or display font — something bold and memorable (e.g., `Playfair Display`, `DM Serif Display`, `Fraunces`, or `Clash Display`). NOT Inter, Roboto, or Arial.
- **Body:** A refined sans-serif (e.g., `DM Sans`, `Outfit`, `Plus Jakarta Sans`, or `General Sans`)
- **Accent / Labels:** A condensed or monospace for section tags and badges
- Import from Google Fonts via `next/font`
- Headings should be large and commanding — 48px+ on desktop for main section headings

### Motion & Interactions

- Smooth scroll between sections with scroll-snap or smooth-scroll behavior
- Staggered fade-in/slide-up animations on scroll using Framer Motion or CSS intersection observer
- Subtle parallax on hero background elements
- Hover effects on service cards (lift, glow, or border highlight)
- Animated counter/stats in the hero section
- Mobile: reduce motion for performance, keep essential transitions

### Layout Principles

- Full-viewport hero section
- Alternating section backgrounds (dark/light/dark) for visual rhythm
- Use CSS Grid and Flexbox for complex layouts
- Cards with subtle glassmorphism or soft shadows on light backgrounds
- Decorative elements: subtle gradient orbs, dotted patterns, or geometric accents (not overdone)

---

## Site Structure (Single-Page Sections)

All sections live on one page with smooth scroll navigation. The navbar links scroll to each section using anchor IDs.

### Section Order:
1. **Navigation Bar** (fixed/sticky)
2. **Hero Section**
3. **About Section**
4. **Why Choose AMDA (Brand Pillars)**
5. **Services Section** (with interactive tabs and expandable sub-services)
6. **How We Work (Process)**
7. **Contact Section**
8. **Footer**

---

## Section-by-Section Content & Requirements

### 1. Navigation Bar

- **Fixed/sticky** at top, with blur-glass background on scroll
- Logo text: "AMDA" (bold/display font) + "Global Solution" (lighter weight)
- Nav links: About | Services | How We Work | Contact
- CTA button: "Get Started" (gold accent, links to contact section)
- Mobile: hamburger menu with full-screen overlay or slide-in drawer
- On scroll, navbar should get a subtle background/shadow

### 2. Hero Section

- Full viewport height (`100vh`)
- Badge/tag above heading: "Brand Strategy & Compliance Advisory"
- Main heading: **"Building Scalable and Protected Brands"**
- Subheading: "A brand strategy, experience, and compliance advisory firm helping businesses build brands that are clear, credible, scalable, and legally protected."
- Two CTA buttons: "Start Your Project" (primary/gold) | "Explore Services" (outlined/secondary)
- Stats row with animated counters:
  - "100+" → "Brands Built"
  - "Africa" → "Service Coverage"
  - "360°" → "Brand Solutions"
- Two feature preview cards at the bottom of hero:
  - **Card 1 — Brand Strategy & Experience:** "Define who you are, how you communicate, and how you show up across all touchpoints." Tags: Brand Identity • Content Strategy • Print Materials
  - **Card 2 — Brand Protection & Compliance:** "Preventive brand protection and compliance services to help businesses build legally safe brands." Tags: Trademark Support • Brand Governance • Risk Assessment
- Background: subtle gradient, geometric pattern, or abstract shapes — NOT a stock photo

### 3. About Section

- Section tag: "About Us"
- Heading: **"Who We Are"**
- Subheading: "A Brand Strategy, Experience & Compliance Advisory Firm"
- Body text (two paragraphs):
  - "AMDA Global Solution is helping businesses build brands that are clear, credible, scalable, and legally protected. We work with startups, SMEs, personal brands, and growing organizations across Nigeria and Africa."
  - "We sit at the intersection of branding, strategy, and brand protection. Our services ensure that brands are not only visually appealing, but also strategically positioned and legally secure for long-term growth."
- Highlight badges: "Nigeria & Africa" | "Remote-First"
- Vision block: "To become the number one trusted African brand partner."
- Mission block: "To help businesses build intentional, scalable, and protected brands through strategy-led thinking, creative excellence, and compliance-aligned solutions."
- Service coverage banner at bottom:
  - "Serving Businesses Across Nigeria & International Markets"
  - "We operate as a lean, remote-first agency with a partner-based service model, prioritizing systems, professionalism, and accountability for efficient service delivery."
  - CTA: "Let's Work Together"

### 4. Why Choose AMDA (Brand Pillars)

- Section tag: "Why Work With Us"
- Heading: **"Why Choose AMDA"**
- Intro: "We bring together strategy, creativity, and compliance to build brands that stand the test of time."
- 6 pillar cards in a grid (2x3 on desktop, stacked on mobile), each with an icon, title, and description:

  1. **Strategy-First Approach** — "Every brand solution begins with deep strategy. We don't just create visuals—we build intentional brand systems designed for growth."
  2. **Compliance-Aware Building** — "We integrate brand protection from day one, ensuring your brand is not only beautiful but legally secure and sustainable."
  3. **Clear Service Boundaries** — "Professional systems with transparent processes. You always know what to expect, when to expect it, and how we'll deliver."
  4. **Partner-Driven Expertise** — "We collaborate with licensed professionals and industry experts to deliver comprehensive solutions across all touchpoints."
  5. **Transparent Communication** — "Open, honest, and accountable communication throughout every project. No surprises, just results."
  6. **Client-Centric Focus** — "Your success is our success. We work as an extension of your team, invested in your brand's long-term growth."

- Bottom CTA: "Explore Our Services"

### 5. Services Section ⚠️ (CRITICAL — Read Carefully)

This is the most complex section. It has **two main tabs** and each tab contains **expandable/clickable sub-services** with pricing details.

- Section tag: "What We Do"
- Heading: **"Our Services"**
- Intro: "Comprehensive solutions ensuring your brand is visually appealing, strategically positioned, and legally secure for long-term growth."

#### Tab System

Two main tabs that switch content:

---

#### TAB 1: "Branding & Experience"

Tab description: "We help brands define who they are, how they communicate, and how they show up across all touchpoints."

**Three pricing packages displayed as cards:**

| Package | Price | Description | Features |
|---------|-------|-------------|----------|
| **Starter Package** | ₦20,000 | Perfect for businesses starting their brand journey | Brand audit, Content direction, 2 social media designs |
| **Growth Package** ⭐ MOST POPULAR | ₦40,000 | Ideal for businesses ready to level up their brand | Brand refresh or identity, 4 social media designs with captions, 30-day content plan |
| **Authority Package** | ₦60,000 | Complete brand system for established businesses | Full brand system, Brand positioning strategy, 6 weeks of content support |

Each card should have a "Get Started" CTA button.

**Additional Branding Services** (listed below the packages):
- Brand strategy & positioning
- Brand identity systems & guidelines
- Content direction & communication frameworks
- Printing of branded materials

---

#### TAB 2: "Brand Protection & Compliance"

Tab description: "Preventive brand protection and compliance services delivered in partnership with licensed legal professionals."

**⚠️ IMPORTANT UX REQUIREMENT:** This tab should show **4 clickable service categories** (not just 3 packages). When a user clicks a category, it expands or opens a modal/drawer showing the detailed pricing breakdown for that service.

**The 4 clickable service categories are:**

**1. Business Name Registration (CAC)** — When clicked, show pricing details:
   - Business Name Registration = ₦35,000
   - Limited Liability Company (1 million shares) = ₦110,000
   - *(Add placeholder rows for any other registration types — label them "Contact us for pricing" if specific prices aren't provided)*

**2. Trademark Registration & Advisory** — When clicked, show pricing details:
   - Trademark Search and Analysis
   - Application Support
   - Brand Protection Guidance
   - Partnership with licensed professionals
   - Price range: ₦120,000 – ₦150,000
   - *(Use the existing Trademark & Brand Protection package details)*

**3. Brand Compliance Checks & Audits** — When clicked, show pricing details:
   - Full compliance audit
   - Governance framework
   - Ongoing advisory support
   - Legal partnership coordination
   - Price: ₦250,000+
   - *(Use existing Brand Compliance & Governance package details)*

**4. Documentation & Regulatory Guidance** — When clicked, show:
   - Brand Name Availability Check
   - Risk Assessment Report
   - Recommendations for brand protection
   - Price: ₦40,000
   - *(Use existing Brand Name & Risk Check package details)*

**Design for the expandable sub-services:**
- Show the 4 categories as clickable cards or accordion items
- On click, smoothly expand to reveal the pricing table and details
- Each expanded view should have a "Get Started" CTA
- Use animation for the expand/collapse transition

**Compliance Note** (shown below the tab content):
> "Our compliance services help brands avoid infringement, secure ownership, and operate with confidence. All legal and trademark-related services are provided as advisory and facilitative support in collaboration with licensed legal practitioners."

**Custom Project CTA:**
"Need a custom solution? Let's discuss your project" → links to contact section

---

### 6. How We Work (Process)

- Section tag: "Our Process"
- Heading: **"How We Work"**
- Intro: "A systematic approach to building brands that are intentional, scalable, and protected."

**5-step process displayed as a vertical timeline or horizontal stepper:**

1. **Discovery & Consultation** — "We begin by understanding your business, goals, target audience, and current brand positioning through in-depth conversations."
2. **Strategy Development** — "Based on our discovery, we develop a comprehensive brand strategy that aligns with your business objectives and market positioning."
3. **Creative Execution** — "Our team brings the strategy to life through creative design, content development, and brand identity systems."
4. **Implementation & Launch** — "We help implement your brand across all touchpoints—digital, print, and physical—ensuring consistency and impact."
5. **Review & Optimize** — "Post-launch, we review performance, gather feedback, and provide recommendations for continuous brand improvement."

**Operating Model** (3 cards below the timeline):
1. **Remote-First** — "We operate as a lean, remote-first agency, enabling efficient service delivery without geographical limitations."
2. **Partner-Based Model** — "We collaborate with licensed professionals and industry experts to deliver comprehensive solutions."
3. **Systems & Accountability** — "We prioritize professional systems and accountability, ensuring transparent communication throughout."

CTA: "Start Your Project"

### 7. Contact Section

- Section tag: "Get In Touch"
- Heading: **"Let's Build Your Brand"**
- Intro: "Ready to create a brand that's clear, credible, scalable, and legally protected? Let's start the conversation."

**Two-column layout:**

**Left column — Contact info:**
- Phone: +234 707 779 8418
- Email: info@amdaglobal.com
- Address: No. 19, Famous Street, Ushafa, Abuja, Nigeria
- Service Coverage: Nigeria & International (Africa)
- Quick Response badge: "We typically respond within 24-48 hours. Urgent? Call us directly."

**Right column — Contact form:**
- Fields: Full Name*, Email*, Phone Number, Service Interested In* (dropdown), Project Description*
- Dropdown options: Branding - Starter Package, Branding - Growth Package, Branding - Authority Package, Business Name Registration (CAC), Trademark Registration & Advisory, Brand Compliance & Audits, Documentation & Regulatory Guidance, Custom Project
- Submit button: "Send Message"
- Success state: "Message Sent! Thank you for reaching out. We'll get back to you shortly."
- The form should use React state for validation and submission feedback (no backend needed — just UI)

### 8. Footer

- Brand block: "AMDA — Global Solution" + tagline
- Services column: Brand Strategy, Brand Identity, Content Direction, Print Materials, Trademark Support, Brand Compliance
- Company column: About Us, Our Services, How We Work, Contact
- Contact column: Phone, Email, Address
- Social links: LinkedIn, Instagram, Facebook, Twitter (use icons, link to `#`)
- Legal disclaimer: "AMDA Global Solution is not a law firm. All legal and trademark-related services are provided as advisory and facilitative support in collaboration with licensed legal practitioners. Court representation and statutory fees are not included unless otherwise stated."
- Copyright: "© 2026 AMDA Global Solution. All rights reserved."

---

## Floating WhatsApp Button

- Fixed bottom-right floating button
- Opens a small chat widget/popover with:
  - Header: "AMDA Global Solution — Typically replies instantly"
  - Message bubble: "👋 Hi there! How can we help you build your brand today? — AMDA Team"
  - Input field with placeholder: "Type your message..."
- On send, opens WhatsApp web/app with the message pre-filled
- WhatsApp number: +2347077798418
- Default message if blank: "Hello! I would like to inquire about your services."

---

## Technical Requirements

### Stack
- **Next.js 14+** with App Router (`/app` directory)
- **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations (scroll-triggered reveals, hover effects, tab transitions)
- **React Icons** or **Lucide React** for icons
- **next/font** for Google Fonts optimization

### Project Structure
```
/app
  layout.tsx          — Root layout with fonts, metadata
  page.tsx            — Single page with all sections
  globals.css         — Tailwind config + CSS variables + custom styles
/components
  Navbar.tsx
  Hero.tsx
  About.tsx
  WhyChoose.tsx
  Services.tsx        — Tab system + expandable sub-services
  HowWeWork.tsx
  Contact.tsx
  Footer.tsx
  WhatsAppWidget.tsx
  /ui                 — Reusable components (Button, Card, SectionTag, AnimatedCounter, etc.)
```

### Performance & SEO
- Full SEO metadata in layout.tsx (title, description, Open Graph tags matching the existing metadata)
- Semantic HTML throughout (proper heading hierarchy, landmarks, aria labels)
- Lazy load below-fold sections
- Optimize images with `next/image` if any are used
- Responsive breakpoints: mobile (< 640px), tablet (640-1024px), desktop (1024px+)
- Ensure all text is readable and all buttons are tappable on mobile

### Accessibility
- Proper focus management for tab system
- Keyboard navigation for all interactive elements
- Sufficient color contrast ratios
- Screen reader friendly section landmarks

---

## Summary of Key Design Decisions

1. **Single-page scroll** — All content on one page, navbar links scroll to sections
2. **Bold typography** — Large display headings, distinctive font pairing
3. **Dark/light alternating sections** — Creates visual rhythm and depth
4. **Interactive services section** — Tabs for two service categories, expandable sub-services with pricing in the Brand Protection tab
5. **Gold accent on dark navy** — Premium, trustworthy feel appropriate for a compliance-aware brand firm
6. **Smooth animations** — Scroll-triggered reveals, animated counters, hover effects
7. **WhatsApp integration** — Floating chat widget for instant customer contact
8. **Mobile-first responsive** — Every section must look great on phones

---

## What NOT to Do

- Do NOT use generic stock photos or placeholder images — use abstract shapes, gradients, and geometric patterns instead
- Do NOT use Inter, Roboto, or Arial as fonts
- Do NOT make it look like a generic WordPress template
- Do NOT use purple gradients on white backgrounds
- Do NOT skip the expandable sub-service pricing in the Brand Protection tab — this is a specific requirement from the CEO
- Do NOT hardcode colors — use CSS variables / Tailwind theme extensions
- Do NOT forget the legal disclaimer in the footer
- Do NOT make the WhatsApp widget intrusive — it should be subtle until clicked
