import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-yellow-400 to-yellow-600 py-20 px-4">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">
            Ready to Explore Your City?
          </h2>

          <p className="text-lg text-white/90">
            Join thousands discovering local events, booking venues, and enjoying every moment!
          </p>

          <motion.div
            className="flex justify-center gap-6 pt-4 text-white/80 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>🔍 Search</span> → <span>🏛️ Book</span> → <span>🎉 Enjoy</span>
          </motion.div>

          <motion.div
            className="pt-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/login">
            <Button
              size="lg"
              className="bg-white text-white hover:bg-yellow-500 hover:text-white font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              🚀 Get Started
            </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
