import { useEffect, useState } from "react";
import overviewDemoData from "@/api/demoOverview.json";
import axios from "axios";

export default function useOverview(symbol: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const BASE = "https://www.alphavantage.co/query";

  useEffect(() => {
    if (!symbol) return;

    const fetchOverview = async () => {
      setLoading(true);
      try {
        const params = {
          function: "OVERVIEW",
          symbol,
          apikey: process.env.STOCK_DATA_API_KEY,
        };

        const res = await axios.get(BASE, { params });
        console.log(`AlphaVantage Overview (${symbol}) Response:`, res.data);

        // Handle API rate limit or data errors
        if (
          res.data?.["Error Message"] ||
          res?.data?.["Information"] ||
          !process.env.STOCK_DATA_API_KEY
        ) {
          console.warn(
            "AlphaVantage limit reached or invalid response — using demo data."
          );
          const fallback = overviewDemoData.companies.find(
            (c) => c.Symbol === symbol
          );
          setData(fallback || null);
          if (!fallback) setError("No overview data available");
          else setError(null);
          return;
        }

        setData(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching company overview:", err);
        setData(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [symbol]);

  return { data, loading, error };
}
