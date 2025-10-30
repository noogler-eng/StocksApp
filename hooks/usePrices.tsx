import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://www.alphavantage.co/query?function=${timePeriod}&symbol=${symbol}&outputsize=full&apikey=${process.env.STOCK_DATA_API_KEY}`
        );

        if (
          res.data?.["Error Message"] ||
          res?.data?.["Information"] ||
          !process.env.STOCK_DATA_API_KEY
        ) {
          setData(timeData[timePeriod]);
          setError(null);
          setLoading(false);
          return { data, loading, error };
        }

        setData(res.data);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, symbol]);

  return { data, loading, error };
}
