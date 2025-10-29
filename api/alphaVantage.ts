import axios from "axios";

const BASE = "https://www.alphavantage.co/query";
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// 🟢 Fetch Top Gainers, Losers, and Most Actively Traded stocks
export const getTopMovers = async () => {
  const params = {
    function: "TOP_GAINERS_LOSERS",
    apikey: ALPHA_VANTAGE_API_KEY,
  };
  const res = await axios.get(BASE, { params });
  return res.data; // contains top_gainers, top_losers, most_actively_traded
};

// 🟡 Fetch company overview details
export const getOverview = async (symbol: any) => {
  const params = {
    function: "OVERVIEW",
    symbol,
    apikey: ALPHA_VANTAGE_API_KEY,
  };
  const res = await axios.get(BASE, { params });
  return res.data;
};

// 🔵 Fetch intraday time series (for line graph)
export const getTimeSeries = async (symbol: any) => {
  const params = {
    function: "TIME_SERIES_INTRADAY",
    symbol,
    interval: "60min",
    apikey: ALPHA_VANTAGE_API_KEY,
  };
  const res = await axios.get(BASE, { params });
  return res.data;
};
