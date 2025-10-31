import React from "react";
import { View, Text } from "react-native";

type OverviewProps = {
  overview: {
    MarketCapitalization: number;
    PERatio: string;
    Beta: string;
    DividendYield: string;
    ProfitMargin: string;
  };
  isDark?: boolean;
};

export default function OverviewStats({
  overview,
  isDark = false,
}: OverviewProps) {
  const stats = [
    ["M.Cap", `$${(overview.MarketCapitalization / 1e12).toFixed(2)}T`],
    ["P/E", overview.PERatio],
    ["Beta", overview.Beta],
    ["Div.Yield", overview.DividendYield],
    ["Profit%", overview.ProfitMargin],
  ];

  return (
    <View
      className={`flex-row justify-between items-center mt-8 px-4 py-3 rounded-2xl ${
        isDark ? "bg-[#1a1a1a] rounded-xl" : "bg-[#f3f4f6] rounded-xl"
      }`}
    >
      {stats.map(([label, value]) => (
        <View key={label} className="items-center flex-1">
          <Text
            className={`text-[10px] font-semibold ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {label}
          </Text>
          <Text
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {value || "--"}
          </Text>
        </View>
      ))}
    </View>
  );
}
