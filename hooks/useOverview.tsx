import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import overviewDemoData from "@/api/demoOverview.json";
import axios from "axios";

export default function useOverview(symbol: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const BASE = "https://www.alphavantage.co/query";
  const CACHE_KEY = `OVERVIEW_CACHE_${symbol}`;
  const CACHE_TTL = 24 * 60 * 60 * 1000;
  const API_KEY = process.env.EXPO_PUBLIC_STOCK_DATA_API_KEY;

  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_TTL;

      if (isExpired) {
        console.log(`[Cache] Expired overview for ${symbol}`);
        return null;
      }

      console.log(`[Cache] Loaded overview for ${symbol} from cache`);
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
      console.error("Error saving overview to cache:", err);
    }
  };

  useEffect(() => {
    if (!symbol) return;

    const fetchOverview = async () => {
      setLoading(true);

      const cached = await loadFromCache();
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      try {
        const params = {
          function: "OVERVIEW",
          symbol,
          apikey: API_KEY,
        };

        const res = await axios.get(BASE, { params });
        const json = res.data;

        if (json?.["Error Message"] || json?.["Information"] || !API_KEY) {
          console.warn(
            "AlphaVantage limit reached or invalid response — using demo/cache."
          );

          if (cached) {
            setData(cached);
          } else {
            const fallback = overviewDemoData.companies.find(
              (c) => c.Symbol === symbol
            );
            setData(fallback || null);
            if (!fallback) setError("No overview data available");
            else setError(null);
          }

          return;
        }

        setData(json);
        await saveToCache(json);
        setError(null);
      } catch (err) {
        console.error("Error fetching company overview:", err);
        if (cached) {
          console.log("Using cached overview due to fetch error.");
          setData(cached);
        } else {
          setData(null);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [symbol]);

  return { data, loading, error };
}
