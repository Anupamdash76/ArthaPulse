import React from 'react';
import { Activity } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] py-16 gap-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin"></div>
        <Activity className="w-6 h-6 text-amber-400 absolute animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-400 font-montserrat tracking-wider uppercase">
        Fetching Live Market Data...
      </p>
    </div>
  );
};

export default Loader;
