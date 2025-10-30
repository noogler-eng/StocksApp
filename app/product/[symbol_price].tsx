import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import FiftyTwoWeekRange from "@/components/FiftyTwoWeekRange";
import Graph from "@/components/Graph";
import WatchlistButton from "@/components/WatchlistButton";

import { TimelineType } from "@/utils/types";
import LoadingErrorView from "@/components/LoadingErrorView";
import Avtaar from "@/components/Avtaar";
import useOverview from "@/hooks/useOverview";

export default function ProductScreen() {
  const { symbol_price } = useLocalSearchParams<{ symbol_price: string }>();
  const symbol = symbol_price.split("_")[0];
  const price = symbol_price.split("_")[1];

  const [chartTimeline, setChartTimeline] =
    useState<TimelineType>("TIME_SERIES_DAILY");

  const { data: overview, loading, error } = useOverview(symbol);

  if (loading || error || !overview) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5"
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between px-4 py-3 mb-2 border-b border-gray-300 bg-white">
        <Text className="text-2xl font-extrabold">Detailed Overview</Text>
        <WatchlistButton symbol={symbol} price={price} />
      </View>

      <View className="bg-white rounded-2xl p-4 shadow-lg my-4 flex-row items-center">
        <Avtaar initials={symbol?.[0] ?? "?"} size={60} />
        <View className="flex-row items-center justify-between w-5/6 p-4">
          <View className="flex items-start">
            <Text className="text-xl font-bold">{symbol}</Text>
            <Text className=" text-gray-500 text-sm">
              {overview.Name.slice(
                0,
                overview.Name.length > 15 ? 15 : overview.Name.length
              )}
            </Text>
            <Text className="text-sm">{overview.Exchange}</Text>
          </View>
          <View>
            <Text className="text-xl font-bold">${price}</Text>
            <Text className="text-xs font-semibold text-green-400 mt-1">
              +0.00 (0.00%)
            </Text>
          </View>
        </View>
      </View>

      <Graph
        timeline={chartTimeline}
        symbol={symbol}
        setChartTimeline={setChartTimeline}
      />

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

        <FiftyTwoWeekRange overview={overview} price={price} />

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
