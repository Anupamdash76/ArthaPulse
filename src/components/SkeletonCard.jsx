import React from 'react';

const SkeletonCard = () => (
  <div className="p-5 rounded-2xl bg-navy-700/60 border border-white/5 shadow-card animate-pulse flex flex-col justify-between h-44">
    <div className="flex items-center gap-3.5">
      <div className="h-11 w-11 rounded-xl bg-navy-600/80"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-navy-600/80 rounded-md w-3/4"></div>
        <div className="h-3 bg-navy-600/50 rounded-md w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3 pt-3 border-t border-white/5">
      <div className="h-6 bg-navy-600/80 rounded-md w-2/3"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-navy-600/50 rounded-md w-1/3"></div>
        <div className="h-5 bg-navy-600/50 rounded-full w-1/4"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;