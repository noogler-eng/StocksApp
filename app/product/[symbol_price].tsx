import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import FiftyTwoWeekRange from "@/components/FiftyTwoWeekRange";
import Graph from "@/components/Graph";
import WatchlistButton from "@/components/WatchlistButton";
import LoadingErrorView from "@/components/LoadingErrorView";
import useOverview from "@/hooks/useOverview";
import { TimelineType } from "@/utils/types";
import { useTheme } from "@/context/ThemeContext";
import OverviewStats from "@/components/OverviewStats";
import StockInfo from "@/components/StockInfo";
import StockAbout from "@/components/StockAbout";

export default function ProductScreen() {
  const { symbol_price } = useLocalSearchParams<{ symbol_price: string }>();
  const symbol = symbol_price.split("_")[0];
  const price = symbol_price.split("_")[1];

  const [chartTimeline, setChartTimeline] =
    useState<TimelineType>("TIME_SERIES_DAILY");

  const { data: overview, loading, error } = useOverview(symbol);

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
      <StockInfo
        symbol={symbol}
        overview={overview}
        price={Number(price)}
        isDark={isDark}
      />

      {/* Graph */}
      <Graph
        timeline={chartTimeline}
        symbol={symbol}
        setChartTimeline={setChartTimeline}
      />

      {/* About Section */}
      <View
        className={`border rounded-2xl p-4 mb-12 mt-6 ${
          isDark
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-gray-200"
        }`}
      >
        <StockAbout symbol={symbol} overview={overview} isDark={isDark} />
        <FiftyTwoWeekRange overview={overview} price={price} />
        <OverviewStats overview={overview} isDark={isDark} />
      </View>
    </ScrollView>
  );
}
