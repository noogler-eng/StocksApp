import React from "react";
import { View, Text } from "react-native";

export default function FiftyTwoWeekRange({ overview, curr_price }: any) {
  const low = parseFloat(overview["52WeekLow"]);
  const high = parseFloat(overview["52WeekHigh"]);

  // Normalize the current price position between 0 and 1
  const position = Math.min(Math.max((curr_price - low) / (high - low), 0), 1);

  return (
    <View className="mt-5">
      <View className="relative flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-gray-500">52-Week Low</Text>
          <Text className="text-xs font-bold text-gray-600">${low}</Text>
        </View>

        <View className="relative flex-1 mx-2">
          <View className="h-1 bg-gray-300 rounded-full" />

          <View
            className="absolute -top-2 items-center"
            style={{
              left: `${position * 400}%`,
              transform: [{ translateX: -8 }],
            }}
          >
            <Text className="text-orange-600 text-xs">▲</Text>
            <Text className="text-[10px] text-orange-700 font-semibold text-center">
              {"current price $" + curr_price}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-xs text-gray-500">52-Week High</Text>
          <Text className="text-xs font-bold text-gray-600">${high}</Text>
        </View>
      </View>
    </View>
  );
}
