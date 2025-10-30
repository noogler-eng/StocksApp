import { useEffect, useState } from "react";
import demoData from "@/api/demoTopMovers.json";
import axios from "axios";

export default function useTopMovers() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const BASE = "https://www.alphavantage.co/query";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          function: "TOP_GAINERS_LOSERS",
          apikey: process.env.STOCK_DATA_API_KEY,
        };
        const res = await axios.get(BASE, { params });

        if (
          res.data?.["Error Message"] ||
          res?.data?.["Information"] ||
          !process.env.STOCK_DATA_API_KEY
        ) {
          console.warn("AlphaVantage limit reached, using demo data.");
          setData(demoData);
          setError(null);
          return;
        }

        console.log("Fetched top movers data:", res.data);
        setData(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching top movers:", err);
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
