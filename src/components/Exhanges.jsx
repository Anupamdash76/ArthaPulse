import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExchanges } from '../api';
import { useAppStore } from '../store';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SkeletonCard from './SkeletonCard'; // Assuming you have SkeletonCard from before

// Updated card with distinct light and dark mode styles
const ExchangeCard = ({ item }) => {
  const { favorites, addFavorite, removeFavorite } = useAppStore();
  const isFavorite = favorites.includes(item.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    isFavorite ? removeFavorite(item.id) : addFavorite(item.id);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <div className="h-full p-6 rounded-xl shadow-lg transition-all duration-300 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500">
        <div className="flex items-center gap-4 mb-4">
          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full" />
          <h3 className="text-xl font-bold font-montserrat flex-grow text-slate-800 dark:text-white">{item.name}</h3>
          <button onClick={handleFavoriteClick} className="z-10 p-1 text-2xl">
            <FaStar
              className={`transition-colors ${
                isFavorite
                  ? 'text-yellow-400'
                  : 'text-slate-300 dark:text-slate-600 hover:text-yellow-300'
              }`}
            />
          </button>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {item.trade_volume_24h_btc.toFixed(0)}
          </span>{' '}
          BTC
          <span className="mx-2">/</span>
          24h Volume
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
        return processed.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return processed.sort((a, b) => b.name.localeCompare(a.name));
      case 'rank_desc':
        return processed.sort((a, b) => b.trust_score_rank - a.trust_score_rank);
      default:
        return processed.sort((a, b) => a.trust_score_rank - b.trust_score_rank);
    }
  }, [exchanges, searchTerm, sortOption, showFavorites, favorites]);

  if (isLoading) {
    // Skeleton loader placeholder
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">
          Failed to load exchanges. Please try again later.
        </h2>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <div className="p-8 bg-slate-100 dark:bg-gradient-to-br dark:from-black dark:to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-4">
          Crypto Exchanges
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10">
          Search and sort through top cryptocurrency platforms.
        </p>

        {/* Controls for search, sort, and favorites */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-white/80 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white/80 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="rank_asc" className="bg-white dark:bg-slate-800">
              Sort by Rank (Asc)
            </option>
            <option value="rank_desc" className="bg-white dark:bg-slate-800">
              Sort by Rank (Desc)
            </option>
            <option value="name_asc" className="bg-white dark:bg-slate-800">
              Sort by Name (A-Z)
            </option>
            <option value="name_desc" className="bg-white dark:bg-slate-800">
              Sort by Name (Z-A)
            </option>
          </select>
        </div>

        <div className="flex items-center justify-center mb-10">
          <label htmlFor="favorites-toggle" className="flex items-center cursor-pointer">
            <span className="mr-3 text-lg text-slate-700 dark:text-slate-300">
              Show Favorites Only
            </span>
            <div className="relative">
              <input
                type="checkbox"
                id="favorites-toggle"
                className="sr-only peer"
                checked={showFavorites}
                onChange={() => setShowFavorites(!showFavorites)}
              />
              <div className="block bg-slate-300 peer-checked:bg-orange-500 w-14 h-8 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </div>
          </label>
        </div>

        {processedExchanges.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              No Exchanges Found
            </h2>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
    </div>
  );
};

export default Exchanges;
