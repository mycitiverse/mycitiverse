import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

export default function HeroSection() {
  return (
    <section
    className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white overflow-hidden"
  style={{ backgroundImage: "url('/cover.png')" }}>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-4xl mx-auto space-y-6 pt-[360px] sm:pt-[400px] md:pt-[440px] lg:pt-[480px] xl:pt-[500px] pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-red-600 text-white text-sm px-4 py-1 rounded-full tracking-wide inline-block animate-pulse"
        >
        Work in Progress
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight"
        >
        Discover Local Events Around You
        </motion.h1>

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
