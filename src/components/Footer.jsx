import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between gap-12"
        >
          {/* Branding */}
          <div>
            <h3 className="text-2xl font-bold mb-2">MyCitiverse</h3>
            <p className="text-gray-400 max-w-xs">
              Discover and book the local events, community halls, and experiences in your city.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="text-gray-400 space-y-1 text-sm">
              <li><a href="/events" className="hover:text-white transition">Explore Events</a></li>
              <li><a href="/community-hall" className="hover:text-white transition">Book a Hall</a></li>
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-white mb-2">Follow Us</h4>
            <motion.div
              className="flex space-x-5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a href="https://facebook.com/MyCitiverse" className="text-gray-400 hover:text-white transition"><Facebook /></a>
              <a href="https://twitter.com/MyCitiverse" className="text-gray-400 hover:text-white transition"><Twitter /></a>
              <a href="https://www.instagram.com/mycitiverse" className="text-gray-400 hover:text-white transition"><Instagram /></a>
              <a href="https://www.linkedin.com/company/mycitiverse" className="text-gray-400 hover:text-white transition"><Linkedin /></a>
              <a href="https://www.youtube.com/@MyCitiverse" className="text-gray-400 hover:text-white transition"><Youtube /></a>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MyCitiverse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
