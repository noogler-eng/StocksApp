import React from "react";
import { View, Text } from "react-native";

type StockAboutProps = {
  symbol: string;
  overview: {
    Description: string;
    Industry: string;
    Sector: string;
  };
  isDark?: boolean;
};

export default function StockAbout({
  symbol,
  overview,
  isDark = false,
}: StockAboutProps) {
  return (
    <View
      className={`p-4 rounded-2xl ${
        isDark
          ? "bg-neutral-900 border border-neutral-800"
          : "bg-white border border-gray-200"
      } shadow-sm`}
    >
      {/* Title */}
      <Text
        className={`font-extrabold text-xl mb-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        About {symbol}
      </Text>

      {/* Description */}
      <Text
        className={`text-[13px] leading-5 ${
          isDark ? "text-gray-300" : "text-gray-800"
        }`}
      >
        {overview?.Description
          ? overview.Description.trim()
          : "No description available for this company."}
      </Text>

      {/* Tags */}
      <View className="flex-row flex-wrap items-center gap-2 mt-4">
        {overview?.Industry ? (
          <View
            className={`px-3 py-1.5 rounded-full ${
              isDark ? "bg-orange-950/50" : "bg-orange-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isDark ? "text-orange-400" : "text-orange-700"
              }`}
            >
              Industry:{" "}
              <Text className="font-semibold">{overview.Industry}</Text>
            </Text>
          </View>
        ) : null}

        {overview?.Sector ? (
          <View
            className={`px-3 py-1.5 rounded-full ${
              isDark ? "bg-orange-950/50" : "bg-orange-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isDark ? "text-orange-400" : "text-orange-700"
              }`}
            >
              Sector: <Text className="font-semibold">{overview.Sector}</Text>
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
