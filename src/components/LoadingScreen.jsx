import React from 'react';
import { Loader2 } from 'lucide-react'; // Or any icon/spinner you like
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
      <p className="text-gray-600 font-medium">Loading Dashboard...</p>
    </motion.div>
  );
};

export default LoadingScreen;
