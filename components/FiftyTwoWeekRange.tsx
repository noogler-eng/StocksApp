import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function FiftyTwoWeekRange({ overview, price }: any) {
  const low = parseFloat(overview["52WeekLow"]);
  const high = parseFloat(overview["52WeekHigh"]);

  const position = Math.min(Math.max((price - low) / (high - low), 0), 1);

  const { isDark } = useTheme();

  const colors = {
    text: isDark ? "#E5E7EB" : "#111827",
    subText: isDark ? "#9CA3AF" : "#6B7280",
    barTrack: isDark ? "#3F3F46" : "#E5E7EB",
    barGradientStart: "#F59E0B",
    barGradientEnd: "#EA580C",
    marker: "#FB923C",
  };

  return (
    <View
      className={`mt-6 p-4 rounded-2xl ${
        isDark
          ? "bg-neutral-900 border border-neutral-800"
          : "bg-white border border-gray-200"
      } shadow-sm`}
    >
      {/* Header */}
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        52-Week Range
      </Text>

      <View className="flex-row items-center justify-between">
        {/* Low */}
        <View className="items-start">
          <Text style={{ color: colors.subText, fontSize: 12 }}>Low</Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 13,
              fontWeight: "700",
              marginTop: 2,
            }}
          >
            ${low.toFixed(2)}
          </Text>
        </View>

        {/* Range Bar */}
        <View className="flex-1 mx-3 relative">
          {/* Base track */}
          <View
            style={{
              height: 3,
              backgroundColor: colors.barTrack,
              borderRadius: 9999,
              overflow: "hidden",
            }}
          >
            {/* Gradient fill */}
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: `linear-gradient(90deg, ${colors.barGradientStart}, ${colors.barGradientEnd})`,
              }}
            />
          </View>

          {/* Marker for current price */}
          <View
            style={{
              position: "absolute",
              left: `${position * 100}%`,
              top: -4,
              transform: [{ translateX: -4 }],
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: colors.marker,
                shadowColor: colors.marker,
                shadowOpacity: 0.8,
                shadowRadius: 6,
                elevation: 3,
              }}
            />
            <Text
              style={{
                color: colors.marker,
                fontSize: 11,
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              ${Number(price).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* High */}
        <View className="items-end">
          <Text style={{ color: colors.subText, fontSize: 12 }}>High</Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 13,
              fontWeight: "700",
              marginTop: 2,
            }}
          >
            ${high.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
