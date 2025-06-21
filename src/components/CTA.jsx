import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight drop-shadow">
            Ready to Explore Your City?
          </h2>

          {/* Subtext */}
          <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Join thousands discovering events, booking venues, and experiencing every corner of the city with MyCitiverse.
          </p>

          {/* Flow Emojis */}
          <motion.div
            className="flex justify-center gap-6 pt-4 text-white/90 text-base font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>🔍 Search</span> → <span>🏛️ Book</span> → <span>🎉 Enjoy</span>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="pt-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/login">
              <Button className="bg-yellow-400 text-white hover:bg-yellow-500 font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
