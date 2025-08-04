import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="h-12 w-12 rounded-full bg-gray-400/50"></div>
      <div className="h-6 bg-gray-400/50 rounded-md flex-grow"></div>
    </div>
    <div className="h-4 bg-gray-400/50 rounded-md w-3/4"></div>
  </div>
);

export default SkeletonCard;