import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Loader from './Loader';
import { getCoinChartData } from '../api'; // Import from the central api.js

// Register Chart.js components - this is important
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CoinChart = ({ currency }) => {
  const { id } = useParams();
  const [days, setDays] = useState(1);

  // Fetch chart data using TanStack Query
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['chart', id, currency, days],
    queryFn: () => getCoinChartData({ id, currency, days }),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  if (isLoading) return <Loader />;

  // Prepare data for the chart
  const myData = {
    labels: chartData.map((value) => {
      const date = new Date(value[0]);
      const time = date.getHours() > 12 ? `${date.getHours() - 12}:${String(date.getMinutes()).padStart(2, '0')} PM` : `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} AM`;
      return days === 1 ? time : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `Price in Past ${days} Days in ${currency.toUpperCase()}`,
        data: chartData.map((value) => value[1]),
        borderColor: 'orange',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    elements: {
      point: {
        radius: 0, // Hide the points on the line
      },
    },
  };

  return (
    <div className="flex flex-col items-center mt-10 w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg">
      <Line data={myData} options={options} />
      <div className="flex justify-center mt-6 space-x-4">
        <button onClick={() => setDays(1)} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">24 Hours</button>
        <button onClick={() => setDays(30)} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">1 Month</button>
        <button onClick={() => setDays(365)} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">1 Year</button>
      </div>
    </div>
  );
};

export default CoinChart;