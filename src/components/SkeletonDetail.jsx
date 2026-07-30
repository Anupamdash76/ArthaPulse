import React from 'react';

const SkeletonDetail = () => (
  <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
    {/* Header Skeleton */}
    <div className="p-6 md:p-8 rounded-2xl bg-navy-700/60 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-navy-600/80"></div>
        <div className="space-y-2">
          <div className="h-7 w-40 bg-navy-600/80 rounded-md"></div>
          <div className="h-4 w-24 bg-navy-600/50 rounded-md"></div>
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="h-8 w-36 bg-navy-600/80 rounded-md"></div>
        <div className="h-5 w-20 bg-navy-600/50 rounded-full ml-auto"></div>
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-navy-700/40 border border-white/5 space-y-2">
          <div className="h-3 w-20 bg-navy-600/50 rounded"></div>
          <div className="h-5 w-28 bg-navy-600/80 rounded"></div>
        </div>
      ))}
    </div>

    {/* Chart Skeleton */}
    <div className="p-6 rounded-2xl bg-navy-700/60 border border-white/5 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 bg-navy-600/80 rounded"></div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-12 bg-navy-600/50 rounded-lg"></div>
          ))}
        </div>
      </div>
      <div className="h-80 w-full bg-navy-600/40 rounded-xl"></div>
    </div>
  </div>
);

export default SkeletonDetail;
