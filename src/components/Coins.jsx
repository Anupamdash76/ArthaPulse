import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCoins } from '../api';
import { useAppStore } from '../store'; // <-- CORRECT IMPORT
import Loader from './Loader';
import SkeletonCard from './SkeletonCard';

const CoinCard = ({ coin }) => {
  const profit = coin.price_change_percentage_24h > 0;
  // Note: We are removing the currency symbol for now to simplify, as it's not in the new store.
  return (
    <Link to={`/coins/${coin.id}`} className="no-underline text-gray-800 dark:text-white">
      <div className="h-full bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-4 transition-all duration-300 hover:border-white/40 hover:scale-105">
        <div className="flex items-center gap-4 mb-3">
          <img src={coin.image} alt={coin.name} className="h-10 w-10" />
          <h3 className="text-lg font-bold font-montserrat">{coin.name}</h3>
        </div>
        <div className="text-lg font-bold">
          $ {coin.current_price.toLocaleString()}
        </div>
        <div className={`text-md ${profit ? 'text-green-500' : 'text-red-500'}`}>
          {profit ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    </Link>
  );
};

const Coins = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Note: Using a fixed currency for this page now
  const currency = 'usd'; 

  const { data: coins, isLoading, isError } = useQuery({
    queryKey: ['coins', currency],
    queryFn: () => getCoins(currency),
  });

  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    return coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coins, searchTerm]);

  if (isLoading) return (
    <div className='p-8'>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
  if (isError) return <div className="text-center text-red-500 py-10">Error fetching coin data.</div>;

  return (
    <div className='p-8'>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">Cryptocurrency Prices</h1>
        <p className="text-center text-gray-600 dark:text-slate-400 mb-10">Search for a coin to see its live price.</p>
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search for a coin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-gray-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coins;