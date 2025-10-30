import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { View, Text } from "react-native";

export default function FiftyTwoWeekRange({ overview, price }: any) {
  const low = parseFloat(overview["52WeekLow"]);
  const high = parseFloat(overview["52WeekHigh"]);

  // Normalize current price position (0 to 1)
  const position = Math.min(Math.max((price - low) / (high - low), 0), 1);

  const { isDark } = useTheme();

  const textColor = isDark ? "#e5e7eb" : "#111827"; // main text
  const subTextColor = isDark ? "#9ca3af" : "#6b7280"; // label text
  const barBgColor = isDark ? "#374151" : "#d1d5db"; // track
  const highlightColor = "#f97316"; // orange accent

  return (
    <View className="mt-5">
      <View className="relative flex-row items-center justify-between">
        {/* Low */}
        <View>
          <Text style={{ color: subTextColor, fontSize: 12 }}>52-Week Low</Text>
          <Text
            style={{
              color: textColor,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            ${low}
          </Text>
        </View>

        {/* Range Bar */}
        <View className="relative flex-1 mx-2">
          <View
            style={{
              height: 4,
              backgroundColor: barBgColor,
              borderRadius: 9999,
            }}
          />
          <View
            className="absolute -top-2 items-center"
            style={{
              left: 0,
              right: 0,
              alignItems: "flex-start",
              paddingLeft: `${position * 100}%`,
            }}
          >
            <View style={{ marginLeft: -8, alignItems: "center" }}>
              <Text style={{ color: highlightColor, fontSize: 12 }}>▲</Text>
              <Text
                style={{
                  color: highlightColor,
                  fontSize: 10,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                current ${price}
              </Text>
            </View>
          </View>
        </View>

        {/* High */}
        <View>
          <Text style={{ color: subTextColor, fontSize: 12 }}>
            52-Week High
          </Text>
          <Text
            style={{
              color: textColor,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            ${high}
          </Text>
        </View>
      </View>
    </View>
  );
}
