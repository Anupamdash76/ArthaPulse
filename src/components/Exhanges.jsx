import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExchanges } from '../api';
import Loader from './Loader';

// The new "Glassmorphism" card component
const ExchangeCard = ({ item }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 text-white transition-all duration-300 hover:border-white/40 hover:scale-105">
    <div className="flex items-center gap-4 mb-4">
      <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full" />
      <h3 className="text-xl font-bold font-montserrat flex-grow">{item.name}</h3>
      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/20 text-orange-400 font-bold">
        {item.trust_score_rank}
      </span>
    </div>
    <div className="text-sm text-slate-300">
      <span className="font-bold text-slate-100">{item.trade_volume_24h_btc.toFixed(0)}</span> BTC
      <span className="mx-2">/</span>
      24h Volume
    </div>
  </div>
);

// The main page component with new features
const Exchanges = () => {
  // 1. State for search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rank_asc'); // Default sort

  const { data: exchanges, isLoading, isError } = useQuery({
    queryKey: ['exchanges'],
    queryFn: getExchanges,
  });

  // 2. Memoized logic for filtering and sorting
  const sortedAndFilteredExchanges = useMemo(() => {
    if (!exchanges) return [];

    const filtered = exchanges.filter(exchange =>
      exchange.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'name_asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case 'rank_desc':
        return filtered.sort((a, b) => b.trust_score_rank - a.trust_score_rank);
      case 'rank_asc':
      default:
        return filtered.sort((a, b) => a.trust_score_rank - a.trust_score_rank);
    }
  }, [exchanges, searchTerm, sortOption]);

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-center text-red-500 py-10">Error fetching data.</div>;

  return (
    // Added a subtle gradient background to the main container
    <div className='p-8 bg-gradient-to-br from-gray-900 to-slate-800 min-h-screen'>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-4">Crypto Exchanges</h1>
        <p className="text-center text-slate-400 mb-10">Search and sort through top cryptocurrency platforms.</p>

        {/* 3. UI Controls for Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {/* Add classes to each option for visibility */}
            <option value="rank_asc" className="bg-gray-800 text-white">Sort by Rank (Asc)</option>
            <option value="rank_desc" className="bg-gray-800 text-white">Sort by Rank (Desc)</option>
            <option value="name_asc" className="bg-gray-800 text-white">Sort by Name (A-Z)</option>
            <option value="name_desc" className="bg-gray-800 text-white">Sort by Name (Z-A)</option>
          </select>
        </div>

        {/* The responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredExchanges.map((item) => (
            <ExchangeCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exchanges;