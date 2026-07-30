import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExchanges } from '../api';
import { useAppStore } from '../store';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import { motion } from 'framer-motion';
import { Search, X, Star, ArrowUpDown, Building2, ExternalLink, Award } from 'lucide-react';

const ExchangeCard = ({ item }) => {
  const { favorites, addFavorite, removeFavorite } = useAppStore();
  const isFavorite = favorites.includes(item.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    isFavorite ? removeFavorite(item.id) : addFavorite(item.id);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <div className="relative h-full p-5 rounded-2xl bg-navy-700/70 backdrop-blur-md border border-white/10 hover:border-amber-500/50 hover:shadow-glow-amber transition-all duration-300 flex flex-col justify-between group overflow-hidden">
        
        {/* Subtle hover accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 group-hover:via-amber-500/80 to-transparent transition-all duration-300" />

        <div>
          {/* Top Row: Logo, Name & Favorite */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={item.image}
                alt={item.name}
                className="h-11 w-11 rounded-xl object-contain bg-navy-800/80 p-1 border border-white/5 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="min-w-0 flex flex-col">
                <h3 className="text-base font-bold font-montserrat text-white truncate group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h3>
                {item.country && (
                  <span className="text-[11px] font-medium text-slate-400 truncate">
                    {item.country}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleFavoriteClick}
              aria-label="Bookmark Exchange"
              className="p-2 rounded-xl bg-navy-800/80 border border-white/5 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200"
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300'
                }`}
              />
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-navy-800/50 border border-white/5">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Trust Score Rank
              </span>
              <span className="text-xs font-extrabold text-white flex items-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                #{item.trust_score_rank || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Trust Score
              </span>
              <span className="text-xs font-extrabold text-emerald-400 mt-0.5 block">
                {item.trust_score ? `${item.trust_score}/10` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: 24h Trade Volume */}
        <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            <span className="font-bold text-white font-montserrat">
              {item.trade_volume_24h_btc?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? '0'}
            </span>{' '}
            <span className="text-slate-400">BTC / 24h</span>
          </div>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/link"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>

      </div>
    </motion.div>
  );
};

const Exchanges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rank_asc');
  const [showFavorites, setShowFavorites] = useState(false);
  const favorites = useAppStore((state) => state.favorites);

  const { data: exchanges, isLoading, isError } = useQuery({
    queryKey: ['exchanges'],
    queryFn: getExchanges,
  });

  const processedExchanges = useMemo(() => {
    if (!exchanges) return [];
    let processed = showFavorites
      ? exchanges.filter((ex) => favorites.includes(ex.id))
      : exchanges;

    processed = processed.filter((ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'name_asc':
        return [...processed].sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return [...processed].sort((a, b) => b.name.localeCompare(a.name));
      case 'rank_desc':
        return [...processed].sort((a, b) => (b.trust_score_rank || 999) - (a.trust_score_rank || 999));
      case 'rank_asc':
      default:
        return [...processed].sort((a, b) => (a.trust_score_rank || 999) - (b.trust_score_rank || 999));
    }
  }, [exchanges, searchTerm, sortOption, showFavorites, favorites]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" /> Global Trading Venues
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-montserrat">
            Crypto Exchanges
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Explore trusted cryptocurrency exchanges rank ordered by volume and trust scores.
          </p>
        </div>

        {/* Favorites Filter Switch Pill */}
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 shadow-sm self-start md:self-auto ${
            showFavorites
              ? 'bg-amber-400/10 text-amber-400 border-amber-500/40 shadow-glow-amber'
              : 'bg-navy-800/80 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
          }`}
        >
          <Star className={`w-4 h-4 ${showFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{showFavorites ? 'Showing Favorites' : 'Favorites Only'}</span>
          {favorites.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Field */}
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search exchange by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-navy-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select Dropdown */}
        <div className="md:col-span-4 relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full pl-11 pr-8 py-3 rounded-xl bg-navy-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer shadow-sm"
          >
            <option value="rank_asc" className="bg-navy-800 text-white">
              Sort by Rank (Ascending)
            </option>
            <option value="rank_desc" className="bg-navy-800 text-white">
              Sort by Rank (Descending)
            </option>
            <option value="name_asc" className="bg-navy-800 text-white">
              Sort by Name (A → Z)
            </option>
            <option value="name_desc" className="bg-navy-800 text-white">
              Sort by Name (Z → A)
            </option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          type="error"
          title="Error Loading Exchanges"
          message="Failed to load exchange directories. Please try refreshing."
        />
      ) : processedExchanges.length === 0 ? (
        <EmptyState
          type={showFavorites ? 'favorites' : 'search'}
          title={showFavorites ? 'No Favorite Exchanges' : 'No Exchanges Found'}
          message={
            showFavorites
              ? 'You haven\'t saved any exchanges to your favorites yet.'
              : `No exchanges matched "${searchTerm}".`
          }
          onReset={() => {
            setSearchTerm('');
            setShowFavorites(false);
          }}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {processedExchanges.map((item) => (
            <ExchangeCard key={item.id} item={item} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Exchanges;
