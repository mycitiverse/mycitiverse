import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import Lottie from "lottie-react";
import celebrationAnimation from "../assets/celebration.json";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient overlay or background animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black z-0"></div>

      {/* Lottie background or a future video bg placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 opacity-20 z-0"
      >
        <Lottie animationData={celebrationAnimation} loop={true} />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-red-600 text-white text-sm px-4 py-1 rounded-full tracking-wide inline-block animate-pulse"
        >
        Coming Soon
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
        >
          Discover Events Around You
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/80 text-lg md:text-xl font-light"
        >
          One App, Every Corner of Your City
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center flex-wrap gap-4 pt-8"
        >
          <Link to="/events">
            <Button className="text-white bg-yellow-400 font-medium px-6 py-3 rounded-full hover:bg-yellow-500 transition-all duration-300">
            Explore Events
            </Button>
          </Link>
          <Link to="/community-hall">
            <Button className="text-white bg-yellow-400 font-medium px-6 py-3 rounded-full hover:bg-yellow-500 transition-all duration-300">
            Book Your Hall
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
