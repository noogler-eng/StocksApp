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

  const url =
    timePeriod == "TIME_SERIES_INTRADAY"
      ? `https://www.alphavantage.co/query?function=${timePeriod}&symbol=${symbol}&interval=5min&apikey=${process.env.STOCK_DATA_API_KEY}`
      : `https://www.alphavantage.co/query?function=${timePeriod}&symbol=${symbol}&apikey=${process.env.STOCK_DATA_API_KEY}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(url);

        // https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo
        // https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo
        // https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&apikey=demo
        // https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo

        if (
          res.data?.["Error Message"] ||
          res?.data?.["Information"] ||
          !process.env.STOCK_DATA_API_KEY
        ) {
          if (timePeriod == "TIME_SERIES_INTRADAY") {
            setData(timeData["Time Series (5min)"]);
          } else if (timePeriod == "TIME_SERIES_DAILY") {
            setData(timeData["Time Series (Daily)"]);
          } else if (timePeriod == "TIME_SERIES_DAILY_ADJUSTED") {
            setData(timeData["Time Series (Daily)"]);
          } else if (timePeriod == "TIME_SERIES_WEEKLY_ADJUSTED") {
            setData(timeData["Weekly Adjusted Time Series"]);
          } else if (timePeriod == "TIME_SERIES_MONTHLY") {
            setData(timeData["Monthly Time Series"]);
          } else if (timePeriod == "TIME_SERIES_MONTHLY_ADJUSTED") {
            setData(timeData["Monthly Adjusted Time Series"]);
          }
          setError(null);
          setLoading(false);
          return { data, loading, error };
        }

        if (timePeriod == "TIME_SERIES_INTRADAY") {
          setData(res.data["Time Series (5min)"]);
        } else if (timePeriod == "TIME_SERIES_DAILY") {
          setData(res.data["Time Series (Daily)"]);
        } else if (timePeriod == "TIME_SERIES_DAILY_ADJUSTED") {
          setData(res.data["Time Series (Daily)"]);
        } else if (timePeriod == "TIME_SERIES_WEEKLY_ADJUSTED") {
          setData(res.data["Weekly Adjusted Time Series"]);
        } else if (timePeriod == "TIME_SERIES_MONTHLY") {
          setData(res.data["Monthly Time Series"]);
        } else if (timePeriod == "TIME_SERIES_MONTHLY_ADJUSTED") {
          setData(res.data["Monthly Adjusted Time Series"]);
        }
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
