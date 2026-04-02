import React from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';


const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Film className={`${sizeClasses[size]} text-blue-500`} />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;