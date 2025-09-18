import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-neutral-100 text-black py-20 px-6 border-t border-gray-200">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Visit Us</h2>

        <div className="space-y-4 text-gray-600 text-base md:text-lg">
          <p className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-gray-700" />
            Queens walkway way chathyrath road, Goshree Chathiyath Rd, Ayyappankavu, Kochi
          </p>
      
          <p className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-gray-700" />
            info@beanbarrel.in
          </p>
        </div>

        <div className="mt-6 flex justify-center">
        <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.2692841686508!2d76.26862547535274!3d9.994600873126933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d2a9a6db437%3A0xd1fcc5aba2b15bb2!2sBEAN%20BARREL!5e0!3m2!1sen!2sca!4v1757909008441!5m2!1sen!2sca"
  width="600"
  height="450"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

        </div>
      </div>
    </section>
  );
}
