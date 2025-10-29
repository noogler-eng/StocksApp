import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import timeData from "@/api/timeSeriesData.json";
import { TimelineType } from "@/utils/types";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Graph({
  timeline,
  symbol,
  setChartTimeline,
}: {
  timeline: TimelineType;
  symbol: string;
  setChartTimeline: any;
}) {
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = show all, 2 = show half, etc.

  const selectedData = useMemo(() => {
    if (timeline === "TIME_SERIES_INTRADAY") {
      return timeData[timeline]?.Data || {};
    }
    return timeData[timeline] || {};
  }, [timeline]);

  const chartData = useMemo(() => {
    const entries = Object.entries(selectedData);
    const mapped = entries.map(([date, v]: any) => ({
      date,
      close: parseFloat(v.close),
    }));
    return mapped.reverse();
  }, [selectedData]);

  // Apply zoom by slicing data
  const visibleData = useMemo(() => {
    const itemsToShow = Math.ceil(chartData.length / zoomLevel);
    return chartData.slice(-itemsToShow); // Show most recent data
  }, [chartData, zoomLevel]);

  const prices = visibleData.map((item) => item.close);
  const dates = visibleData.map((item) => item.date);

  if (!chartData.length) {
    return (
      <View className="flex items-center justify-center h-40">
        <Text className="text-gray-500 mt-2 text-xs">
          No chart data available
        </Text>
      </View>
    );
  }

  // Format date labels based on timeline
  const formatDateLabel = (dateStr: string, index: number) => {
    // Show fewer labels for readability
    const step = Math.max(1, Math.ceil(dates.length / 5));
    if (index % step !== 0) return "";

    if (timeline === "TIME_SERIES_INTRADAY") {
      return dateStr.slice(11, 16); // HH:MM
    } else if (
      timeline === "TIME_SERIES_MONTHLY" ||
      timeline === "TIME_SERIES_MONTHLY_ADJUSTED"
    ) {
      return dateStr.slice(5, 7); // MM
    } else {
      return dateStr.slice(5, 10); // MM-DD
    }
  };

  // Button labels
  const timelineLabels: Record<string, string> = {
    TIME_SERIES_INTRADAY: "5min",
    TIME_SERIES_DAILY: "Daily",
    TIME_SERIES_WEEKLY: "Weekly",
    TIME_SERIES_MONTHLY: "Monthly",
  };

  // Calculate chart dimensions based on zoom
  const chartWidth = SCREEN_WIDTH - 60 + (zoomLevel - 1) * (SCREEN_WIDTH - 60);

  // Calculate Y-axis range for better scaling
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const yAxisMin = minPrice - priceRange * 0.1;
  const yAxisMax = maxPrice + priceRange * 0.1;

  return (
    <View className="bg-white rounded-2xl shadow p-4 mt-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-black">
          {symbol} Price Trend
        </Text>
        <Text className="text-xs text-gray-500">
          {visibleData.length} points
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingRight: 40 }}
      >
        <LineChart
          data={{
            labels: dates.map((d, i) => formatDateLabel(d, i)),
            datasets: [
              {
                data: prices,
                color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={chartWidth}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "0",
            },
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#e5e7eb",
              strokeWidth: 1,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          fromZero={false}
          yAxisLabel="$"
          yAxisSuffix=""
          segments={5}
        />
      </ScrollView>

      {/* Zoom Controls */}
      <View className="flex-row justify-center items-center gap-3 mt-3 mb-2">
        <Text className="text-xs text-gray-600">Zoom:</Text>
        {[1, 2, 3, 4].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setZoomLevel(level)}
            className={`px-3 py-1 rounded-full ${
              zoomLevel === level ? "bg-orange-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                zoomLevel === level ? "text-white" : "text-gray-700"
              }`}
            >
              {level}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-2 flex items-center">
        <View className="flex-row gap-2">
          {[
            "TIME_SERIES_INTRADAY",
            "TIME_SERIES_DAILY",
            "TIME_SERIES_WEEKLY",
            "TIME_SERIES_MONTHLY",
          ].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setChartTimeline(t);
                setZoomLevel(1); // Reset zoom on timeline change
              }}
              className={`px-3 py-2 rounded-full ${
                timeline === t ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-xs ${
                  timeline === t ? "text-white" : "text-gray-700"
                } font-semibold`}
              >
                {timelineLabels[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
