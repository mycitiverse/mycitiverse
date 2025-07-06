import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-yellow-500 flex items-center justify-center z-[9999]"
    >
      <div className="w-64 h-6 bg-white/30 rounded-full overflow-hidden relative shadow-lg">
        {/* Animated inner loading bar */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="h-full bg-white rounded-full"
        />

        {/* Centered MyCitiverse Logo Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-yellow-700 font-bold text-sm tracking-wide"
          >
            MyCitiverse
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
