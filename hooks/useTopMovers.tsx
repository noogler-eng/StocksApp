import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import demoData from "@/api/demoTopMovers.json";
import axios from "axios";

const CACHE_KEY = "TOP_MOVERS_CACHE";
const BASE_URL = "https://www.alphavantage.co/query";
const CACHE_TTL = 5 * 60 * 1000;

export default function useTopMovers() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_TTL;

      if (isExpired) {
        console.log("Cache expired, fetching fresh data...");
        return null;
      }

      console.log("Loaded top movers from cache");
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

      const cachedData = await loadFromCache();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
      }

      try {
        const params = {
          function: "TOP_GAINERS_LOSERS",
          apikey: process.env.EXPO_PUBLIC_STOCK_DATA_API_KEY,
        };

        const res = await axios.get(BASE_URL, { params });
        const apiData = res.data;

        if (
          apiData?.["Error Message"] ||
          apiData?.["Information"] ||
          !process.env.EXPO_PUBLIC_STOCK_DATA_API_KEY
        ) {
          console.warn("AlphaVantage limit reached, using demo or cache.");
          if (cachedData) {
            setData(cachedData);
          } else {
            setData(demoData);
          }
          setError(null);
          return;
        }

        await saveToCache(apiData);
        setData(apiData);
        setError(null);
      } catch (err) {
        console.error("Error fetching top movers:", err);
        if (cachedData) {
          console.log("Using cached data due to error.");
          setData(cachedData);
        } else {
          setData(demoData);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
