import axios from "axios";
import demoData from "./demoTopMovers.json";
import overviewDemoData from "./demoOverview.json";

const BASE = "https://www.alphavantage.co/query";
const ALPHA_VANTAGE_API_KEY = "123";

export const getTopMovers = async () => {
  try {
    const params = {
      function: "TOP_GAINERS_LOSERS",
      apikey: ALPHA_VANTAGE_API_KEY,
    };
    const res = await axios.get(BASE, { params });

    if (res.data?.Note || res.data?.Information) {
      console.warn("AlphaVantage limit reached, using demo data.");
      return demoData;
    }

    return res.data;
  } catch (err) {
    console.error("Error fetching top movers:", err);
    return err;
  }
};

export const getOverview = async (symbol: string) => {
  try {
    const params = {
      function: "OVERVIEW",
      symbol,
      apikey: ALPHA_VANTAGE_API_KEY,
    };
    const res = await axios.get(BASE, { params });

    if (res.data?.Note || res.data?.Information) {
      console.warn("Limit reached for getOverview.");

      const data = overviewDemoData.companies.find((c) => c.Symbol === symbol);
      return data;
    }

    return res.data;
  } catch (err) {
    console.error("Error fetching overview:", err);
    const data = overviewDemoData.companies.find((c) => c.Symbol === symbol);
    return data;
  }
};

export const getTimeSeries = async (symbol: string) => {
  try {
    const params = {
      function: "TIME_SERIES_INTRADAY",
      symbol,
      interval: "60min",
      apikey: ALPHA_VANTAGE_API_KEY,
    };
    const res = await axios.get(BASE, { params });

    if (res.data?.Note || res.data?.Information) {
      console.warn("Limit reached for getTimeSeries.");
      return {
        "Time Series (60min)": {
          "2025-10-28 10:00:00": { "4. close": "130" },
          "2025-10-28 11:00:00": { "4. close": "131.5" },
          "2025-10-28 12:00:00": { "4. close": "133.0" },
          "2025-10-28 13:00:00": { "4. close": "132.8" },
        },
      };
    }

    return res.data;
  } catch (err) {
    console.error("Error fetching time series:", err);
    // Fallback dummy chart data
    return {
      "Time Series (60min)": {
        "2025-10-28 10:00:00": { "4. close": "130" },
        "2025-10-28 11:00:00": { "4. close": "131.5" },
        "2025-10-28 12:00:00": { "4. close": "133.0" },
        "2025-10-28 13:00:00": { "4. close": "132.8" },
      },
    };
  }
};
