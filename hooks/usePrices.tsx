import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import timeData from "@/api/timeSeriesData.json";
import axios from "axios";

export default function usePrices(
  timePeriod:
    | "TIME_SERIES_INTRADAY"
    | "TIME_SERIES_DAILY"
    | "TIME_SERIES_DAILY_ADJUSTED"
    | "TIME_SERIES_WEEKLY"
    | "TIME_SERIES_WEEKLY_ADJUSTED"
    | "TIME_SERIES_MONTHLY"
    | "TIME_SERIES_MONTHLY_ADJUSTED",
  symbol: string
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const CACHE_KEY = `PRICE_CACHE_${symbol}_${timePeriod}`;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const API_KEY = process.env.EXPO_PUBLIC_STOCK_DATA_API_KEY;

  const url =
    timePeriod === "TIME_SERIES_INTRADAY"
      ? `https://www.alphavantage.co/query?function=${timePeriod}&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
      : `https://www.alphavantage.co/query?function=${timePeriod}&symbol=${symbol}&apikey=${API_KEY}`;

  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_TTL;

      if (isExpired) {
        console.log(`[Cache] Expired for ${symbol}-${timePeriod}`);
        return null;
      }

      console.log(`[Cache] Loaded ${symbol}-${timePeriod} from cache`);
      return data;
    } catch (err) {
      console.error("Error reading cache:", err);
      return null;
    }
  };

  const saveToCache = async (data: any) => {
    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      console.error("Error saving to cache:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const cached = await loadFromCache();
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      try {
        const res = await axios.get(url);
        const json = res.data;

        if (
          json?.["Error Message"] ||
          json?.["Information"] ||
          !process.env.EXPO_PUBLIC_STOCK_DATA_API_KEY
        ) {
          console.warn("AlphaVantage limit reached — using demo or cache");

          if (cached) {
            setData(cached);
          } else {
            // Fall back to demo data
            switch (timePeriod) {
              case "TIME_SERIES_INTRADAY":
                setData(timeData["Time Series (5min)"]);
                break;
              case "TIME_SERIES_DAILY":
              case "TIME_SERIES_DAILY_ADJUSTED":
                setData(timeData["Time Series (Daily)"]);
                break;
              case "TIME_SERIES_WEEKLY_ADJUSTED":
                setData(timeData["Weekly Adjusted Time Series"]);
                break;
              case "TIME_SERIES_MONTHLY":
                setData(timeData["Monthly Time Series"]);
                break;
              case "TIME_SERIES_MONTHLY_ADJUSTED":
                setData(timeData["Monthly Adjusted Time Series"]);
                break;
            }
          }

          setError(null);
          return;
        }

        let parsedData = null;
        switch (timePeriod) {
          case "TIME_SERIES_INTRADAY":
            parsedData = json["Time Series (5min)"];
            break;
          case "TIME_SERIES_DAILY":
          case "TIME_SERIES_DAILY_ADJUSTED":
            parsedData = json["Time Series (Daily)"];
            break;
          case "TIME_SERIES_WEEKLY_ADJUSTED":
            parsedData = json["Weekly Adjusted Time Series"];
            break;
          case "TIME_SERIES_MONTHLY":
            parsedData = json["Monthly Time Series"];
            break;
          case "TIME_SERIES_MONTHLY_ADJUSTED":
            parsedData = json["Monthly Adjusted Time Series"];
            break;
        }

        if (parsedData) {
          setData(parsedData);
          await saveToCache(parsedData);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching prices:", err);
        if (cached) {
          console.log("Using cached data due to fetch error");
          setData(cached);
        } else {
          setData(null);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timePeriod]);

  return { data, loading, error };
}
