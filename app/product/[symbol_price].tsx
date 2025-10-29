import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getOverview } from "@/api/alphaVantage";
import FiftyTwoWeekRange from "@/components/FiftyTwoWeekRange";
import Graph from "@/components/Graph";
import WatchlistButton from "@/components/WatchlistButton";

export default function ProductScreen() {
  const { symbol_price } = useLocalSearchParams<{ symbol_price: string }>();

  console.log("symbol_price param:", symbol_price); 

  const [chartTimeline, setChartTimeline] = useState<
    | "TIME_SERIES_INTRADAY"
    | "TIME_SERIES_DAILY"
    | "TIME_SERIES_DAILY_ADJUSTED"
    | "TIME_SERIES_WEEKLY"
    | "TIME_SERIES_WEEKLY_ADJUSTED"
    | "TIME_SERIES_MONTHLY"
    | "TIME_SERIES_MONTHLY_ADJUSTED"
  >("TIME_SERIES_DAILY");
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const symbol = symbol_price.split("_")[0];
  const price = symbol_price.split("_")[1];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const overviewData = await getOverview(symbol);
        setOverview(overviewData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-black">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row justify-between items-center mt-6 mb-3 px-2 py-3 border-b border-gray-200">
        <View>
          <Text className="text-3xl font-extrabold">Detailed Overview</Text>
        </View>
        <WatchlistButton symbol={symbol} price={price} />
      </View>

      <View>
        <View>
          <View></View>
        </View>
      </View>

      <View>
        <Graph
          timeline={chartTimeline}
          symbol={symbol}
          setChartTimeline={setChartTimeline}
        />
      </View>

      <View className="border border-1 border-gray-200 rounded-lg p-4 mb-12">
        <Text className="font-bold mb-3 text-xl">About {symbol}</Text>
        <Text>{overview.Description}</Text>
        <View className="flex-row flex-wrap items-center justify-start gap-3 mt-3">
          <View className="bg-orange-100 px-4 py-2 rounded-full">
            <Text className="text-orange-700 font-semibold text-sm">
              Industry:
              <Text className="font-bold">{overview.Industry}</Text>
            </Text>
          </View>

          <View className="bg-orange-100 px-4 py-2 rounded-full">
            <Text className="text-orange-700 font-semibold text-sm">
              Sector: <Text className="font-bold">{overview.Sector}</Text>
            </Text>
          </View>
        </View>

        <FiftyTwoWeekRange overview={overview} curr_price={price} />

        <View className="flex-row justify-between flex-wrap mt-12">
          <View className="flex border-r border-gray-300 pr-1">
            <Text className="text-xs font-bold">Market Cap</Text>
            <Text className="text-xs">
              ${(overview.MarketCapitalization / 1000000000000).toFixed(2)}T
            </Text>
          </View>
          <View className="flex border-r border-gray-300 pr-1">
            <Text className="text-xs font-bold">Market Cap</Text>
            <Text className="text-xs">{overview.PERatio}</Text>
          </View>
          <View className="flex border-r border-gray-300 pr-1">
            <Text className="text-xs font-bold">Beta</Text>
            <Text className="text-xs">{overview.Beta}</Text>
          </View>
          <View className="flex border-r border-gray-300 pr-1">
            <Text className="text-xs font-bold">Dividend Yield</Text>
            <Text className="text-xs">{overview.DividendYield}</Text>
          </View>
          <View>
            <Text className="text-xs font-bold">Profit Margin</Text>
            <Text className="text-xs">{overview.ProfitMargin}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
