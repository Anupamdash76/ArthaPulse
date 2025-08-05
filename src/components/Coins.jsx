import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCoins } from '../api';
import SkeletonCard from './SkeletonCard';
import { motion } from 'framer-motion';

// The card component for each coin
const CoinCard = ({ coin, currencySymbol }) => {
  const profit = coin.price_change_percentage_24h > 0;
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Link to={`/coins/${coin.id}`} className="no-underline">
        <div className="h-full p-4 rounded-xl shadow-lg transition-all duration-300 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500">
          <div className="flex items-center gap-3 mb-3">
            <img src={coin.image} alt={coin.name} className="h-10 w-10" />
            <h3 className="text-md font-bold font-montserrat text-slate-800 dark:text-white truncate">{coin.name}</h3>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {currencySymbol} {coin.current_price.toLocaleString()}
          </div>
          <div className={`text-md font-bold ${profit ? 'text-green-500' : 'text-red-500'}`}>
            {profit ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


const Coins = () => {
  // State for currency, search, and sorting
  const [currency, setCurrency] = useState('usd');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('market_cap_desc');

  const currencySymbol = currency === 'inr' ? '₹' : '$';

  // useQuery now depends on the 'currency' state
  const { data: coins, isLoading, isError } = useQuery({
    queryKey: ['coins', currency],
    queryFn: () => getCoins(currency),
    staleTime: 1000 * 60, // 1 minute cache
  });

  // useMemo now handles both filtering and advanced sorting
  const processedCoins = useMemo(() => {
    if (!coins) return [];

    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'price_asc':
        return filtered.sort((a, b) => a.current_price - b.current_price);
      case 'price_desc':
        return filtered.sort((a, b) => b.current_price - a.current_price);
      case 'change_asc':
        return filtered.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
      case 'change_desc':
        return filtered.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      case 'market_cap_desc':
      default:
        return filtered.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
    }
  }, [coins, searchTerm, sortOption]);

  if (isLoading) {
    return (
      <div className='p-8'>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }
  if (isError) return <div className="text-center text-red-500 py-10">Error fetching coin data.</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <div className='p-8 bg-slate-100 dark:bg-gradient-to-br dark:from-black dark:to-slate-900 min-h-screen'>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-4">Cryptocurrency Prices</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10">Search prices and market data for your favorite coins.</p>
        
        {/* UI Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input type="text" placeholder="Search for a coin..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow bg-white/80 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-white/80 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="market_cap_desc" className="bg-white dark:bg-slate-800">Sort by Market Cap</option>
            <option value="price_desc" className="bg-white dark:bg-slate-800">Sort by Price (High-Low)</option>
            <option value="price_asc" className="bg-white dark:bg-slate-800">Sort by Price (Low-High)</option>
            <option value="change_desc" className="bg-white dark:bg-slate-800">Sort by Change % (High-Low)</option>
            <option value="change_asc" className="bg-white dark:bg-slate-800">Sort by Change % (Low-High)</option>
          </select>
        </div>
        
        {/* Currency Toggle Buttons */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <button onClick={() => setCurrency('inr')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${currency === 'inr' ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            INR
          </button>
          <button onClick={() => setCurrency('usd')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${currency === 'usd' ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            USD
          </button>
        </div>

        {processedCoins.length === 0 ? (
          <div className="text-center py-20"><h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No Coins Found</h2></div>
        ) : (
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" variants={containerVariants} initial="hidden" animate="visible">
            {processedCoins.map((item) => <CoinCard key={item.id} coin={item} currencySymbol={currencySymbol} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Coins;