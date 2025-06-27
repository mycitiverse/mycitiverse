import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-4">MyCitiverse</h3>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            Discover and book local events, community halls, and exciting experiences happening around you.
          </p>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/events" className="hover:text-white transition-colors">Explore Events</a></li>
            <li><a href="/community-hall" className="hover:text-white transition-colors">Book a Hall</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/refund" className="hover:underline">Refund Policy</a></li>
            <li><a href="/disclaimer" className="hover:underline">Disclaimer</a></li>
          </ul>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
          <div className="flex items-center gap-5 text-gray-400 text-xl">
            <a href="https://facebook.com/MyCitiverse" className="hover:text-white transition"><Facebook size={20} /></a>
            <a href="https://twitter.com/MyCitiverse" className="hover:text-white transition"><Twitter size={20} /></a>
            <a href="https://www.instagram.com/mycitiverse" className="hover:text-white transition"><Instagram size={20} /></a>
            <a href="https://www.linkedin.com/company/mycitiverse" className="hover:text-white transition"><Linkedin size={20} /></a>
            <a href="https://www.youtube.com/@MyCitiverse" className="hover:text-white transition"><Youtube size={20} /></a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MyCitiverse. All rights reserved.
      </div>
    </footer>
  );
}
