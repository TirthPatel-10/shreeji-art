"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import ContactForm from "./ContactForm";
import { MapPin, Phone, Mail, Clock, ArrowRight, MessageCircle } from "lucide-react";

// ─── Contact info data ────────────────────────────────────────────────────────

const INFO_ITEMS = [
  {
    icon: MapPin,
    label: "Our Location",
    value: "Ahmedabad, Gujarat — 380001, India",
    href: "https://maps.google.com/?q=Ahmedabad+Gujarat+India",
    external: true,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 99999 99999",
    href: "tel:+919999999999",
    external: false,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 99999 99999",
    href: "https://wa.me/919999999999",
    external: true,
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info@shreejiart.in",
    href: "mailto:info@shreejiart.in",
    external: false,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday – Saturday: 9:00 AM – 7:00 PM",
    subValue: "Sunday: Closed",
  },
] as const;

// ─── ContactClient ────────────────────────────────────────────────────────────

export default function ContactClient() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      {/*
        TODO: Replace the gradient hero with a real photo of a premium signage
        installation (English only — e.g. an LED storefront, acrylic office sign,
        or 3D letter installation). Place the image in /public/images/contact-hero.jpg
        and swap the <div> below for:
          <div className="relative h-[480px] ...">
            <Image src="/images/contact-hero.jpg" alt="..." fill className="object-cover" />
            <div className="absolute inset-0 bg-brand-navy/70" />
            ... content ...
          </div>
      */}
      <section className="relative overflow-hidden bg-brand-navy py-28 md:py-36">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-gold/4 blur-3xl" />
          {/* Dot grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="contact-hero-dots"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#D4A017" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-hero-dots)" />
          </svg>
          {/* Logo watermark — right side, desktop only */}
          <div className="absolute right-[6%] top-1/2 -translate-y-1/2 hidden xl:block opacity-[0.12] pointer-events-none select-none">
            <Image
              src="/shreeji-final-logo.png"
              alt=""
              width={180}
              height={180}
              aria-hidden="true"
              className="rounded-full object-cover"
            />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimateIn from="bottom" duration={600}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse-subtle" />
              Get In Touch
            </span>
          </AnimateIn>

          <AnimateIn from="bottom" delay={80} duration={650}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Contact{" "}
              <span className="text-brand-gold">Shreeji Art</span>
            </h1>
          </AnimateIn>

          <AnimateIn from="bottom" delay={160} duration={650}>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Let&apos;s create premium signage that helps your business stand out.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Main: Info + Form ─────────────────────────────────────────────────── */}
      <section className="bg-[#f7f8fb] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">

            {/* Left — dark navy info card */}
            <AnimateIn from="bottom" duration={600}>
              <div className="bg-brand-navy rounded-3xl p-8 md:p-10 h-full">
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  Let&apos;s work together
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                  Have a project in mind? Reach out through any of the channels
                  below — we respond within 24 hours on working days.
                </p>

                {/* Info items */}
                <ul className="space-y-6">
                  {INFO_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const inner = (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-5 h-5 text-brand-gold" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                            {item.label}
                          </p>
                          <p className="text-sm font-medium text-white leading-snug">
                            {item.value}
                          </p>
                          {"subValue" in item && item.subValue && (
                            <p className="text-sm text-gray-400 mt-0.5">
                              {item.subValue}
                            </p>
                          )}
                        </div>
                      </div>
                    );

                    if ("href" in item && item.href) {
                      return (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            className="block hover:opacity-75 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-xl"
                          >
                            {inner}
                          </a>
                        </li>
                      );
                    }
                    return <li key={item.label}>{inner}</li>;
                  })}
                </ul>

                {/* Quick-action buttons */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] motion-reduce:transition-none"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                  <a
                    href="mailto:info@shreejiart.in"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm font-semibold hover:bg-brand-gold/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    Send Email
                  </a>
                </div>
              </div>
            </AnimateIn>

            {/* Right — white form card */}
            <AnimateIn from="bottom" delay={100} duration={600}>
              <div className="bg-white rounded-3xl shadow-sa-xl border border-gray-100 p-8 md:p-10">
                <h2 className="font-display text-2xl font-bold text-brand-navy mb-1">
                  Send us a message
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  Fill out the form and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </AnimateIn>

          </div>
        </div>
      </section>

      {/* ── Google Map ───────────────────────────────────────────────────────── */}
      {/*
        Replace the embed src with your exact business address embed URL.
        Get it from: Google Maps → search your address → Share → Embed a map → copy src.
        Current placeholder shows Ahmedabad, Gujarat.
      */}
      <div className="w-full h-80 md:h-[420px] bg-gray-100">
        <iframe
          title="Shreeji Art — Ahmedabad, Gujarat"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.9644009797!2d72.43773985!3d23.020673799999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1705000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimateIn from="bottom" duration={600}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to transform your business signage?
            </h2>
          </AnimateIn>
          <AnimateIn from="bottom" delay={80} duration={600}>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Get a detailed quote tailored to your project — expert advice and
              transparent pricing, no obligation.
            </p>
          </AnimateIn>
          <AnimateIn from="bottom" delay={160} duration={600}>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-brand-gold text-white font-semibold text-base hover:bg-brand-gold/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-brand-gold/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
            >
              Request a Free Quote
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
