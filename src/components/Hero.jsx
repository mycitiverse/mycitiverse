import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import Lottie from "lottie-react";
import celebrationAnimation from "../assets/celebration.json"; // Place the JSON file inside /src/assets

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-yellow-300 to-yellow-600 text-white py-24 md:py-36 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6 relative z-10"
        >
          {/* 🎉 Lottie Animation */}
          <div className="w-40 md:w-56 mx-auto">
            <Lottie animationData={celebrationAnimation} loop={true} />
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg"
          >
            MyCitiverse 
            <p><span className="text-red-600 text-4xl">(Coming Soon)</span></p>
          </motion.h1>

          {/* Subheading */}
          <h2 className="text-xl md:text-2xl font-semibold text-indigo-500 italic">
            Discover → Book → Celebrate
          </h2>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/90">
            One App, Every Corner of Your City
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
            <Link to="/events">
              <Button className="hover:scale-105 transition-transform bg-white text-white font-bold shadow-md hover:shadow-lg px-6 py-3 rounded-full">
                🎫 Explore Events
              </Button>
            </Link>
            <Link to="/community-hall">
              <Button className="hover:scale-105 transition-transform bg-white text-white font-bold shadow-md hover:shadow-lg px-6 py-3 rounded-full">
                🏛️ Book Your Hall
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
