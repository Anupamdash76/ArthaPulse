import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCoinDetails, getCoins } from '../api';
import { useAppStore } from '../store';
import CoinChart from './CoinChart';
import SkeletonDetail from './SkeletonDetail';
import EmptyState from './EmptyState';
import { motion } from 'framer-motion';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Globe,
  ExternalLink,
  Award,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';

const USD_INR_RATE = 85.5;

const getValue = (dict, curr) => {
  if (!dict) return 0;
  if (dict[curr] !== undefined && dict[curr] !== null && dict[curr] !== 0) return dict[curr];
  if (curr === 'usd' && dict.inr) return dict.inr / USD_INR_RATE;
  if (curr === 'inr' && dict.usd) return dict.usd * USD_INR_RATE;
  return 0;
};

const CoinDetails = () => {
  const { id } = useParams();
  const [currency, setCurrency] = useState('usd');
  const currencySymbol = currency === 'inr' ? '₹' : '$';

  const { favorites, addFavorite, removeFavorite } = useAppStore();
  const isFavorite = favorites.includes(id);

  // Fetch Coin Details
  const { data: coin, isLoading, isError } = useQuery({
    queryKey: ['coin', id],
    queryFn: () => getCoinDetails(id),
  });

  // Fetch Top/Related Coins for discovery bar
  const { data: relatedCoins } = useQuery({
    queryKey: ['coins', currency],
    queryFn: () => getCoins(currency),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <SkeletonDetail />;

  if (isError || !coin) {
    return (
      <EmptyState
        type="error"
        title="Coin Not Found"
        message="Unable to fetch data for this cryptocurrency. It might be unavailable or removed."
      />
    );
  }

  const marketData = coin.market_data || {};
  const currentPrice = getValue(marketData.current_price, currency);
  const priceChange24h = marketData.price_change_percentage_24h || 0;
  const profit = priceChange24h >= 0;

  const handleFavoriteClick = () => {
    isFavorite ? removeFavorite(id) : addFavorite(id);
  };

  // Filter top 5 related coins excluding current coin
  const topRelated = (relatedCoins || [])
    .filter((c) => c.id !== id)
    .slice(0, 5);

  const statsGrid = [
    {
      label: 'Market Cap',
      value: `${currencySymbol}${getValue(marketData.market_cap, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
    },
    {
      label: '24h Volume',
      value: `${currencySymbol}${getValue(marketData.total_volume, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: Activity,
    },
    {
      label: 'Circulating Supply',
      value: marketData.circulating_supply?.toLocaleString() ?? 'N/A',
      icon: Layers,
    },
    {
      label: 'Total Supply',
      value: marketData.total_supply?.toLocaleString() ?? 'Unlimited',
      icon: Layers,
    },
    {
      label: '24h High',
      value: `${currencySymbol}${getValue(marketData.high_24h, currency).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      color: 'text-emerald-400',
    },
    {
      label: '24h Low',
      value: `${currencySymbol}${getValue(marketData.low_24h, currency).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: ArrowDownRight,
      color: 'text-rose-400',
    },
    {
      label: 'All-Time High (ATH)',
      value: `${currencySymbol}${getValue(marketData.ath, currency).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: Sparkles,
      color: 'text-amber-400',
    },
    {
      label: 'All-Time Low (ATL)',
      value: `${currencySymbol}${getValue(marketData.atl, currency).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: Info,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-16"
    >
      {/* HEADER BAR SECTION */}
      <div className="p-6 md:p-8 rounded-2xl bg-navy-700/70 backdrop-blur-md border border-white/10 shadow-card flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        {/* Left Info: Image, Name, Ticker, Rank */}
        <div className="flex items-center gap-5">
          <img
            src={coin.image?.large}
            alt={coin.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-navy-800 p-2 border border-white/10 shadow-md object-contain"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-montserrat">
                {coin.name}
              </h1>
              <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                {coin.symbol}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Rank #{coin.market_cap_rank || 'N/A'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Last updated: {coin.last_updated ? new Date(coin.last_updated).toLocaleTimeString() : 'Recently'}
            </p>
          </div>
        </div>

        {/* Right Info: Price, 24h Change, Currency Switcher & Favorite */}
        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          {/* Currency Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-navy-800/90 border border-white/10 shadow-inner">
            <button
              onClick={() => setCurrency('usd')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'usd' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('inr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'inr' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              INR
            </button>
          </div>

          {/* Price Readout */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="text-2xl md:text-3xl font-black font-montserrat text-white tracking-tight">
              {currencySymbol} {currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border mt-1 ${
                profit
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {profit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{profit ? '+' : ''}{priceChange24h.toFixed(2)}% (24h)</span>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-3 rounded-xl border transition-all duration-200 shadow-sm ${
              isFavorite
                ? 'bg-amber-400/10 border-amber-500/40 text-amber-400 shadow-glow-amber'
                : 'bg-navy-800/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            aria-label="Toggle Favorite"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* STATISTICS GRID */}
      <div>
        <h2 className="text-lg font-bold font-montserrat text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" /> Key Market Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statsGrid.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-navy-700/60 border border-white/5 hover:border-white/20 transition-all duration-200 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{stat.label}</span>
                  <Icon className={`w-4 h-4 ${stat.color || 'text-slate-400'}`} />
                </div>
                <div className="text-sm md:text-base font-extrabold text-white font-montserrat truncate">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE CHART SECTION */}
      <CoinChart currency={currency} />

      {/* DESCRIPTION & RESOURCES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Description */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-navy-700/70 backdrop-blur-md border border-white/10 shadow-card space-y-4">
          <h2 className="text-lg font-bold font-montserrat text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" /> About {coin.name}
          </h2>
          {coin.description?.en ? (
            <div
              className="text-slate-300 text-sm leading-relaxed space-y-3 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split('. ').slice(0, 4).join('. ') + '.',
              }}
            />
          ) : (
            <p className="text-slate-400 text-sm">No detailed description available for this coin.</p>
          )}
        </div>

        {/* External Resources & Categories */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-navy-700/70 backdrop-blur-md border border-white/10 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold font-montserrat text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" /> Links & Info
            </h2>
            <div className="space-y-3">
              {coin.links?.homepage?.[0] && (
                <a
                  href={coin.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-navy-800/80 border border-white/5 text-slate-200 hover:text-amber-400 hover:border-amber-500/30 transition-all text-xs font-bold group"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" /> Official Website
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}

              {coin.links?.blockchain_site?.[0] && (
                <a
                  href={coin.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-navy-800/80 border border-white/5 text-slate-200 hover:text-amber-400 hover:border-amber-500/30 transition-all text-xs font-bold group"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" /> Blockchain Explorer
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {coin.categories && coin.categories.length > 0 && (
            <div className="pt-4 border-t border-white/5">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {coin.categories.slice(0, 3).map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-semibold text-slate-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RELATED / TRENDING COINS DISCOVERY */}
      {topRelated.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold font-montserrat text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Explore Related Assets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topRelated.map((relCoin) => {
              const relProfit = (relCoin.price_change_percentage_24h || 0) >= 0;
              return (
                <Link
                  key={relCoin.id}
                  to={`/coins/${relCoin.id}`}
                  className="p-4 rounded-2xl bg-navy-700/60 border border-white/5 hover:border-amber-500/50 hover:shadow-glow-amber transition-all duration-200 group no-underline"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <img src={relCoin.image} alt={relCoin.name} className="w-7 h-7 rounded-lg object-contain" />
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 truncate">
                      {relCoin.name}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-white font-montserrat">
                    {currencySymbol}{relCoin.current_price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-[11px] font-bold mt-1 ${
                      relProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {relProfit ? '+' : ''}{relCoin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CoinDetails;