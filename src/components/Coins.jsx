import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCoins } from '../api';
import { useAppStore } from '../store';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import { motion } from 'framer-motion';
import { Search, X, Star, ArrowUpDown, TrendingUp, TrendingDown, Coins as CoinsIcon } from 'lucide-react';

const USD_INR_RATE = 85.5;

// The redesigned card component for each coin
const CoinCard = ({ coin, currencySymbol }) => {
  const { favorites, addFavorite, removeFavorite } = useAppStore();
  const isFavorite = favorites.includes(coin.id);
  const profit = (coin.price_change_percentage_24h || 0) >= 0;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isFavorite ? removeFavorite(coin.id) : addFavorite(coin.id);
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
      <Link to={`/coins/${coin.id}`} className="block h-full no-underline">
        <div className="relative h-full p-5 rounded-2xl bg-navy-700/70 backdrop-blur-md border border-white/10 hover:border-amber-500/50 hover:shadow-glow-amber transition-all duration-300 flex flex-col justify-between group overflow-hidden">
          
          {/* Subtle top glow bar on hover */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 group-hover:via-amber-500/80 to-transparent transition-all duration-300" />

          {/* Top Row: Logo, Name, Ticker & Favorite */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-10 w-10 rounded-xl object-contain bg-navy-800/80 p-1 border border-white/5 group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="min-w-0 flex flex-col">
                  <h3 className="text-sm font-bold font-montserrat text-white truncate group-hover:text-amber-400 transition-colors">
                    {coin.name}
                  </h3>
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    {coin.symbol}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleFavoriteClick}
                aria-label="Bookmark Coin"
                className="p-1.5 rounded-lg bg-navy-800/80 border border-white/5 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200"
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300'
                  }`}
                />
              </button>
            </div>

            {/* Price & Rank */}
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-lg font-bold font-montserrat text-white tracking-tight">
                {currencySymbol} {coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? 'N/A'}
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                #{coin.market_cap_rank || 'N/A'}
              </span>
            </div>
          </div>

          {/* Bottom Row: 24h Change Pill & 24h Vol */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">24h Change</span>
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                profit
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {profit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{profit ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%</span>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};

const Coins = () => {
  const [currency, setCurrency] = useState('usd');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('market_cap_desc');

  const currencySymbol = currency === 'inr' ? '₹' : '$';

  // Fetch INR coins (primary reliable baseline)
  const { data: inrCoins, isLoading: inrLoading, isError: inrError } = useQuery({
    queryKey: ['coins', 'inr'],
    queryFn: () => getCoins('inr'),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  // Fetch USD coins
  const { data: usdCoins, isLoading: usdLoading } = useQuery({
    queryKey: ['coins', 'usd'],
    queryFn: () => getCoins('usd'),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  const isLoading = (inrLoading && usdLoading);

  // Compute final effective coins list with seamless fallback conversion
  const rawCoins = useMemo(() => {
    if (currency === 'usd') {
      if (usdCoins && Array.isArray(usdCoins) && usdCoins.length > 0) {
        return usdCoins;
      }
      if (inrCoins && Array.isArray(inrCoins) && inrCoins.length > 0) {
        // Fallback: Convert INR prices to USD
        return inrCoins.map((coin) => ({
          ...coin,
          current_price: coin.current_price ? coin.current_price / USD_INR_RATE : 0,
        }));
      }
    } else {
      if (inrCoins && Array.isArray(inrCoins) && inrCoins.length > 0) {
        return inrCoins;
      }
      if (usdCoins && Array.isArray(usdCoins) && usdCoins.length > 0) {
        // Fallback: Convert USD prices to INR
        return usdCoins.map((coin) => ({
          ...coin,
          current_price: coin.current_price ? coin.current_price * USD_INR_RATE : 0,
        }));
      }
    }
    return [];
  }, [currency, inrCoins, usdCoins]);

  const processedCoins = useMemo(() => {
    if (!rawCoins || rawCoins.length === 0) return [];

    const filtered = rawCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'price_asc':
        return [...filtered].sort((a, b) => (a.current_price || 0) - (b.current_price || 0));
      case 'price_desc':
        return [...filtered].sort((a, b) => (b.current_price || 0) - (a.current_price || 0));
      case 'change_asc':
        return [...filtered].sort(
          (a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)
        );
      case 'change_desc':
        return [...filtered].sort(
          (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
        );
      case 'market_cap_desc':
      default:
        return [...filtered].sort((a, b) => (a.market_cap_rank || 999) - (b.market_cap_rank || 999));
    }
  }, [rawCoins, searchTerm, sortOption]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CoinsIcon className="w-4 h-4" /> Market Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-montserrat">
            Cryptocurrency Assets
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Live prices, market capitalization, and 24-hour performance for top digital assets.
          </p>
        </div>

        {/* Currency Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-navy-800/90 border border-white/10 shadow-inner self-start md:self-auto">
          <button
            onClick={() => setCurrency('usd')}
            className={`relative px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              currency === 'usd' ? 'text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currency === 'usd' && (
              <motion.div
                layoutId="currencyTab"
                className="absolute inset-0 bg-amber-400 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">USD ($)</span>
          </button>
          <button
            onClick={() => setCurrency('inr')}
            className={`relative px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              currency === 'inr' ? 'text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            {currency === 'inr' && (
              <motion.div
                layoutId="currencyTab"
                className="absolute inset-0 bg-amber-400 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">INR (₹)</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Field */}
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search coin by name or ticker..."
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
            <option value="market_cap_desc" className="bg-navy-800 text-white">
              Sort by Market Cap Rank
            </option>
            <option value="price_desc" className="bg-navy-800 text-white">
              Sort by Price (High → Low)
            </option>
            <option value="price_asc" className="bg-navy-800 text-white">
              Sort by Price (Low → High)
            </option>
            <option value="change_desc" className="bg-navy-800 text-white">
              Sort by 24h Change (High → Low)
            </option>
            <option value="change_asc" className="bg-navy-800 text-white">
              Sort by 24h Change (Low → High)
            </option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (inrError && !rawCoins.length) ? (
        <EmptyState
          type="error"
          title="Error Loading Coins"
          message="Failed to retrieve cryptocurrency market data. Please check your internet connection."
        />
      ) : processedCoins.length === 0 ? (
        <EmptyState
          type="search"
          title="No Coins Found"
          message={`No cryptocurrency matched "${searchTerm}". Try searching for another name or ticker.`}
          onReset={() => setSearchTerm('')}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {processedCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} currencySymbol={currencySymbol} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Coins;