import axios from 'axios';

const Baseurl = 'https://api.coingecko.com/api/v3';

// Add this new function to your existing api.js file

export const getCoinChartData = async ({ id, currency, days }) => {
  const { data } = await axios.get(`${Baseurl}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`);
  return data.prices;
};

export const getExchanges = async () => {
  const { data } = await axios.get(`${Baseurl}/exchanges`);
  return data;
};

export const getCoins = async (currency) => {
  const { data } = await axios.get(
    `${Baseurl}/coins/markets?vs_currency=${currency}`
  );
  return data;
};

export const getCoinDetails = async (id) => {
  const { data } = await axios.get(`${Baseurl}/coins/${id}`);
  return data;
};