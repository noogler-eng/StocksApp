import React from "react";
import { View, Text } from "react-native";
import Avtaar from "@/components/Avtaar";
import GainLoss from "@/components/GainLoss";

type StockInfoProps = {
  symbol: string;
  overview: {
    Name: string;
    Exchange: string;
    "50DayMovingAverage": number;
  };
  price: number;
  isDark?: boolean;
};

export default function StockInfo({ symbol, overview, price, isDark = false }: StockInfoProps) {
  return (
    <View
      className={`rounded-3xl p-4 my-4 flex-row items-center ${
        isDark ? "bg-neutral-900" : "bg-white"
      } border ${isDark ? "border-neutral-800" : "border-gray-200"} shadow-sm`}
    >
      {/* Company Icon / Avatar */}
      <Avtaar initials={symbol?.[0] ?? "?"} size={60} />

      {/* Company Details + Price */}
      <View className="flex-row items-center justify-between flex-1 ml-4">
        {/* Left side - Company info */}
        <View className="flex-1">
          <Text
            className={`text-lg font-extrabold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {symbol}
          </Text>

          <Text
            numberOfLines={1}
            className={`text-sm mt-0.5 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {overview?.Name?.length > 20
              ? overview.Name.slice(0, 20) + "..."
              : overview.Name}
          </Text>

          <Text
            className={`text-xs mt-1 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {overview.Exchange}
          </Text>
        </View>

        {/* Right side - Price + Gain/Loss */}
        <View className="items-end">
          <Text
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            ${price?.toFixed(2)}
          </Text>

          <GainLoss price={price} average={overview["50DayMovingAverage"]} />
        </View>
      </View>
    </View>
  );
}
