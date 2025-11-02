import React from "react";
import { View, Text } from "react-native";
import Avtaar from "@/components/Avtaar";
import GainLoss from "@/components/GainLoss";
import useColors from "@/hooks/useColors";

type StockInfoProps = {
  symbol: string;
  overview: {
    Name: string;
    Exchange: string;
    "50DayMovingAverage": number;
  };
  price: number;
};

export default function StockInfo({ symbol, overview, price }: StockInfoProps) {
  const colors = useColors();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      className="rounded-3xl p-4 my-4 flex-row items-center border shadow-sm"
    >
      {/* Company Icon / Avatar */}
      <Avtaar initials={symbol?.[0] ?? "?"} size={60} />

      {/* Company Details + Price */}
      <View className="flex-row items-center justify-between flex-1 ml-4">
        {/* Left side - Company info */}
        <View className="flex-1">
          <Text
            style={{ color: colors.textPrimary }}
            className="text-lg font-extrabold"
          >
            {symbol}
          </Text>

          <Text
            numberOfLines={1}
            style={{ color: colors.textSecondary }}
            className="text-sm mt-0.5"
          >
            {overview?.Name?.length > 20
              ? overview.Name.slice(0, 20) + "..."
              : overview.Name}
          </Text>

          <Text style={{ color: colors.muted }} className="text-xs mt-1">
            {overview.Exchange}
          </Text>
        </View>

        {/* Right side - Price + Gain/Loss */}
        <View className="items-end">
          <Text
            style={{ color: colors.textPrimary }}
            className="text-xl font-bold"
          >
            ${price?.toFixed(2)}
          </Text>

          <GainLoss price={price} average={overview["50DayMovingAverage"]} />
        </View>
      </View>
    </View>
  );
}
