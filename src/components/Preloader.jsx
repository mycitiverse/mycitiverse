import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // Show for 2.5s
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-yellow-500 flex items-center justify-center z-[9999]"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="text-white text-4xl font-extrabold"
      >MyCitiverse</motion.div>
    </motion.div>
  );
}
