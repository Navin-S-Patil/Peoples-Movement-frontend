import React from "react";
import { Instagram, Youtube, Linkedin, Twitter, MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "News", href: "/news" },
  { name: "E-Paper", href: "/e-paper" },
  { name: "Download Paper", href: "/paper" },
  { name: "Contact", href: "/contact" },
];

const contact = [
  { name: "address", icon: MapPin, text: "Govandi, Mumbai - 400 088" },
  { name: "email", icon: Mail, text: "news@peoploesmovement.com" },
  { name: "phone", icon: Phone, text: "+91 9324719182" },
];

const legal_policy = [
  { name: "Privacy Policy", href: "/policies/privacy-policy" },
  { name: "Terms of Service", href: "/policies/terms-of-service" },
  { name: "Cookie Policy", href: "/policies/cookie-policy" },
  { name: "Legal", href: "/policies/legal" },
];

const explore = [
  { name: "Design", href: "/design" },
  { name: "Prototyping", href: "/prototyping" },
  { name: "Development features", href: "/development" },
  { name: "Design systems", href: "/design-systems" },
  { name: "Collaboration features", href: "/collaboration-features" },
  { name: "Design process", href: "/design-process" },
  { name: "FigJam", href: "/figjam" },
];

const socialLinks = [
  { Icon: Twitter, href: "#", size: 20 },
  { Icon: Instagram, href: "#", size: 20 },
  { Icon: Youtube, href: "#", size: 20 },
  { Icon: Linkedin, href: "#", size: 20 },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Social Links */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-red-600">पिपल्स</span>
              <span className="text-2xl font-bold text-blue-500">
                मुव्हमेंट
              </span>
            </Link>
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, size }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Icon size={size} />
                </Link>
              ))}
            </div>
          </div>

          {/* Go to */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Go to</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {explore.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {contact.map((item) => (
                <li key={item.name}>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <item.icon size={20} strokeWidth={2.25} className="flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Peoples Movement. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}