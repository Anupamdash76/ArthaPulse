import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { IoPulseOutline } from "react-icons/io5";
import Loader from './Loader';
import { getCoinDetails } from '../api';
import CoinChart from './CoinChart';

const CoinDetails = () => {
  const { id } = useParams();
  
  // Note: Using a fixed currency for this page now
  const currency = 'usd'; 

  const { data: coin, isLoading, isError } = useQuery({
    queryKey: ['coin', id],
    queryFn: () => getCoinDetails(id),
  });

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-center text-red-500 py-10">Error fetching coin details.</div>;

  const profit = coin.market_data?.price_change_percentage_24h > 0;

  return (
    <div className='flex flex-col items-center p-8'>
      <div className='w-full max-w-lg bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 text-center text-gray-800 dark:text-white'>
        <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          Last Updated: {new Date(coin.last_updated).toLocaleString()}
        </div>
        <div className="flex justify-center my-4">
          <img src={coin.image.large} alt={coin.name} className="rounded-full h-24 w-24" />
        </div>
        <div className="text-3xl font-bold mb-2 font-montserrat">{coin.name}</div>
        <div className="text-2xl mb-4 font-bold">
          $ {coin.market_data.current_price[currency].toLocaleString()}
        </div>
        <div className={`flex items-center justify-center text-lg mb-4 ${profit ? 'text-green-500' : 'text-red-500'}`}>
          {profit ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
          {coin.market_data.price_change_percentage_24h}%
        </div>
        <div className='flex items-center justify-center text-lg mb-6'>
          <IoPulseOutline className="text-orange-500 mr-2" />
          Market Cap Rank: #{coin.market_cap_rank}
        </div>
        <div className='text-left text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: coin.description['en'].split('. ')[0] + '.' }} />
      </div>
      <CoinChart currency={currency} />
    </div>
  );
};

export default CoinDetails;