import React from "react";
import { View, Text } from "react-native";
import useColors from "@/hooks/useColors";

export default function FiftyTwoWeekRange({ overview, price }: any) {
  const colors = useColors();

  const low = parseFloat(overview["52WeekLow"]);
  const high = parseFloat(overview["52WeekHigh"]);
  const position = Math.min(Math.max((price - low) / (high - low), 0), 1);

  return (
    <View
      className="mt-6 p-4 rounded-2xl shadow-sm"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      {/* Header */}
      <Text
        style={{
          color: colors.textPrimary,
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
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Low</Text>
          <Text
            style={{
              color: colors.textPrimary,
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
              backgroundColor: colors.border,
              borderRadius: 9999,
              overflow: "hidden",
            }}
          >
            {/* Gradient fill (fallback to accent start→end) */}
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colors.gradientStart, 
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
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            High
          </Text>
          <Text
            style={{
              color: colors.textPrimary,
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
