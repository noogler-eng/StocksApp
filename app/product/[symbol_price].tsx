import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import FiftyTwoWeekRange from "@/components/FiftyTwoWeekRange";
import Graph from "@/components/Graph";
import WatchlistButton from "@/components/WatchlistButton";
import LoadingErrorView from "@/components/LoadingErrorView";
import Avtaar from "@/components/Avtaar";
import useOverview from "@/hooks/useOverview";
import { TimelineType } from "@/utils/types";
import { useTheme } from "@/context/ThemeContext";
import GainLoss from "@/components/GainLoss";

export default function ProductScreen() {
  const { symbol_price } = useLocalSearchParams<{ symbol_price: string }>();
  const symbol = symbol_price.split("_")[0];
  const price = symbol_price.split("_")[1];

  const [chartTimeline, setChartTimeline] =
    useState<TimelineType>("TIME_SERIES_DAILY");

  const { data: overview, loading, error } = useOverview(symbol);
  console.log("Overview Data:", overview);

  const { isDark } = useTheme();

  if (loading || error || !overview) {
    return <LoadingErrorView loading={loading} error={error} />;
  }

  return (
    <ScrollView
      className={`flex-1 px-5 ${isDark ? "bg-black" : "bg-white"}`}
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        className={`flex-row items-center justify-between px-4 py-3 mb-2 border-b ${
          isDark ? "border-gray-700 bg-black" : "border-gray-300 bg-white"
        }`}
      >
        <Text
          className={`text-2xl font-extrabold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Detailed Overview
        </Text>
        <WatchlistButton symbol={symbol} price={price} />
      </View>

      {/* Stock Info */}
      <View
        className={`rounded-2xl p-4 shadow-lg my-4 flex-row items-center ${
          isDark ? "bg-neutral-900" : "bg-white"
        }`}
      >
        <Avtaar initials={symbol?.[0] ?? "?"} size={60} />
        <View className="flex-row items-center justify-between w-5/6 p-4">
          <View className="flex items-start">
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {symbol}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {overview.Name.slice(
                0,
                overview.Name.length > 15 ? 15 : overview.Name.length
              )}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {overview.Exchange}
            </Text>
          </View>
          <View>
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              ${price}
            </Text>
            <GainLoss price={price} average={overview["50DayMovingAverage"]} />
          </View>
        </View>
      </View>

      {/* Graph */}
      <Graph
        timeline={chartTimeline}
        symbol={symbol}
        setChartTimeline={setChartTimeline}
      />

      {/* About Section */}
      <View
        className={`border rounded-lg p-4 mb-12 ${
          isDark ? "bg-neutral-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <Text
          className={`font-bold mb-3 text-xl ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          About {symbol}
        </Text>
        <Text className={`${isDark ? "text-gray-300" : "text-gray-800"}`}>
          {overview.Description}
        </Text>

        {/* Tags */}
        <View className="flex-row flex-wrap items-center justify-start gap-3 mt-3">
          <View
            className={`px-4 py-2 rounded-full ${
              isDark ? "bg-orange-950" : "bg-orange-100"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                isDark ? "text-orange-400" : "text-orange-700"
              }`}
            >
              Industry: <Text className="font-bold">{overview.Industry}</Text>
            </Text>
          </View>

          <View
            className={`px-4 py-2 rounded-full ${
              isDark ? "bg-orange-950" : "bg-orange-100"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                isDark ? "text-orange-400" : "text-orange-700"
              }`}
            >
              Sector: <Text className="font-bold">{overview.Sector}</Text>
            </Text>
          </View>
        </View>

        <FiftyTwoWeekRange overview={overview} price={price} />

        {/* Stats */}
        <View className="flex-row justify-between flex-wrap mt-12">
          {[
            [
              "Market Cap",
              `$${(overview.MarketCapitalization / 1e12).toFixed(2)}T`,
            ],
            ["P/E Ratio", overview.PERatio],
            ["Beta", overview.Beta],
            ["Dividend Yield", overview.DividendYield],
            ["Profit Margin", overview.ProfitMargin],
          ].map(([label, value]) => (
            <View key={label} className="flex border-r border-gray-700 pr-1">
              <Text
                className={`text-xs font-bold ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {label}
              </Text>
              <Text
                className={`text-xs ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
