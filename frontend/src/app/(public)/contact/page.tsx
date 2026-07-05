import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Shreeji Art — signage and branding company in Ahmedabad.",
};

export default function ContactPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Contact Us
      </h1>
      <p className="text-center text-gray-500 mb-12">
        We&apos;d love to hear about your project
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold text-brand-navy mb-4">Get In Touch</h2>
          <div className="space-y-4 text-gray-600">
            <p>📍 Ahmedabad, Gujarat — 380001</p>
            <p>
              📞{" "}
              <a href="tel:+919999999999" className="hover:text-brand-gold">
                +91 99999 99999
              </a>
            </p>
            <p>
              ✉️{" "}
              <a href="mailto:info@shreejiart.in" className="hover:text-brand-gold">
                info@shreejiart.in
              </a>
            </p>
            <p>🕘 Mon–Sat: 9:00 AM – 7:00 PM</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
