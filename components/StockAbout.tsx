import React from "react";
import { View, Text } from "react-native";
import useColors from "@/hooks/useColors";

type StockAboutProps = {
  symbol: string;
  overview: {
    Description: string;
    Industry: string;
    Sector: string;
  };
};

export default function StockAbout({ symbol, overview }: StockAboutProps) {
  const colors = useColors();

  return (
    <View
      className="p-4 rounded-2xl shadow-sm"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      {/* Title */}
      <Text
        className="font-extrabold text-xl mb-3"
        style={{ color: colors.textPrimary }}
      >
        About {symbol}
      </Text>

      {/* Description */}
      <Text
        className="text-[13px] leading-5"
        style={{ color: colors.textSecondary }}
      >
        {overview?.Description
          ? overview.Description.trim()
          : "No description available for this company."}
      </Text>

      {/* Tags */}
      <View className="flex-row flex-wrap items-center gap-2 mt-4">
        {overview?.Industry ? (
          <View
            className="px-3 py-1.5 rounded-full"
            style={{
              backgroundColor:
                colors === undefined ? "#FEE2E2" : colors.muted + "20",
            }}
          >
            <Text
              className="text-sm font-medium"
              style={{ color: colors.accent }}
            >
              Industry:{" "}
              <Text
                className="font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {overview.Industry}
              </Text>
            </Text>
          </View>
        ) : null}

        {overview?.Sector ? (
          <View
            className="px-3 py-1.5 rounded-full"
            style={{
              backgroundColor:
                colors === undefined ? "#FEE2E2" : colors.muted + "20",
            }}
          >
            <Text
              className="text-sm font-medium"
              style={{ color: colors.accent }}
            >
              Sector:{" "}
              <Text
                className="font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {overview.Sector}
              </Text>
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
