import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getCoinChartData } from '../api';
import { Clock, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CoinChart = ({ currency = 'usd' }) => {
  const { id } = useParams();
  const [days, setDays] = useState(1);
  const chartRef = useRef(null);

  const currencySymbol = currency === 'inr' ? '₹' : '$';

  const timeRanges = [
    { label: '24H', value: 1 },
    { label: '7D', value: 7 },
    { label: '1M', value: 30 },
    { label: '3M', value: 90 },
    { label: '1Y', value: 365 },
  ];

  const { data: chartData, isLoading, isError } = useQuery({
    queryKey: ['chart', id, currency, days],
    queryFn: () => getCoinChartData({ id, currency, days }),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 p-6 rounded-2xl bg-navy-700/60 border border-white/10 flex flex-col justify-center items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Loading Chart Data...</span>
      </div>
    );
  }

  if (isError || !chartData || chartData.length === 0) {
    return (
      <div className="w-full h-80 p-6 rounded-2xl bg-navy-700/60 border border-white/10 flex flex-col justify-center items-center text-center">
        <p className="text-sm font-semibold text-rose-400">Failed to render chart data for this asset.</p>
      </div>
    );
  }

  const prices = chartData.map((val) => val[1]);
  const isPositiveTrend = prices[prices.length - 1] >= prices[0];
  const strokeColor = isPositiveTrend ? '#F59E0B' : '#EF4444';

  const myData = {
    labels: chartData.map((value) => {
      const date = new Date(value[0]);
      if (days === 1) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (days <= 30) {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: `Price (${currency.toUpperCase()})`,
        data: prices,
        borderColor: strokeColor,
        borderWidth: 2.5,
        tension: 0.25,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, isPositiveTrend ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.25)');
          gradient.addColorStop(1, 'rgba(11, 18, 32, 0.0)');
          return gradient;
        },
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: strokeColor,
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A2333',
        titleColor: '#94A3B8',
        bodyColor: '#FFFFFF',
        bodyFont: { weight: 'bold', size: 14 },
        titleFont: { size: 12 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${currencySymbol} ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748B',
          font: { size: 11 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#64748B',
          font: { size: 11 },
          callback: (value) => `${currencySymbol}${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="w-full rounded-2xl bg-navy-700/70 backdrop-blur-md border border-white/10 p-6 shadow-card space-y-6">
      {/* Chart Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-montserrat">Price Trend Chart</h3>
            <p className="text-xs text-slate-400">Historical pricing overview</p>
          </div>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-800/90 border border-white/10 self-stretch sm:self-auto justify-between sm:justify-start">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setDays(range.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                days === range.value
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Line Chart Container */}
      <div className="h-80 md:h-96 w-full">
        <Line ref={chartRef} data={myData} options={options} />
      </div>
    </div>
  );
};

export default CoinChart;