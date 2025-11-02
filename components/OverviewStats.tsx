import React from "react";
import { View, Text } from "react-native";
import useColors from "@/hooks/useColors";

type OverviewProps = {
  overview: {
    MarketCapitalization: number;
    PERatio: string;
    Beta: string;
    DividendYield: string;
    ProfitMargin: string;
  };
};

export default function OverviewStats({ overview }: OverviewProps) {
  const colors = useColors();

  const stats = [
    ["M.Cap", `$${(overview.MarketCapitalization / 1e9).toFixed(2)}T`],
    ["P/E", overview.PERatio],
    ["Beta", overview.Beta],
    ["Div.Yield", overview.DividendYield],
    ["Profit%", overview.ProfitMargin],
  ];

  return (
    <View
      className="flex-row justify-between items-center mt-8 px-4 py-3 rounded-2xl"
      style={{
        backgroundColor: colors.surface,
      }}
    >
      {stats.map(([label, value]) => (
        <View key={label} className="items-center flex-1">
          <Text
            className="text-[10px] font-semibold"
            style={{ color: colors.textSecondary }}
          >
            {label}
          </Text>
          <Text
            className="text-sm font-bold"
            style={{ color: colors.textPrimary }}
          >
            {value || "--"}
          </Text>
        </View>
      ))}
    </View>
  );
}
