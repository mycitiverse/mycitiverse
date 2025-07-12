import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [loadDuration, setLoadDuration] = useState(1500); // default fallback

  useEffect(() => {
    const t0 = performance.now();

    const handleLoad = () => {
      const t1 = performance.now();
      const realLoadTime = t1 - t0;

      const min = 500;
      const max = 2000;
      const adjustedTime = Math.min(Math.max(realLoadTime, min), max);

      setLoadDuration(adjustedTime); // ⏱ sync loading bar animation
      setTimeout(() => setLoading(false), adjustedTime); // hide preloader after same time
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-yellow-400 flex items-center justify-center z-[9999]"
    >
      <div className="w-64 h-6 bg-white/30 rounded-full overflow-hidden relative shadow-lg">
        {/* ✅ Dynamic animation duration based on loading time */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: loadDuration / 1000, ease: "easeInOut" }}
          className="h-full bg-white rounded-full"
        />

        {/* Centered Logo Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-yellow-700 font-bold text-sm tracking-wide"
          >
            MyCitiverse
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
