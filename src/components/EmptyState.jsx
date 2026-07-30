import React from 'react';
import { SearchX, StarOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ type = 'search', title, message, onReset }) => {
  const getIcon = () => {
    switch (type) {
      case 'favorites':
        return <StarOff className="w-10 h-10 text-amber-400/70" />;
      case 'error':
        return <AlertTriangle className="w-10 h-10 text-rose-400/70" />;
      case 'search':
      default:
        return <SearchX className="w-10 h-10 text-slate-400/70" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 my-8 rounded-2xl glass-panel text-center max-w-md mx-auto"
    >
      <div className="p-4 rounded-2xl bg-navy-800/80 border border-white/10 mb-4 shadow-inner">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold font-montserrat text-white mb-2">
        {title || (type === 'favorites' ? 'No Favorites Saved' : 'No Results Found')}
      </h3>
      <p className="text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
        {message || (type === 'favorites' 
          ? 'Star your favorite coins or exchanges to quickly access them here.' 
          : 'We couldn\'t find any matches. Try adjusting your search query or filters.')}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          Reset Filters
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
