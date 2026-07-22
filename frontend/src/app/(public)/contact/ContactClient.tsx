"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import { SITE_CONTACT } from "@/lib/contact";
import ContactForm from "./ContactForm";

const CONTACT_ITEMS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE_CONTACT.phone,
    href: SITE_CONTACT.whatsappHref,
    external: true,
  },
  {
    icon: Phone,
    label: "Phone",
    value: SITE_CONTACT.phone,
    href: SITE_CONTACT.phoneHref,
    external: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONTACT.email,
    href: SITE_CONTACT.emailHref,
    external: false,
  },
  {
    icon: MapPin,
    label: "Address",
    value: SITE_CONTACT.address,
    href: SITE_CONTACT.mapsHref,
    external: true,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: SITE_CONTACT.businessHours,
  },
] as const;

export default function ContactClient() {
  return (
    <>
      <Navbar />

      <main className="bg-[#FAF8F2] text-[#121426]">
        <section className="relative isolate min-h-[360px] overflow-hidden bg-[#121426] pt-24 text-white sm:min-h-[390px] lg:min-h-[420px]">
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#121426_0%,#121426_48%,#181B31_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(217,165,20,0.12)_0_1px,transparent_1px_100%),linear-gradient(0deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_100%)] bg-[size:96px_96px] opacity-20"
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[46%] overflow-hidden md:block">
            <div
              className="absolute right-[-14%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#D9A514]/20 blur-3xl lg:h-96 lg:w-96"
              aria-hidden="true"
            />
            <Image
              src="/shreeji-final-logo.png"
              alt=""
              width={520}
              height={520}
              className="absolute right-[-16%] top-1/2 h-72 w-72 -translate-y-1/2 select-none rounded-full object-cover opacity-[0.14] lg:h-[30rem] lg:w-[30rem]"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 mx-auto grid min-h-[336px] max-w-7xl items-center px-4 py-12 sm:min-h-[366px] sm:px-6 md:grid-cols-[0.56fr_0.44fr] lg:min-h-[396px] lg:px-8">
            <AnimateIn from="bottom" duration={550}>
              <div className="max-w-2xl">
                <span className="inline-flex rounded-full border border-[#D9A514]/35 bg-[#D9A514]/12 px-4 py-2 text-sm font-semibold text-[#D9A514]">
                  Contact Shreeji Art
                </span>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Let&apos;s Discuss Your Signage Project.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                  Tell us what you need, and our team will help with materials,
                  lighting, fabrication, installation, and timelines.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/quote"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D9A514] px-6 py-3.5 text-base font-semibold text-[#121426] shadow-sm transition-colors duration-200 hover:bg-[#D9A514]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121426] motion-reduce:transition-none"
                  >
                    Request a Free Quote
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={SITE_CONTACT.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/24 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:border-[#D9A514] hover:text-[#D9A514] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121426] motion-reduce:transition-none"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
            <AnimateIn from="bottom" duration={520}>
              <aside className="rounded-[1.75rem] bg-[#181B31] p-6 text-white shadow-[0_20px_60px_-36px_rgba(18,20,38,0.55)] sm:p-8">
                <h2 className="font-display text-3xl font-semibold">
                  Contact Details
                </h2>
                <div className="mt-7 space-y-4">
                  {CONTACT_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <span className="flex gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D9A514]/12 text-[#D9A514]">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-white">
                            {item.label}
                          </span>
                          <span className="mt-1 block break-words text-base leading-6 text-white/76">
                            {item.value}
                          </span>
                        </span>
                      </span>
                    );

                    if ("href" in item && item.href) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="block rounded-2xl p-2 -m-2 transition-colors duration-200 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 focus-visible:ring-offset-[#181B31] motion-reduce:transition-none"
                        >
                          {content}
                        </a>
                      );
                    }

                    return <div key={item.label}>{content}</div>;
                  })}
                </div>
              </aside>
            </AnimateIn>

            <AnimateIn from="bottom" delay={80} duration={520}>
              <section className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-6 shadow-[0_24px_70px_-46px_rgba(18,20,38,0.42)] sm:p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-[#121426] sm:text-4xl">
                    Tell Us About Your Project
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
                    Share a few details and our team will get back to you.
                  </p>
                </div>
                <ContactForm />
              </section>
            </AnimateIn>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] bg-white shadow-[0_18px_55px_-42px_rgba(18,20,38,0.5)]">
            <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <h2 className="font-display text-3xl font-semibold text-[#121426]">
                  Based in Ahmedabad
                </h2>
                <p className="mt-3 text-base leading-7 text-[#667085]">
                  We serve commercial signage, branding, fabrication, and
                  installation projects across Ahmedabad and Gujarat.
                </p>
                <a
                  href={SITE_CONTACT.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] px-5 py-3 text-base font-semibold text-[#121426] transition-colors duration-200 hover:border-[#D9A514] hover:text-[#D9A514] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Open in Google Maps
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="h-72 bg-[#FAF8F2] lg:h-[340px]">
                <iframe
                  title="Shreeji Art - Ahmedabad, Gujarat"
                  src={SITE_CONTACT.mapsEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-[#121426] px-6 py-8 text-white sm:px-8 lg:flex-row lg:items-center lg:px-10">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to Make Your Brand More Visible?
              </h2>
              <p className="mt-3 text-base leading-7 text-white/72">
                Speak with our team about your signage requirements.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D9A514] px-6 py-3.5 text-base font-semibold text-[#121426] transition-colors duration-200 hover:bg-[#D9A514]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121426] motion-reduce:transition-none"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={SITE_CONTACT.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:border-[#D9A514] hover:text-[#D9A514] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121426] motion-reduce:transition-none"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call Now
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer compact />
    </>
  );
}
