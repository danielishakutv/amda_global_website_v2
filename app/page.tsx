import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

// Perf-only code-splitting: same content, same SSR HTML, but below-fold
// sections ship as separate JS chunks so the hero paints with less JS.
// Only Navbar + Hero stay in the critical bundle.
const WhoWeServe = dynamic(() => import("@/components/WhoWeServe").then((m) => m.WhoWeServe));
const About = dynamic(() => import("@/components/About").then((m) => m.About));
const WhyChoose = dynamic(
  () => import("@/components/WhyChoose").then((m) => m.WhyChoose)
);
const Services = dynamic(
  () => import("@/components/Services").then((m) => m.Services)
);
const HowWeWork = dynamic(
  () => import("@/components/HowWeWork").then((m) => m.HowWeWork)
);
const Testimonials = dynamic(
  () => import("@/components/Testimonials").then((m) => m.Testimonials)
);
const Founder = dynamic(() => import("@/components/Founder").then((m) => m.Founder));
const Faq = dynamic(() => import("@/components/Faq").then((m) => m.Faq));
const Contact = dynamic(
  () => import("@/components/Contact").then((m) => m.Contact)
);
const Footer = dynamic(() => import("@/components/Footer").then((m) => m.Footer));
const WhatsAppWidget = dynamic(
  () => import("@/components/WhatsAppWidget").then((m) => m.WhatsAppWidget),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhoWeServe />
        <Services />
        <WhyChoose />
        <HowWeWork />
        <Testimonials />
        <About />
        <Founder />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
